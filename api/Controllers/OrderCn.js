import mongoose from "mongoose";
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
  return session
    .withTransaction(async () => {
      const { addressId, code = null } = req.body;
      if (!addressId)
        return next(new HandleERROR("addressId is required", 400));

      const cart = await Cart.findOne({ userId: req.userId }).lean();

      if (!cart || cart.items.length === 0)
        return next(new HandleERROR("cart is empty", 400));

      let discount;
      if (code) {
        discount = await Discount.findOne({ code }).lean();
        const result = checkCode(discount, cart.totalPrice, req.userId);
        if (!result.success) return next(new HandleERROR(result.error, 400));
      }

      const variantIds = cart.items.map((i) => i.productVariantId);
      const variants = await ProductVariant.find({
        _id: { $in: variantIds },
      }).lean();
      const variantMap = new Map(variants.map((v) => [v._id.toString(), v]));

      let newTotal = 0;
      const newItems = cart.items.map((item) => {
        const pv = variantMap.get(item.productVariantId.toString());
        const qty = Math.min(item.quantity, pv.quantity);
        const price = pv.priceAfterDiscount;
        newTotal += qty * price;
        return { ...item, quantity: qty, finalPrice: price };
      });

      if (newTotal !== cart.totalPrice) {
        await Cart.updateOne(
          { _id: cart._id },
          {
            items: newItems,
            totalPrice: newTotal,
          },
          { session }
        );
        return res.status(400).json({
          success: false,
          data: { items: newItems, totalPrice: newTotal },
        });
      }

      let finalTotal = newTotal;
      if (discount) {
        const discountAmount =
          (Math.min(discount.maxPrice || finalTotal, finalTotal) *
            discount.percent) /
          100;
        finalTotal -= discountAmount;
      }

      const orderData = {
        userId: req.userId,
        addressId,
        items: newItems,
        totalPrice: newTotal,
        totalPriceAfterDiscount: finalTotal,
        discountId: discount?._id,
      };
      const order = await Order.create([orderData], { session });

      // const payment = await createPayment(finalTotal,'Rokad E-commerce', order[0]._id);
      // if (!(payment.data && payment.data.code === 100)) {
      //   throw new HandleERROR("Payment failed", 400);
      // }
      const payment = {
        data: { authority: (Math.random() * 10 ** 10).toFixed(2) },
      };

      order[0].authority = payment.data.authority;
      await order[0].save({ session });

      if (discount) {
        await Discount.updateOne(
          { _id: discount._id },
          { $push: { userIdsUsed: req.userId } },
          { session }
        );
      }
      const bulkOps = newItems.map((item) => ({
        updateOne: {
          filter: { _id: item.productVariantId },
          update: { $inc: { quantity: -item.quantity } },
        },
      }));
      await ProductVariant.bulkWrite(bulkOps, { session });

      return res.status(200).json({
        success: true,
        url: `${ZARINPAL.GATEWAY}${payment.data.authority}`,
      });
    })
    .catch((err) => {
      console.log(err);
      session.endSession();
      next(err);
    });
});


export const getOrder = catchAsync(async (req, res, next) => {
  const orderId = mongoose.Types.ObjectId(req.params.id);
  const userId  = mongoose.Types.ObjectId(req.userId);

  const [order] = await Order.aggregate([
    { $match: { _id: orderId, userId } },

    { 
      $lookup: {
        from: 'orders',            
        localField: '_id',
        foreignField: '_id',
        as: 'doc'
      }
    },
    { $unwind: '$doc' },
    { $replaceRoot: { newRoot: '$doc' } },

  
    { $unwind: '$items' },

 
    {
      $lookup: {
        from: 'products',
        localField: 'items.ProductId',
        foreignField: '_id',
        as: 'items.product'
      }
    },
    { $unwind: '$items.product' },

    {
      $lookup: {
        from: 'productvariants',
        localField: 'items.ProductVariantId',
        foreignField: '_id',
        as: 'items.variant'
      }
    },
    { $unwind: '$items.variant' },

    {
      $lookup: {
        from: 'categories',
        localField: 'items.categoryId',
        foreignField: '_id',
        as: 'items.category'
      }
    },
    { $unwind: '$items.category' },

    {
      $group: {
        _id: '$_id',
        totalPrice:             { $first: '$totalPrice' },
        totalPriceAfterDiscount:{ $first: '$totalPriceAfterDiscount' },
        discountId:             { $first: '$discountId' },
        userId:                 { $first: '$userId' },
        addressId:              { $first: '$addressId' },
        status:                 { $first: '$status' },
        authority:              { $first: '$authority' },
        refId:                  { $first: '$refId' },
        createdAt:              { $first: '$createdAt' },
        updatedAt:              { $first: '$updatedAt' },
        items: { $push: {
          quantity:     '$items.quantity',
          finalPrice:   '$items.finalPrice',
          ProductId:    '$items.product._id',
          product:      '$items.product',
          ProductVariantId:'$items.variant._id',
          variant:      '$items.variant',
          categoryId:   '$items.category._id',
          category:     '$items.category'
        } }
      }
    },

    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },

    {
      $lookup: {
        from: 'addresses',
        localField: 'addressId',
        foreignField: '_id',
        as: 'address'
      }
    },
    { $unwind: '$address' },

    {
      $project: {
        _id: 1,
        totalPrice: 1,
        totalPriceAfterDiscount: 1,
        discountId: 1,
        status: 1,
        authority: 1,
        refId: 1,
        createdAt: 1,
        updatedAt: 1,
        items: 1,
        user: {
          _id: '$user._id',
          fullname: '$user.fullname',
          username: '$user.username',
          phoneNumber: '$user.phoneNumber',
          role: '$user.role'
        },
        address: 1
      }
    }
  ]);

  if (!order) {
    return next(new HandleERROR('Order not found or unauthorized', 404));
  }

  res.status(200).json({ success: true, data: order });
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
    .populate('userId addressId')
    .limitFields();
  const data = await features.execute();
  return res.status(200).json(data);
});
export const zarinpalCallback = catchAsync(async (req, res, next) => {
  const { Authority, orderId } = req.query;
  const userId = req.userId; // اضافه شد

  const session = await mongoose.startSession();
  await session
    .withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);
      if (!order) return next(new HandleERROR("Order not found", 404));

      const amount = order.totalPriceAfterDiscount || order.totalPrice;
      const result = await verifyPayment(amount, Authority);

      if (result.data && result.data.code === 100 && result.data.ref_id) {
        // پرداخت موفق
        order.status = "success";
        order.refId = result.data.ref_id;
        await order.save({ session });

        const boughtProductIds = order.items.map((item) => item.productId);
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

      const bulkOps = order.items.map((item) => ({
        updateOne: {
          filter: { _id: item.productVariantId },
          update: { $inc: { quantity: item.quantity } },
        },
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
    })
    .catch((err) => {
      session.endSession();
      next(err);
    });

  session.endSession();
});

export const changeStatus = catchAsync(async (req, res, next) => {
  const { status = null, orderId = null } = req.body;
  const userId = req.userId;

  if (!status || !orderId) {
    return next(new HandleERROR("status and orderId required", 400));
  }

  const session = await mongoose.startSession();
  await session
    .withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);
      if (!order) return next(new HandleERROR("Order not found", 404));

      if (status === "success") {
        order.status = "success";
        await order.save({ session });

        const boughtProductIds = order.items.map((item) => item.productId);
        if (boughtProductIds.length > 0) {
          await User.updateOne(
            { _id: userId },
            { $addToSet: { boughtProductIds: { $each: boughtProductIds } } },
            { session }
          );
        }
      } else {
        order.status = "failed";
        await order.save({ session });

        const bulkOps = order.items.map((item) => ({
          updateOne: {
            filter: { _id: item.productVariantId },
            update: { $inc: { quantity: item.quantity } },
          },
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
      }

      res.status(200).json({ message: "Order status updated successfully" });
    })
    .catch((err) => {
      session.endSession();
      next(err);
    });

  session.endSession();
});
