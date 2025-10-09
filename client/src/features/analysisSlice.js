import { createSlice } from "@reduxjs/toolkit";
import { analysisApi } from "./api/analysisApi"; // We will create this next

const initialState = {
  singleData: null,
  aggregateData: null,
  activeAnalysis: null, // 'single' or 'aggregate'
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setActiveAnalysis: (state, action) => {
      state.activeAnalysis = action.payload;
    },
  },
  extraReducers: (builder) => {
    // When the getAnalysisData query is fulfilled, populate the state
    builder.addMatcher(
      analysisApi.endpoints.getAnalysisData.matchFulfilled,
      (state, { payload }) => {
        state.singleData = payload.singleProductAnalysis || null;
        state.aggregateData = payload.aggregateAnalysis || null;

        // Set a default active view if none is set
        if (!state.activeAnalysis) {
            if (payload.singleProductAnalysis) state.activeAnalysis = 'single';
            else if (payload.aggregateAnalysis) state.activeAnalysis = 'aggregate';
        }
      }
    );
     // After a new forecast is run, update the state directly from the mutation result
     builder.addMatcher(
        analysisApi.endpoints.runSingleForecast.matchFulfilled,
        (state, { payload }) => {
            state.singleData = payload;
            state.activeAnalysis = 'single'; // Automatically switch to the new view
        }
    );
    builder.addMatcher(
        analysisApi.endpoints.runAggregateForecast.matchFulfilled,
        (state, { payload }) => {
            state.aggregateData = payload;
            state.activeAnalysis = 'aggregate'; // Automatically switch to the new view
        }
    );
  },
});

export const { setActiveAnalysis } = analysisSlice.actions;
export default analysisSlice.reducer;
