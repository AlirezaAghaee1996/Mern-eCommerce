import mongoose from "mongoose";
import User from "../Models/UserMd.js";
import Order from "../Models/OrderMd.js";
import Cart from "../Models/CartMd.js";
import ProductVariant from "../Models/ProductVariantMd.js";
import Product from "../Models/ProductsMd.js";
import Category from "../Models/CategoryMd.js";
import Brand from "../Models/BrandMd.js";
import Comment from "../Models/CommentMd.js";
import Rate from "../Models/RateMd.js";
import Discount from "../Models/DiscountCodeMd.js";
import Slider from "../Models/SliderMd.js";
import Address from "../Models/AddressMd.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";

// Dynamically resolve collection names to ensure accuracy
const USER_COLL = User.collection.name;
const ORDER_COLL = Order.collection.name;
const CART_COLL = Cart.collection.name;
const PV_COLL = ProductVariant.collection.name;
const PROD_COLL = Product.collection.name;
const CAT_COLL = Category.collection.name;
const ADDR_COLL = Address.collection.name;

// Helper to build date filter
const buildDateMatch = (startDate, endDate, field = 'createdAt') => {
  const match = {};
  if (startDate) match[field] = { ...(match[field] || {}), $gte: new Date(startDate) };
  if (endDate) match[field] = { ...(match[field] || {}), $lte: new Date(endDate) };
  return Object.keys(match).length ? match : null;
};

// 1. User & Authentication Reports
export const getTotalUsers = catchAsync(async (req, res, next) => {
  const total = await User.countDocuments();
  res.status(200).json({ success: true, data: { total } });
});

export const getNewVsActiveUsers = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const match = buildDateMatch(startDate, endDate, 'createdAt');

  const newUsers = await User.countDocuments(match || {});
  const activeUserIds = await Order.distinct('userId', match ? match : {});
  res.status(200).json({ success: true, data: { newUsers, activeUsers: activeUserIds.length } });
});

// 2. Product & Catalog Reports
export const getInventoryLevels = catchAsync(async (req, res, next) => {
  const threshold = parseInt(req.query.threshold, 10) || 10;
  const lowStock = await ProductVariant.aggregate([
    { $match: { quantity: { $lte: threshold } } },
    { $project: { _id: 1, quantity: 1 } }
  ]);
  res.status(200).json({ success: true, data: lowStock });
});

export const getSalesByCategory = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const dateMatch = buildDateMatch(startDate, endDate, 'createdAt');

  const pipeline = [];
  if (dateMatch) pipeline.push({ $match: dateMatch });
  pipeline.push(
    { $unwind: '$items' },
    { $lookup: { from: PV_COLL, localField: 'items.productVariantId', foreignField: '_id', as: 'variant' } },
    { $unwind: '$variant' },
    { $lookup: { from: PROD_COLL, localField: 'variant.productId', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $group: { _id: '$product.categoryId', totalRevenue: { $sum: '$items.finalPrice' }, totalQuantity: { $sum: '$items.quantity' } } },
    { $lookup: { from: CAT_COLL, localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { _id: 0, category: '$category.name', totalRevenue: 1, totalQuantity: 1 } }
  );

  const sales = await Order.aggregate(pipeline);
  res.status(200).json({ success: true, data: sales });
});

// 3. Sales & Order Reports
export const getOrderStatusCounts = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const dateMatch = buildDateMatch(startDate, endDate, 'createdAt');

  const pipeline = dateMatch ? [{ $match: dateMatch }] : [];
  pipeline.push({ $group: { _id: '$status', count: { $sum: 1 } } });

  const stats = await Order.aggregate(pipeline);
  res.status(200).json({ success: true, data: stats });
});

export const getRevenueSummary = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const match = buildDateMatch(startDate, endDate, 'createdAt');

  const pipeline = [];
  if (match) pipeline.push({ $match: match });
  pipeline.push(
    { $group: { _id: null, gross: { $sum: '$totalPrice' }, net: { $sum: '$totalPriceAfterDiscount' } } },
    { $project: { _id: 0, gross: 1, net: 1 } }
  );

  const [summary] = await Order.aggregate(pipeline);
  res.status(200).json({ success: true, data: summary || { gross: 0, net: 0 } });
});

// 4. Cart & Checkout Reports
export const getAbandonedCartRate = catchAsync(async (req, res, next) => {
  const totalCarts = await Cart.countDocuments();
  const orderedUserIds = await Order.distinct('userId');
  const abandonedCount = await Cart.countDocuments({ userId: { $nin: orderedUserIds } });
  const rate = totalCarts ? (abandonedCount / totalCarts) * 100 : 0;
  res.status(200).json({ success: true, data: { totalCarts, abandonedCount, rate } });
});

// 5. Customer Interaction Reports
export const getCommentsStats = catchAsync(async (req, res, next) => {
  const total = await Comment.countDocuments();
  const approved = await Comment.countDocuments({ isActive: true });
  res.status(200).json({ success: true, data: { total, approved } });
});

export const getRatingsStats = catchAsync(async (req, res, next) => {
  const [stats] = await Rate.aggregate([
    { $group: { _id: null, avgRate: { $avg: '$rate' }, totalCount: { $sum: '$rateCount' } } },
    { $project: { _id: 0, avgRate: 1, totalCount: 1 } }
  ]);
  res.status(200).json({ success: true, data: stats || { avgRate: 0, totalCount: 0 } });
});

// 6. Marketing & Promotions
export const getDiscountPerformance = catchAsync(async (req, res, next) => {
  const perf = await Discount.aggregate([
    { $project: { _id: 0, code: 1, uses: { $size: '$userIdsUsed' }, isActive: 1 } }
  ]);
  res.status(200).json({ success: true, data: perf });
});

// 7. Logistics & Geography
export const getShippingByRegion = catchAsync(async (req, res, next) => {
  const data = await Order.aggregate([
    { $lookup: { from: ADDR_COLL, localField: 'addressId', foreignField: '_id', as: 'addr' } },
    { $unwind: '$addr' },
    { $group: { _id: { province: '$addr.province', city: '$addr.city' }, count: { $sum: 1 } } },
    { $project: { _id: 0, province: '$_id.province', city: '$_id.city', count: 1 } }
  ]);
  res.status(200).json({ success: true, data });
});

// 8. System Health & Audit
export const getDataGrowth = catchAsync(async (req, res, next) => {
  const counts = await Promise.all([
    User.countDocuments(), Order.countDocuments(), ProductVariant.countDocuments(), Category.countDocuments(), Brand.countDocuments(), Cart.countDocuments()
  ]);
  res.status(200).json({ success: true, data: {
    users: counts[0], orders: counts[1], variants: counts[2], categories: counts[3], brands: counts[4], carts: counts[5]
  }});
});
