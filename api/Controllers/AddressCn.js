import Address from "../Models/AddressMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";

export const getAll = catchAsync(async(req, res, next) => {
    let queryString={...req.query}
    if(req.role!='admin'){
        queryString={...queryString,filters:[...queryString.filters,{userId:req.userId}]}
    }
  const features = new ApiFeatures(Address,queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .nestedPopulate({path:'userId',select:'username fullname phoneNumber'})
    const addresses=await features.query
    return res.status(200).json({
        success:true,
        data:addresses
    })
});
export const getOne = catchAsync(async(req, res, next) => {
    const {id}=req.params
   
    const address=await Address.findById(id)
    if(req.role!='admin'&& address.userId!=req.userId){
        return next(new HandleERROR("You Don't have a permission",401))
    }
    return res.status(200).json({
        success:true,
        data:address
    })
});
export const update = catchAsync(async(req, res, next) => {
    const {id}=req.params
   const {userId=null,...others}=req.body
    const address=await Address.findById(id)
    if(req.role!='admin'&& address.userId!=req.userId){
        return next(new HandleERROR("You Don't have a permission",401))
    }
    const newAddress=await Address.findByIdAndUpdate(id,others,{new :true,runValidators:true})
    return res.status(200).json({
        success:true,
        data:newAddress,
        message:'address update successfully'

    })
});
export const remove = catchAsync(async(req, res, next) => {
    const {id}=req.params
    const address=await Address.findById(id)
    if(req.role!='admin'&& address.userId!=req.userId){
        return next(new HandleERROR("You Don't have a permission",401))
    }
    await Address.findByIdAndDelete(id)
    return res.status(200).json({
        success:true,
        message:'address remove successfully'
    })
});
export const create = catchAsync(async(req, res, next) => {
    const address=await Address.create({...req.body,userId:req.userId})
 
    return res.status(201).json({
        success:true,
        data:address,
        message:'address create successfully'
    })
});
