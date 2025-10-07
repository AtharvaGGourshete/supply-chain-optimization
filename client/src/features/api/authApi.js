// src/features/api/authApi.js (UPDATED)
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

// Single source of truth base URL
const API_BASE = import.meta.env.VITE_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE + "/api/auth", // <--- Adjusted Base URL for auth routes
    credentials: "include", // CRUCIAL: Sends the HTTP-Only Cookie with every request
  }),
  endpoints: (builder) => ({
    
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Token is now in HTTP-Only Cookie; only user data is needed
          dispatch(userLoggedIn({ user: result.data.user })); 
          // Removed localStorage.setItem("token") and localStorage.setItem("user")
        } catch (err) {
          // no-op
        }
      },
    }),
    
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Token is in HTTP-Only Cookie; only user data is needed
          dispatch(userLoggedIn({ user: result.data.user }));
          // Removed localStorage.setItem("token") and localStorage.setItem("user")
        } catch (error) {
          // no-op
        }
      },
    }),
    
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } finally {
          // Server clears the cookie; client clears the state
          dispatch(userLoggedOut());
          // Removed localStorage cleanup
        }
      },
    }),
    
    // This is the PERSISTENCE QUERY
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // The user is loaded from the /profile endpoint, which uses the cookie
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          // On error (e.g., token expired), explicitly log out
          dispatch(userLoggedOut());
        }
      },
    }),
    
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
} = authApi;