import Comment from "../Models/CommentMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
export const create = catchAsync(async (req, res, next) => {
  const { userId } = req.userId;
  const comment = await Comment.create({ ...req.body, userId });
  return res.status(201).json({
    success: true,
    data: comment,
    message: "Comment Created successfully",
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  const features = await ApiFeatures(Comment, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "username fullname phoneNumber" },
      { path: "productId" },
    ]);
  const data = await features.execute();
  return res.status(200).json(data);
});
export const getOne = catchAsync(async (req, res, next) => {
    let role=null
  if(req?.headers?.authorization){
    role=jwt?.verify(req?.headers?.authorization.split(' ')[1],process.env.JWT_SECRET).role
  }
    const features = await ApiFeatures(Comment, req.query, role)
    .addManualFilters({productId:req.params.id})
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "username fullname phoneNumber" },
      { path: "productId" },
    ]);
  const data = await features.execute();
  return res.status(200).json(data);
});
export const changeActivity = catchAsync(async (req, res, next) => {
    const comment=await Comment.findById(req.params.id)
    comment.isActive=comment.isActive
    const newComment=await comment.save()
    return res.status(201).json({
        success: true,
        data: newComment,
        message: "Comment Change activities",
      });
});
export const remove = catchAsync(async (req, res, next) => {
    await Comment.findByIdAndDelete(req.params.id)
    return res.status(201).json({
        success: true,
        message: "Comment deleted successfully",
      });
});
