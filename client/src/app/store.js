import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/authSlice";
import { authApi } from "@/features/api/authApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
