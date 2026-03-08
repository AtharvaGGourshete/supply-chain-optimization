import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.loginUser.matchFulfilled,
        (state, { payload }) => {
          state.isAuthenticated = true;
          state.user = payload.user;
          if (payload.token) {
            localStorage.setItem('token', payload.token);
          }
        }
      )
      .addMatcher(
        authApi.endpoints.registerUser.matchFulfilled,
        (state, { payload }) => {
          state.isAuthenticated = true;
          state.user = payload.user;
          if (payload.token) {
            localStorage.setItem('token', payload.token);
          }
        }
      )
      .addMatcher(
        authApi.endpoints.loadUser.matchFulfilled,
        (state, { payload }) => {
          state.isAuthenticated = true;
          state.user = payload;
        }
      )
      .addMatcher(
        authApi.endpoints.logoutUser.matchFulfilled,
        (state) => {
          state.isAuthenticated = false;
          state.user = null;
          localStorage.removeItem('token');
        }
      )
      .addMatcher(
        authApi.endpoints.loadUser.matchRejected,
        (state, action) => {
          // Only logout on explicit 401, ignore network/server errors
          if (action.payload?.status === 401) {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('token');
          }
        }
      );
  },
});

export default authSlice.reducer;
