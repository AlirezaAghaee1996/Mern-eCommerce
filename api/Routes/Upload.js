import express from "express";
import upload from '../Utils/uploadFile.js';
import { deleteFile, uploadCn } from "../Controllers/UploadCn.js";
const uploadRouter = express.Router();
uploadRouter
  .route("/")
  .post(upload.single("file"), uploadCn)
  .delete( deleteFile);

export default uploadRouter;
