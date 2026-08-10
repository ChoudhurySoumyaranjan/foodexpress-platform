import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
};

const saveCart = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const food = action.payload;

      const existingItem = state.items.find((item) => item.foodId === food.id);

      if (existingItem) {
        // Prevent exceeding stock
        if (existingItem.quantity < food.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({
          foodId: food.id,
          foodName: food.foodName,
          imageUrl: food.imageUrl,
          discountedPrice: food.discountedPrice,
          stock: food.stock,
          quantity: 1,
        });
      }

      saveCart(state.items);
    },

    increaseQuantity: (state, action) => {
      const foodId = action.payload;

      const item = state.items.find((item) => item.foodId === foodId);

      if (item) {
        // Prevent exceeding stock
        if (item.quantity < item.stock) {
          item.quantity += 1;
        }
      }

      saveCart(state.items);
    },

    decreaseQuantity: (state, action) => {
      const foodId = action.payload;

      const item = state.items.find((item) => item.foodId === foodId);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.foodId !== foodId);
        }
      }

      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      const foodId = action.payload;

      state.items = state.items.filter((item) => item.foodId !== foodId);

      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },

    setCart: (state, action) => {
      state.items = action.payload;
      saveCart(state.items);
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
