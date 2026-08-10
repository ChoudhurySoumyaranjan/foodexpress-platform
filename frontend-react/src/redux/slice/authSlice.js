import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,          // start with true → show loader until we check/refresh
  enabled:false
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.enabled=action.payload.user.isEnabled
    },

    updateAccessToken: (state, action) => {   
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      state.enabled=true
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.enabled=false;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const { loginSuccess, updateAccessToken, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;