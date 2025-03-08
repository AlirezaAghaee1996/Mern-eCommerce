import express from  'express'
import { create, getAll, getOne, remove, update } from '../Controllers/CategoryCn.js'
import { isAdmin } from '../Middlewares/isAdmin.js'
const brandRouter=express.Router()
 brandRouter.route('/').get(getAll).post(isAdmin,create)
 brandRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove)
export default brandRouter