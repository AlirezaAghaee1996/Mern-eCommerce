import mongoose from "mongoose";
const sliderSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'title is required']
    },
    image:{
        type:String,
        required:[true,'image is required']

    },
    href:{
        type:String,
        required:[true,'href is required']
    }

    
},{timestamps:true})

const Slider=mongoose.model('Slider',sliderSchema)
export default Slider

