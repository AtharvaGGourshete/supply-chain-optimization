// path: frontend/src/features/api/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = import.meta.env.VITE_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE + "/api/auth",
    credentials: "include", 
  }),
  tagTypes: ['Auth', 'User'],

  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({ url: "register", method: "POST", body: inputData }),
      invalidatesTags: ['Auth'], 
    }),
    
    loginUser: builder.mutation({
      query: (inputData) => ({ url: "login", method: "POST", body: inputData }),
      invalidatesTags: ['Auth'],
    }),
    
    logoutUser: builder.mutation({
      query: () => ({ url: "logout", method: "GET" }),
      invalidatesTags: ['Auth'],
    }),
    
    loadUser: builder.query({
      query: () => "profile",
      providesTags: ['Auth'], 
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
} = authApi;
