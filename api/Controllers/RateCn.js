import Rate from "../Models/RateMd.js";
import User from "../Models/UserMd.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";

export const create = catchAsync(async (req, res, next) => {
  const { productId = null, ...others } = req.body;
  const user = await User.findById(req.userId);
  if (!user.boughtProductIds.includes(productId)) {
    return next(new HandleERROR("you can not rate this product", 400));
  }
  const rate = await Rate.findOne({productId});
  if (rate.userIds.includes(req.userId)) {
    return next(new HandleERROR("you had rated this product", 400));
  }
  rate.userIds.push(req.userId)
  let rtCount=rate.rateCount
  let totalRate=rtCount*rate.rate + req.body.rate
  rate.rate=totalRate/(rtCount+1)
  rate.rateCount=rate.rateCount+1
  const newRate=await rate.save()
  return res.status(200).json({
    success: true,
    data: newRate,
    message: "rating successfully",
  });
});

