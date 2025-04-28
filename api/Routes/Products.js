import express from "express";
import {
  create,
  favoriteProduct,
  getAll,
  getOne,
  remove,
  update,
} from "../Controllers/ProductsCn.js";
import { isAdmin } from "../Middlewares/isAdmin.js";
import { isLogin } from "../Middlewares/isLogin.js";
const productRouter = express.Router();
productRouter.route("/").get(getAll).post(isAdmin, create);
productRouter.route('/favorite').post(isLogin,favoriteProduct)
productRouter
  .route("/:id")
  .get(getOne)
  .patch(isAdmin, update)
  .delete(isAdmin, remove);
export default productRouter;
