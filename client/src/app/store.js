// path: frontend/src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/authSlice";
import analysisReducer from "@/features/analysisSlice";
import { authApi } from "@/features/api/authApi";
import { analysisApi } from "@/features/api/analysisApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [analysisApi.reducerPath]: analysisApi.reducer,
    auth: authReducer,
    analysis: analysisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(analysisApi.middleware),
});
