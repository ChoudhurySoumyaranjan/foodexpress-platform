import { createSlice } from "@reduxjs/toolkit";

const loadOrdersFromStorage = () => {
  try {
    const orders = localStorage.getItem("orders");
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const saveOrdersToStorage = (orders) => {
  localStorage.setItem("orders", JSON.stringify(orders));
};

const initialState = {
  orders: loadOrdersFromStorage(),
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    placeOrder: (state, action) => {
      state.orders.unshift(action.payload);

      saveOrdersToStorage(state.orders);
    },
  },
});

export const { placeOrder } = orderSlice.actions;

export default orderSlice.reducer;
