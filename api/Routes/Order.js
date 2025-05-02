import express from 'express';
import { changeStatus, createOrder, getAll, getOrder, zarinpalCallback } from '../Controllers/OrderCn.js';
import { isLogin } from '../Middlewares/isLogin.js';
const orderRouter = express.Router();

orderRouter.route('/').post(isLogin,createOrder).get(isLogin,getAll)
orderRouter.route('/zarinpal/callback').get(zarinpalCallback);
orderRouter.route('/change-status').post(isLogin,changeStatus);
orderRouter.route('/:id').get(isLogin,getOrder);


export default orderRouter