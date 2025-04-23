import mongoose from "mongoose";
const orderSchema=new mongoose.Schema({
    totalPrice:{
        type:Number
    },
    totalPriceAfterDiscount:{
        type:Number
    },
    discountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'DiscountCode'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    addressId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address'
    },
    status:{
        type:String,
        enum:['pending','success','failed'],
        default:'pending'
    },
    authority:{
        type:String
    },
    items:{
        type:Array
    },
    refId:{
        type:String
    }
},{timestamps:true})

const Order=mongoose.model('Order',orderSchema)
export default Order