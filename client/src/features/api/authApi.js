import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = import.meta.env.VITE_API_URL;

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_BASE + "/api/auth",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,
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