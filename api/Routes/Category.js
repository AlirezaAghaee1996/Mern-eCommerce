import express from  'express'
import { create, getAll, getOne, remove, update } from '../Controllers/CategoryCn.js'
import { isAdmin } from '../Middlewares/isAdmin.js'
const categoryRouter=express.Router()
 categoryRouter.route('/').get(getAll).post(isAdmin,create)
 categoryRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove)
export default categoryRouter