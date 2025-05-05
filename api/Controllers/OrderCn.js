import mongoose from "mongoose";
import Cart from "../Models/CartMd.js";
import Discount from "../Models/DiscountCodeMd.js";
import Order from "../Models/OrderMd.js";
import ProductVariant from "../Models/ProductVariantMd.js";
import User from '../Models/UserMd.js'
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
  const orderId = req.params.id;
  const userId = req.userId;

  const [order] = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId),
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    // Lookup برای محصولات
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    // Lookup برای واریانت‌ها
    {
      $lookup: {
        from: "productvariants",
        localField: "items.productVariantId",
        foreignField: "_id",
        as: "variantDetails"
      }
    },
    // Lookup برای دسته‌بندی‌ها
    {
      $lookup: {
        from: "categories",
        localField: "items.categoryId",
        foreignField: "_id",
        as: "categoryDetails"
      }
    },
    // Lookup برای کاربر (userId)
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    // Lookup برای آدرس (addressId)
    {
      $lookup: {
        from: "addresses",
        localField: "addressId",
        foreignField: "_id",
        as: "addressDetails"
      }
    },
    {
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              $mergeObjects: [
                "$$item",
                {
                  product: {
                    $arrayElemAt: [
                      "$productDetails",
                      {
                        $indexOfArray: ["$productDetails._id", "$$item.productId"]
                      }
                    ]
                  },
                  productVariant: {
                    $arrayElemAt: [
                      "$variantDetails",
                      {
                        $indexOfArray: ["$variantDetails._id", "$$item.productVariantId"]
                      }
                    ]
                  },
                  category: {
                    $arrayElemAt: [
                      "$categoryDetails",
                      {
                        $indexOfArray: ["$categoryDetails._id", "$$item.categoryId"]
                      }
                    ]
                  }
                }
              ]
            }
          }
        },
        // اضافه کردن اطلاعات کاربر و آدرس
        user: { $arrayElemAt: ["$userDetails", 0] },
        address: { $arrayElemAt: ["$addressDetails", 0] }
      }
    },
    {
      $project: {
        productDetails: 0,
        variantDetails: 0,
        categoryDetails: 0,
        userDetails: 0,
        addressDetails: 0,
        // مخفی کردن فیلدهای حساس کاربر
        "user.password": 0,
        "user.__v": 0,
        "user.createdAt": 0,
        "user.updatedAt": 0
      }
    }
  ]);

  if (!order) {
    return next(new HandleERROR('Order not found or unauthorized', 404));
  }

  return res.status(200).json({ success: true, data: order });
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
  console.log(data)
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
