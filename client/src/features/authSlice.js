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
          console.log('LOGIN PAYLOAD:', payload); // ← debug
          state.isAuthenticated = true;
          state.user = payload.user;
          if (payload.token) {
            localStorage.setItem('token', payload.token);
            console.log('TOKEN SAVED:', localStorage.getItem('token')); // ← debug
          } else {
            console.log('NO TOKEN IN PAYLOAD'); // ← debug
          }
        }
      )
      .addMatcher(
        authApi.endpoints.registerUser.matchFulfilled,
        (state, { payload }) => {
          console.log('REGISTER PAYLOAD:', payload); // ← debug
          state.isAuthenticated = true;
          state.user = payload.user;
          if (payload.token) {
            localStorage.setItem('token', payload.token);
            console.log('TOKEN SAVED:', localStorage.getItem('token')); // ← debug
          }
        }
      )
      .addMatcher(
        authApi.endpoints.loadUser.matchFulfilled,
        (state, { payload }) => {
          console.log('LOAD USER PAYLOAD:', payload); // ← debug
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
      .addMatcher(authApi.endpoints.loadUser.matchRejected, (state, action) => {
        console.log('LOAD USER REJECTED:', action.payload); // ← debug
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('token');
      });
  },
});

export default authSlice.reducer;