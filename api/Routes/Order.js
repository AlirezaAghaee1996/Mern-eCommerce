import express from 'express';
import { createOrder, getOrder, listOrders, payOrder, zarinpalCallback } from '../Controllers/OrderCn.js';
const orderRouter = express.Router();

orderRouter.route('/').post(createOrder).get(listOrders)
orderRouter.route('/:id').get(getOrder);
orderRouter.route('/:id/pay').post(payOrder);
orderRouter.route('/zarinpal/callback').get(zarinpalCallback);

export default orderRouter