import Product from "../Models/ProductsMd.js";
import Brand from "../Models/BrandMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
export const create = catchAsync(async(req, res, next) => {
    const brands=await Brand.create(req.body)
    return res.status(201).json({
        success:true,
        data:brands,
        message:'Brand create successfully'
    })
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Brand, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const brands = await features.query;
  const count = await Brand.countDocuments(req?.query?.filters);
  return res.status(200).json({
    success: true,
    data: brands,
    count,
  });
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  return res.status(200).json({
    success: true,
    data: brand,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: brand,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.findOne({ brandId: id });
  if (products) {
    return next(
      new HandleERROR(
        "you can't delete this brans, please first delete all Product of this brands",
        400
      )
    );
  }
  await Brand.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    message:'brand deleted successfully'
  });
});
