import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { getAll, getOne, update } from '../Controllers/UserCn.js'
import { isLogin } from '../Middlewares/isLogin.js'
const userRouter=express.Router()
userRouter.route('/').get(isAdmin,getAll)
userRouter.route('/:id').get(isLogin,getOne).patch(isLogin,update)
export default userRouter