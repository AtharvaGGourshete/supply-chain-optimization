// analysisSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { analysisApi } from "../features/api/analysisApi";

const initialState = {
  singleData: null,
  aggregateData: null,
  activeAnalysis: null, // 'single' | 'aggregate'
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setActiveAnalysis: (state, action) => { state.activeAnalysis = action.payload; },
    clearAnalysis: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      analysisApi.endpoints.getAnalysisData.matchFulfilled,
      (state, { payload }) => {
        state.singleData = payload.singleProductAnalysis || null;
        state.aggregateData = payload.aggregateAnalysis || null;
        if (!state.activeAnalysis) {
          if (state.singleData) state.activeAnalysis = 'single';
          else if (state.aggregateData) state.activeAnalysis = 'aggregate';
        }
      }
    );
    builder.addMatcher(
      analysisApi.endpoints.runSingleForecast.matchFulfilled,
      (state, { payload }) => {
        state.singleData = payload;
        state.activeAnalysis = 'single';
      }
    );
    builder.addMatcher(
      analysisApi.endpoints.runAggregateForecast.matchFulfilled,
      (state, { payload }) => {
        state.aggregateData = payload;
        state.activeAnalysis = 'aggregate';
      }
    );
  },
});

export const { setActiveAnalysis, clearAnalysis } = analysisSlice.actions;
export default analysisSlice.reducer;
