import User from "../Models/UserMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";

export const getAll = catchAsync(async(req, res, next) => {
    const features = new ApiFeatures(User,req.query,req?.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate()
    const data=await features.execute()
    return res.status(200).json(data);
});
export const getOne = catchAsync(async(req, res, next) => {
    const {id}=req.params
    if(req.role!='admin'&& req.userId!=id){
        return next(new HandleERROR("You Don't have a permission",401))
    }
    const user=await User.findById(id).select('-password -__v')
    return res.status(200).json({
        success:true,
        data:user
    })
});
export const update = catchAsync(async(req, res, next) => {
    const {id}=req.params
    if(req.role!='admin'&& req.userId!=id){
        return next(new HandleERROR("You Don't have a permission",401))
    }
    const {fullname=null,username=null,role=null}=req.body

    const user=await User.findById(id)
    user.fullname=fullname || user?.fullname
    user.username=username || user?.username
    if(req.role=='admin' && role){
        user.role=role
    }
    if(user.fullname && user.password && user.username){
        user.isComplete=true
    }
    const newUser=await user.save()
    return res.status(200).json({
        success:true,
        data:newUser
    })
});
