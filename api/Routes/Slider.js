import express from  'express'
import { create, getAll, getOne, remove, } from '../Controllers/SliderCn.js'
import { isAdmin } from '../Middlewares/isAdmin.js'
const sliderRouter=express.Router()
 sliderRouter.route('/').get(getAll).post(isAdmin,create)
 sliderRouter.route('/:id').get(isAdmin,getOne).delete(isAdmin,remove)
export default sliderRouter