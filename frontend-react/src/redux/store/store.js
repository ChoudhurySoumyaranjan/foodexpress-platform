import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import categoryReducer from "../slice/categorySlice";
import foodReducer from "../slice/foodSlice";
import cartReducer from "../slice/cartSlice";
import orderReducer from "../slice/orderSlice";

export const store = configureStore({
    reducer: {
    auth: authReducer,
    categories: categoryReducer,
    foods: foodReducer,
    cart:cartReducer,
    orders:orderReducer
  },
})
