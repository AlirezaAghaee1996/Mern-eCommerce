import express from  'express'
import { adminLogin, auth, checkOtp, checkPassword, forgetPassword, resendCode } from '../Controllers/AuthCn.js'
const authRouter=express.Router()
authRouter.route('/').post(auth)
authRouter.route('/otp').post(checkOtp)
authRouter.route('/admin').post(adminLogin)
authRouter.route('/password').post(checkPassword)
authRouter.route('/forget').post(forgetPassword)
authRouter.route('/resend').post(resendCode)

export default authRouter