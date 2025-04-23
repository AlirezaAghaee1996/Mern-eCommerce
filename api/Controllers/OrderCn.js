// controllers/orderController.js
import Order from '../models/Order.js';
import { createPayment, verifyPayment } from '../Service/ZarinpalService.js';
import catchAsync from '../Utils/catchAsync.js';
import HandleERROR from '../Utils/handleError.js';

// Create new order
export const createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create({
    ...req.body,
    totalPrice: req.body.totalPrice,
    totalPriceAfterDiscount: req.body.totalPriceAfterDiscount
  });
  res.status(201).json(order);
});

export const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new HandleERROR('Order not found', 404);
  res.json(order);
});

export const listOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

export const payOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new HandleERROR('Order not found', 404);
  const amount = order.totalPriceAfterDiscount || order.totalPrice;
  const result = await createPayment(amount, `Order #${order._id}`, order._id);
  if (result.data && result.data.code === 100) {
    order.authority = result.data.authority;
    await order.save();
    return res.json({ url: `${ZARINPAL.GATEWAY}${result.data.authority}` });
  }
  throw new HandleERROR(result.errors?.[0]?.message || 'Payment initiation failed', 400);
});

export const zarinpalCallback = catchAsync(async (req, res, next) => {
  const { Authority, orderId } = req.query;
  const order = await Order.findById(orderId);
  if (!order) throw new HandleERROR('Order not found', 404);
  const amount = order.totalPriceAfterDiscount || order.totalPrice;
  const result = await verifyPayment(amount, Authority);
  if (result.data && result.data.code === 100 && result.data.ref_id) {
    order.status = 'success';
    order.refId = result.data.ref_id;
    await order.save();
    return res.redirect(`${process.env.CLIENT_URL}/payment-success?ref=${result.data.ref_id}`);
  }
  order.status = 'failed';
  await order.save();
  return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
});