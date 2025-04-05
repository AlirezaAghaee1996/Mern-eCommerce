import Slider from "../Models/SliderMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import fs from "fs";
import { __dirname } from "../app.js";
export const create = catchAsync(async (req, res, next) => {
  const slider = await Slider.create(req.body);
  return res.status(201).json({
    success: true,
    data: slider,
    message: "Slider create successfully",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Slider,req.query,req?.role)
  .filter()
  .sort()
  .limitFields()
  .paginate()
  .populate()
  const data=await features.execute()
  return res.status(200).json(data);
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const slider = await Slider.findById(id);
  return res.status(200).json({
    success: true,
    data: slider,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const slider = await Slider.findByIdAndDelete(id);
  if (slider.image) {
    fs.unlinkSync(`${__dirname}/Public/${slider.image}`);
  }
  return res.status(200).json({
    success: true,
    message: "slider deleted successfully",
  });
});
