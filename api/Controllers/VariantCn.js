import ProductVariant from "../Models/ProductVariantMd.js";
import Product from "../Models/ProductsMd.js";
import Variant from "../Models/VariantMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { __dirname } from "../app.js";
export const create = catchAsync(async(req, res, next) => {
    const variants=await Variant.create(req.body)
    return res.status(201).json({
        success:true,
        data:variants,
        message:'Variant create successfully'
    })
});

export const getAll = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Variant,req.query,req?.role)
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
  const variant = await Variant.findById(id);
  return res.status(200).json({
    success: true,
    data: variant,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const variant = await Variant.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: variant,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await ProductVariant.findOne({ variantId: id });
  if (products) {
    return next(
      new HandleERROR(
        "you can't delete this variant, please first delete all Product of this variants",
        400
      )
    );
  }
   await Variant.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    message:'variant deleted successfully'
  });
});
