import Product from "../Models/ProductsMd.js";
import Category from "../Models/CategoryMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import fs from "fs";
import { __dirname } from "../app.js";
export const create = catchAsync(async(req, res, next) => {
    const categories=await Category.create(req.body)
    return res.status(201).json({
        success:true,
        data:categories,
        message:'Category create successfully'
    })
});

export const getAll = catchAsync(async (req, res, next) => {
  
    const features = new ApiFeatures(Category,req.query,req?.role)
    .filter()
    .manualFilters(req?.role=='admin' ?{isActive:true}:'' )
    .sort()
    .limitFields()
    .paginate()
    .populate()
    const data=await features.execute()
    return res.status(200).json(data);
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  return res.status(200).json({
    success: true,
    data: category,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: category,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.findOne({ categoryId: id });
  if (products) {
    return next(
      new HandleERROR(
        "you can't delete this Category, please first delete all Product of this categories",
        400
      )
    );
  }
  const category=await Category.findByIdAndDelete(id);
  if (category.image) {
    fs.unlinkSync(`${__dirname}/Public/${category.image}`);
  }
  return res.status(200).json({
    success: true,
    message:'category deleted successfully'
  });
});
