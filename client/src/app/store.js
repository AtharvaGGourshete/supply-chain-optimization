// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import analysisReducer from "../features/analysisSlice";
import { analysisApi } from "../features/api/analysisApi";
import { userApi } from "../features/api/userApi";
import authReducer from "../features/authSlice";
import { authApi } from "../features/api/authApi";

const rootReducer = combineReducers({
  auth: authReducer,
  analysis: analysisReducer,
  [analysisApi.reducerPath]: analysisApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['analysis'], // Persist only analysis slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(analysisApi.middleware, userApi.middleware, authApi.middleware),
});

export const persistor = persistStore(store);
