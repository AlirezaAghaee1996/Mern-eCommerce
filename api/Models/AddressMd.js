import mongoose from "mongoose";
const addressSchema=new mongoose.Schema({
    city:{
        type:String,
        required:[true,'city is required']
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiverName:{
        type:String,
        required:[true,'receiverName is required']
    },
    receiverPhoneNumber:{
        type:String,
        required:[true,'receiverPhoneNumber is required'],
        match:[/^(\+98|0)?9\d{9}$/,'phone is not valid']
    },
    postalCode:{
        type:String,
        required:[true,'postalCode is required'],
    },
    street:{
        type:String,
        required:[true,'street is required']
    },
    plaque:{
        type:String,
        required:[true,'plaque is required']
    },
    province:{
        type:String,
        required:[true,'province is required']
    },
    description:{
        type:String,
    }

},{timestamps:true})

const Address=mongoose.model('Address',addressSchema)
export default Address