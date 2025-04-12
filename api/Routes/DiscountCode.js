import express from "express";
import { isAdmin } from "../Middlewares/isAdmin.js";
import {
  create,
  getAll,
  getOne,
  remove,
  check,
  update,
} from "../Controllers/DiscountCodeCn.js";
import { isLogin } from "../Middlewares/isLogin.js";
const discountRouter = express.Router();
discountRouter.route("/").get(isAdmin, getAll).post(isAdmin, create);
discountRouter.route("/check").post(isLogin, check);
discountRouter
  .route("/:id")
  .get(isAdmin, getOne)
  .patch(isAdmin, update)
  .delete(isAdmin, remove);
export default discountRouter;
