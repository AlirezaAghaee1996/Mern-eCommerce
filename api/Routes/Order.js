import express from 'express';
import { changeStatus, createOrder, getAll, getOrder, zarinpalCallback } from '../Controllers/OrderCn.js';
const orderRouter = express.Router();

orderRouter.route('/').post(createOrder).get(getAll)
orderRouter.route('/zarinpal/callback').get(zarinpalCallback);
orderRouter.route('/change-status').post(changeStatus);
orderRouter.route('/:id').get(getOrder);


export default orderRouter