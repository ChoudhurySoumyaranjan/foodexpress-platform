import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryList: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,

  reducers: {
    setCategories: (state, action) => {
      state.categoryList = action.payload;
    },

    addCategory: (state, action) => {
      state.categoryList.push(action.payload);
    },

    removeCategory: (state, action) => {
      state.categoryList = state.categoryList.filter(
        (category) =>{ return category.id !== action.payload}
      );
    },

    updateCategory: (state, action) => {
      state.categoryList = state.categoryList.map((category) =>
        category.id === action.payload.id ? action.payload : category,
      );
    },
  },
});

export const { setCategories, addCategory, removeCategory, updateCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
