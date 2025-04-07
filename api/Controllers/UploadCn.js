import catchAsync from "../Utils/catchAsync.js";
import HandleError from "../Utils/handleError.js";
import fs from "fs";
import { __dirname } from "../app.js";

export const uploadCn = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new HandleError("UPLOAD failed", 400));
  }
  return res.status(201).json({
    success:true,
    file: file,
  });
});


export const deleteFile = catchAsync(async (req, res, next) => {
  const { fileName } = req.body;
  console.log(fileName)
  const deleteFileName = fileName?.split("/")?.at(-1);

  if (deleteFileName == "*") {
    return next(new HandleError("File not found", 400));
  }
  if (!fileName) {
    return next(new HandleError("File not found", 400));
  }
  fs.unlinkSync(`${__dirname}/Public/${deleteFileName}`);

  return res.status(200).json({
    success: true,
    message: "File removed",
  });
});
