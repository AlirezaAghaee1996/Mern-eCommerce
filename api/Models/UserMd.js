import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    fullname:{
        type:String
    },
    username:{
        type:String
    },
    phoneNumber:{
        type:String,
        required:[true,'phone number is required'],
        match:[/^(\+98|0)?9\d{9}$/,'phone is not valid']
    },
    password:{
        type:String,
    },
    favoriteProduct:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
            }
        ],
        default:[]
    }
    ,
    isComplete:{
        default:false,
        type:Boolean
    },
    role:{
        type:String,
        default:'user',
        enum:['admin','user']
    }
},{timestamps:true})

const User=mongoose.model('User',userSchema)
export default User

