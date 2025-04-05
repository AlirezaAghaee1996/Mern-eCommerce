import express from "express";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "../Controllers/ProductsCn.js";
import { isAdmin } from "../Middlewares/isAdmin.js";
const productRouter = express.Router();
productRouter.route("/").get(getAll).post(isAdmin, create);
productRouter
  .route("/:id")
  .get(getOne)
  .patch(isAdmin, update)
  .delete(isAdmin, remove);
export default productRouter;
