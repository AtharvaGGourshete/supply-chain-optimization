import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = import.meta.env.VITE_API_URL;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/api/users`,
    credentials: "include", // Important for sending cookies
  }),
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "profile", // Makes a GET request to /api/users/profile
      providesTags: ["User"],
    }),
    // You can add mutations for updating the profile here
  }),
});

export const { useGetProfileQuery } = userApi;
