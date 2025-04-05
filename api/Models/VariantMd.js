import mongoose from "mongoose";
const variantSchema=new mongoose.Schema({
    type:{
        type:String,
        enum:['size','color'],
        required:[true,'type is required']
    },
    value:{
        type:String,
        required:[true,'value is required']
    }
})
const Variant=mongoose.model('Variant',variantSchema)
export default Variant