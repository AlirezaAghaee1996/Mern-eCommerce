
import Cart from "../Models/CartMd.js";
import Discount from "../Models/DiscountCodeMd.js";
import Order from "../Models/OrderMd.js";
import ProductVariant from "../Models/ProductVariantMd.js";
import {
  createPayment,
  verifyPayment,
  ZARINPAL,
} from "../Service/ZarinpalService.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { checkCode } from "./DiscountCodeCn.js";

// Create new order
export const createOrder = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  return session.withTransaction(async () => {
    const { addressId, code = null } = req.body;
    if (!addressId) return next(new HandleERROR("addressId is required", 400));

    const cart = await Cart.findOne({ userId: req.userId }).lean();
    if (!cart || cart.items.length === 0)
      return next(new HandleERROR("cart is empty", 400));

    let discount;
    if (code) {
      discount = await Discount.findOne({ code }).lean();
      const result = checkCode(discount, cart.totalPrice, req.userId);
      if (!result.success) return next(new HandleERROR(result.error, 400));
    }

    const variantIds = cart.items.map(i => i.productVariantId);
    const variants = await ProductVariant.find({ _id: { $in: variantIds } }).lean();
    const variantMap = new Map(variants.map(v => [v._id.toString(), v]));

    let newTotal = 0;
    const newItems = cart.items.map(item => {
      const pv = variantMap.get(item.productVariantId.toString());
      const qty = Math.min(item.quantity, pv.quantity);
      const price = pv.priceAfterDiscount;
      newTotal += qty * price;
      return { ...item, quantity: qty, finalPrice: price };
    });

    if (newTotal !== cart.totalPrice) {
      await Cart.updateOne({ _id: cart._id }, {
        items: newItems,
        totalPrice: newTotal
      }, { session });
      return res.status(400).json({ success: false, data: { items: newItems, totalPrice: newTotal } });
    }

    let finalTotal = newTotal;
    if (discount) {
      const discountAmount = Math.min(discount.maxPrice || finalTotal, finalTotal) * discount.percent / 100;
      finalTotal -= discountAmount;
    }

    const orderData = {
      userId: req.userId,
      addressId,
      items: newItems,
      totalPrice: newTotal,
      totalPriceAfterDiscount: finalTotal,
      discountId: discount?._id
    };
    const order = await Order.create([orderData], { session });

    const payment = await createPayment(finalTotal,'Rokad E-commerce', order[0]._id);
    if (!(payment.data && payment.data.code === 100)) {
      throw new HandleERROR("Payment failed", 400);
    }

    order[0].authority = payment.data.authority;
    await order[0].save({ session });

    if (discount) {
      await Discount.updateOne({ _id: discount._id }, { $push: { userIdsUsed: req.userId } }, { session });
    }
    const bulkOps = newItems.map(item => ({
      updateOne: {
        filter: { _id: item.productVariantId },
        update: { $inc: { quantity: -item.quantity } }
      }
    }));
    await ProductVariant.bulkWrite(bulkOps, { session });

    return res.status(200).json({ success: true, url: `${ZARINPAL.GATEWAY}${payment.data.authority}` });
  }).catch(err => {
    session.endSession();
    next(err);
  });
});


export const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new HandleERROR("Order not found", 404));
  return res.status(200).json(order);
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Order, req.query, req.role)
    .addManualFilters(
      req?.role != "admin" && req?.role != "superAdmin"
        ? { userId: req.userId }
        : null
    )
    .filter()
    .sort()
    .paginate()
    .populate()
    .limitFields();
  const data = await features.execute();
  return res.status(200).json(data);
});
export const zarinpalCallback = catchAsync(async (req, res, next) => {
  const { Authority, orderId } = req.query;
  const userId = req.userId; // اضافه شد

  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const order = await Order.findById(orderId).session(session);
    if (!order) return next(new HandleERROR("Order not found", 404));

    const amount = order.totalPriceAfterDiscount || order.totalPrice;
    const result = await verifyPayment(amount, Authority);

    if (result.data && result.data.code === 100 && result.data.ref_id) {
      // پرداخت موفق
      order.status = "success";
      order.refId = result.data.ref_id;
      await order.save({ session });

      const boughtProductIds = order.items.map(item => item.productId);
      if (boughtProductIds.length > 0) {
        await User.updateOne(
          { _id: userId },
          { $addToSet: { boughtProductIds: { $each: boughtProductIds } } },
          { session }
        );
      }

      return res.redirect(
        `${process.env.CLIENT_URL}/payment-success?ref=${result.data.ref_id}`
      );
    }

    order.status = "failed";
    await order.save({ session });

    const bulkOps = order.items.map(item => ({
      updateOne: {
        filter: { _id: item.productVariantId },
        update: { $inc: { quantity: item.quantity } }
      }
    }));
    if (bulkOps.length > 0) {
      await ProductVariant.bulkWrite(bulkOps, { session });
    }

    if (order.discountId) {
      await Discount.updateOne(
        { _id: order.discountId },
        { $pull: { userIdsUsed: userId } }, 
        { session }
      );
    }

    return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
  }).catch(err => {
    session.endSession();
    next(err);
  });

  session.endSession();
});
