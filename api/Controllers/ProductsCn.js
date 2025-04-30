import Product from "../Models/ProductsMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import fs from "fs";
import { __dirname } from "../app.js";
import ProductVariant from "../Models/ProductVariantMd.js";
import User from "../Models/UserMd.js";
import Rate from "../Models/RateMd.js";
export const create = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  const rate=await Rate.create({productId:product._id})
  product.rateId=rate._id
  const newProduct=await product.save()
  return res.status(201).json({
    success: true,
    data: newProduct,
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
  const token=req?.headers?.authorization?.split(' ')?.at(1)
  let favoriteProduct;
  let boughtProduct;
  if(token){
    const {id:userId}=jwt.verify(token,process.env.JWT_SECRET)
    const user=await User.findById(userId)
    boughtProduct=user.boughtProductIds?.includes(e=>String(e)==String(product._id))
    favoriteProduct=user.favoriteProduct?.includes(e=>String(e)==String(product._id))
    
  }
  return res.status(200).json({
    success: true,
    data: {product,favoriteProduct,boughtProduct},
    
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

export const favoriteProduct=catchAsync(async(req,res,next)=>{
  const {productId:id}=req.body
  const userId=req.userId
  const user=await User.findById(userId)
  let add;
  if(user.favoriteProduct.indexOf(e=>String(e)==String(id))>=0){
    add=false
    user.favoriteProduct=user.favoriteProduct.slice(user.favoriteProduct.indexOf(e=>String(e)==String(id)),1)
  }else{
    add=true
    user.favoriteProduct.push(id)
  }
  await user.save()
  return res.status(200).json({
    success:true,data:{add}
  })

})