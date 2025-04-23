import mongoose from "mongoose";
const rateSchema = new mongoose.Schema({
  rate: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  rateCount: {
    type: Number,
    default: 0,
  },
  userIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default:[]
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
},{timestamps:true});
const Rate=mongoose.model('Rate',rateSchema)
export default Rate
