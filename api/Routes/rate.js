import express from 'express'
import { isLogin } from '../Middlewares/isLogin.js'
import { create } from '../Controllers/rateCn.js'
const rateRouter=express.Router()

rateRouter.route('/').post(isLogin,create)
export default rateRouter