import express from 'express';
import { createOrder, getAll, getOrder, zarinpalCallback } from '../Controllers/OrderCn.js';
const orderRouter = express.Router();

orderRouter.route('/').post(createOrder).get(getAll)
orderRouter.route('/:id').get(getOrder);
orderRouter.route('/zarinpal/callback').get(zarinpalCallback);

export default orderRouter