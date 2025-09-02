import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

// Single source of truth base URL
const API_BASE = import.meta.env.VITE_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE + "/api",
    credentials: "include", // if using httpOnly cookies
    // If bearer token is used instead of cookies, uncomment:
    // prepareHeaders: (headers, { getState }) => {
    //   const token = localStorage.getItem("token");
    //   if (token) headers.set("authorization", `Bearer ${token}`);
    //   return headers;
    // },
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
          dispatch(userLoggedIn({ user: result.data.user }));
          // optional: persist token if using bearer
          if (result.data.token) localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
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
          dispatch(userLoggedIn({ user: result.data.user }));
          if (result.data.token) localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
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
          dispatch(userLoggedOut());
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
          localStorage.setItem("user", JSON.stringify(result.data.user));
        } catch (error) {
          // silent
        }
      },
    }),
    // updateUser: builder.mutation({
    //   query: (formData) => ({
    //     url: "profile/update",
    //     method: "PUT",
    //     body: formData,
    //   }),
    // }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
} = authApi;
