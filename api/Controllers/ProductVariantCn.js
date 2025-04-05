import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import { __dirname } from "../app.js";
import ProductVariant from "../Models/ProductVariantMd.js";
export const create = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.create(req.body);
  return res.status(201).json({
    success: true,
    data: productVariant,
    message: "Brand create successfully",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(ProductVariant,req.query,req?.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate('VariantId')
    const data=await features.execute()
    return res.status(200).json(data);
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const productVariant = await ProductVariant.findById(id).populate(
    "defaultProductVariantId categoryId brandId"
  );
  return res.status(200).json({
    success: true,
    data: productVariant,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const productVariant = await ProductVariant.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: productVariant,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const productVariant = await ProductVariant.findByIdAndDelete(id);
 
  return res.status(200).json({
    success: true,
    message: "productVariant deleted successfully",
  });
});
