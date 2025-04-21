import express from "express";
import { isAdmin } from "../Middlewares/isAdmin.js";
import {
  changeActivity,
  create,
  getAll,
  getOne,
  remove,
  replyComment,
} from "../Controllers/CommentCn.js";
import { isLogin } from "../Middlewares/isLogin.js";
const commentRouter = express.Router();
commentRouter.route("/").get(isAdmin, getAll).post(isLogin, create);
commentRouter.route('/reply/:id').patch(isAdmin,replyComment)
commentRouter
  .route("/:id")
  .get(getOne)
  .patch(isAdmin, changeActivity)
  .delete(isAdmin, remove);
export default commentRouter;
