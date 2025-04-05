import Product from "../Models/ProductsMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import fs from "fs";
import { __dirname } from "../app.js";
import ProductVariant from "../Models/ProductVariantMd.js";
export const create = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    data: product,
    message: "Brand create successfully",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Product,req.query,req?.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate('defaultProductVariantId')
    const data=await features.execute()
    return res.status(200).json(data);
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate(
    "defaultProductVariantId categoryId brandId"
  );
  return res.status(200).json({
    success: true,
    data: product,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: product,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const productVariants = await ProductVariant.deleteMany({ productId: id });

  const product = await Product.findByIdAndDelete(id);
  for (let image of product.imagesUrl) {
    fs.unlinkSync(`${__dirname}/Public/${image}`);
  }
  return res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});
