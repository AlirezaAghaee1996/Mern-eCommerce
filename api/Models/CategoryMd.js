import mongoose from "mongoose";
const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        unique: true, 
        trim: true, 
    },
    image:{
        type:String,
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true, 
    },
    
},{timestamps:true})

const Category=mongoose.model('Category',categorySchema)
export default Category

