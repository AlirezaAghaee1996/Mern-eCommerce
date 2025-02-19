import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/AuthSlice';
import cartSliceReducer from './Slices/CartSlice'
const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        cart : cartSliceReducer
    }
})
export default store