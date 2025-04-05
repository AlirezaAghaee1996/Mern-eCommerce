import express from "express";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "../Controllers/ProductVariantCn.js";
import { isAdmin } from "../Middlewares/isAdmin.js";
const productVariantRouter = express.Router();
productVariantRouter.route("/").get(getAll).post(isAdmin, create);
productVariantRouter
  .route("/:id")
  .get(getOne)
  .patch(isAdmin, update)
  .delete(isAdmin, remove);
export default productVariantRouter;
