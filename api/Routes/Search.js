import  { Router } from "express";
import { search } from "../Controllers/SearchCn.js";
const searchRouter=Router()
searchRouter.route('/').post(search)
export default searchRouter