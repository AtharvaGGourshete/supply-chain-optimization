// path: frontend/src/features/api/userApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = import.meta.env.VITE_API_URL;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/api/users`,
    credentials: "include", // Important for sending cookies
  }),
  tagTypes: ["User"], // Define a tag for user-related data

  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "profile",
      providesTags: ["User"], // This query provides the 'User' tag
    }),
    
    updateProfile: builder.mutation({
      query: (updatedData) => ({
        url: "profile",
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["User"], // This mutation invalidates the 'User' tag, forcing a refetch
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
