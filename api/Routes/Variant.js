import express from "express";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "../Controllers/VariantCn.js";
import { isAdmin } from "../Middlewares/isAdmin.js";
const variantRouter = express.Router();
variantRouter.route("/").get(getAll).post(isAdmin, create);
variantRouter
  .route("/:id")
  .get(getOne)
  .patch(isAdmin, update)
  .delete(isAdmin, remove);
export default variantRouter;
