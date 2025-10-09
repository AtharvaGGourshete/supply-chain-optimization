import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = import.meta.env.VITE_API_URL;

export const analysisApi = createApi({
  reducerPath: "analysisApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE + "/api", // Base URL for these routes
    credentials: "include",
  }),
  tagTypes: ["Analysis"], // A tag for caching invalidation
  endpoints: (builder) => ({
    
    // Query to get existing analysis data for the user
    getAnalysisData: builder.query({
      query: () => "/analysis-results",
      providesTags: ["Analysis"], // This query provides the 'Analysis' tag
    }),

    // Mutation for single product forecast
    runSingleForecast: builder.mutation({
      query: (formData) => ({
        url: "/forecast-and-optimize-product",
        method: "POST",
        body: formData, // Directly use FormData
      }),
      invalidatesTags: ["Analysis"], // On success, invalidate the 'Analysis' tag to force a refetch
    }),

    // Mutation for aggregate forecast
    runAggregateForecast: builder.mutation({
      query: (formData) => ({
        url: "/forecast-aggregate-data",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Analysis"],
    }),

  }),
});

export const {
  useGetAnalysisDataQuery,
  useRunSingleForecastMutation,
  useRunAggregateForecastMutation,
} = analysisApi;
