import Product from "../Models/ProductsMd.js";
import Category from "../Models/CategoryMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
export const create = catchAsync(async(req, res, next) => {
    const categories=await Category.create(req.body)
    return res.status(201).json({
        success:true,
        data:categories,
        message:'Category create successfully'
    })
});

export const getAll = catchAsync(async (req, res, next) => {
    let queryString;
    if(req?.userId && req?.role=='admin'){
        queryString=req.query
    }else{
        queryString={...req.query,filters:{...req.query.filter,isActive:true}}
    }
  const features = new ApiFeatures(Category, queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const categories = await features.query;
  const count = await Category.countDocuments(queryString?.filters);
  return res.status(200).json({
    success: true,
    data: categories,
    count,
  });
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
  await Category.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    message:'category deleted successfully'
  });
});
