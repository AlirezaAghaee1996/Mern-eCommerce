import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "code is required"],
    trim: true,
  },
  userIdsUsed: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  startTime: {
    type: Date,
    
  },
  expireTime: {
    type: Date,
  },
  percent:{
    type:Number,
    min:1,
    max:100
  },
  maxUsedCount:{
    type:Number,
    default:1
  },
  maxPrice:{
    type:Number,
  },
  minPrice:{
    type:Number,
  },
  isActive:{
    type:Boolean,
    default:false
  }
},{timestamps:true})
const Discount=mongoose.model('Discount',discountSchema)
export default Discount
