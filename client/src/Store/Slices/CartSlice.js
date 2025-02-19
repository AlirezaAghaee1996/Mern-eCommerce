import { createSlice } from "@reduxjs/toolkit";
const initialState={
    list:[],
    totalPrice:0
}
const cartSlice=createSlice({
    name:'cartSlice',
    initialState,
    reducers:{
        add:(state,action)=>{
            let addItem=false
            state.totalPrice+=action.payload.price
            state.list=state.list.map(e=>{
                if(e.id==action.payload.id){
                    e.quantity=e.quantity+1
                    addItem=true
                    return e

                }
                return e
            })
            if(!addItem){
                state.list.push({...action.payload,quantity:1})
            }
        },

        remove:(state,action)=>{
            state.list=state.list.filter((e)=>{
                if(e.id==action.payload.id){
                    state.totalPrice=state.totalPrice-action.payload.price
                    e.quantity=e.quantity-1
                    if(e.quantity==0){
                        return false
                    }
                    return e

                }
                return e
            })
        },
        clear:(state)=>{
            state.list=[]
            state.totalPrice=0
        }
    }
})

export const {add,remove,clear}=cartSlice.actions

export default cartSlice.reducer