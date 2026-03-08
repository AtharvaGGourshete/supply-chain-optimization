import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = import.meta.env.VITE_API_URL;

export const analysisApi = createApi({
  reducerPath: "analysisApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE + "/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Analysis"],
  endpoints: (builder) => ({
    getAnalysisData: builder.query({
      query: () => "/analysis-results",
      providesTags: ["Analysis"],
    }),
    runSingleForecast: builder.mutation({
      query: (formData) => ({
        url: "/forecast-and-optimize-product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Analysis"],
    }),
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