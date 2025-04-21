import  { Router } from "express";
import { add, clear, getUserCart, remove } from "../Controllers/CartCn.js";
const cartRouter=Router()
cartRouter.route('/').post(add).get(getUserCart).patch(remove).delete(clear)
export default cartRouter