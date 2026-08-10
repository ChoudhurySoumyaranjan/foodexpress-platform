import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  foodList: [],
};

const foodSlice = createSlice({
  name: "foods",

  initialState,

  reducers: {

    setFoods: (state, action) => {
      state.foodList = action.payload;
    },

    addFood: (state, action) => {
      state.foodList.push(action.payload);
    },

    removeFood: (state, action) => {
      state.foodList = state.foodList.filter(
        (food) => food.id !== action.payload
      );
    },

    updateFood: (state, action) => {
      state.foodList = state.foodList.map((food) =>
        food.id === action.payload.id
          ? action.payload
          : food
      );
    },

  },
});

export const {
  setFoods,
  addFood,
  removeFood,
  updateFood,
} = foodSlice.actions;

export default foodSlice.reducer;
