import mongoose from "mongoose";
const productSchema=new mongoose.Schema({

},{timestamps:true})

const Product=mongoose.model('Product',productSchema)
export default Product

