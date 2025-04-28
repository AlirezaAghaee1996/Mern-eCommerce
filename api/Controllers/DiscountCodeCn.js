import catchAsync from "../Utils/catchAsync.js";
import Discount from "../Models/DiscountCodeMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import HandleERROR from "../Utils/handleError.js";


export const checkCode = (discount, totalPrice, userId) => {
    const now = Date.now()
    const exTime = discount.expireTime.getTime();
    const stTime = discount.startTime.getTime();
    const userUsedCount =
      discount.userIdsUsed?.filter((e) => e.toString() === userId.toString())
        .length || 0;
    let err;
    if (!discount.isActive) {
      err = "discount code is not active";
    } else if (stTime > now) {
      err = "discount is not started";
    } else if (exTime < now) {
      err = "discount is expired";
    } else if (userUsedCount >= discount.maxUsedCount) {
      err = "discount code already used"; 
    } else if (discount?.minPrice && discount.minPrice > totalPrice) {
      err = "discount is not valid for this price";
    }
    return { success: !err, error: err };
  };



export const create = catchAsync(async (req, res, next) => {
  const discount = await Discount.create(req.body);
  return res.status(201).json({
    success: true,
    data: discount,
    message: "discount create successfully",
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Discount, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const data = await features.execute();
  return res.status(200).json(data);
});
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const discount = await Discount.findById(id);
  return res.status(200).json({
    success: true,
    data: discount,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const discount = await Discount.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: discount,
    message: "Discount update successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const discount = await Discount.findById(id);
    if(discount.userIdsUsed?.length>0){
        return next(new HandleERROR('some body use this discount and you can not deleted now',400))
    }
   await discount.deleteOne()
   return res.status(200).json({
    success: true,
    data: discount,
    message: "Discount removed successfully",
  });
});
export const check = catchAsync(async (req, res, next) => {
    const {code=null,totalPrice=null}=req.body
    if(!code||!totalPrice){
        return next(new HandleERROR('code and totalPrice are required',400))
    }
    const discount=await Discount.findOne({code})
    if(!discount){
        return next(new HandleERROR('code incorrect',400))
    }
    const result=checkCode(discount,totalPrice,req.userId)
    if(!result.success){
        return next(new HandleERROR(result.error,400))
    }
    return res.status(200).json({
        success: true,
        data: {
            code,
            discountPercent:discount.percent
        },
      });
});
