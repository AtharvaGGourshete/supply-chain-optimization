import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import analysisReducer from "../features/analysisSlice"; 
import { authApi } from "../features/api/authApi";
import { analysisApi } from "../features/api/analysisApi";
import { userApi } from "../features/api/userApi"; // <-- 1. IMPORT the new userApi

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analysis: analysisReducer,
    [authApi.reducerPath]: authApi.reducer,
    [analysisApi.reducerPath]: analysisApi.reducer,
    [userApi.reducerPath]: userApi.reducer, // <-- 2. ADD the reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      analysisApi.middleware,
      userApi.middleware // <-- 3. ADD the middleware
    ),
});
