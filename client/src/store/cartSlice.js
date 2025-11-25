import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        addToCart: (state, action)=>{
            const product = action.payload;
            const existing = state.items.find(item => item._id === product._id);

            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
        },
        updateQuantity: (state, action)=>{
            const {productId, quantity} = action.payload;
            const item = state.items.find(i=>i._id===productId);
            if(item) item.quantity = quantity;
        },
        removeFromCart : (state, action)=>{
            const productId = action.payload;
            state.items = state.items.filter(i=>i._id !== productId);
        },
        clearCart: (state)=>{
            state.items = [];
        }
    },
});

export const {addToCart, updateQuantity, removeFromCart, clearCart} = cartSlice.actions;

export default cartSlice.reducer;