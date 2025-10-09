// path: frontend/src/pages/DashboardPage.jsx

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetAnalysisDataQuery } from '../features/api/analysisApi';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SingleProductDashboard } from '../components/dashboards/SingleProductDashboard';
import { AggregateDashboard } from '../components/dashboards/AggregateDashboard';

const DashboardPage = () => {
  // 1) Read any persisted analysis from Redux (redux-persist should rehydrate this)
  const { singleData, aggregateData, activeAnalysis } = useSelector((state) => state.analysis);

  // 2) If we already have local data, skip the query to avoid flicker; otherwise fetch from server
  const hasLocal = !!(singleData || aggregateData);
  const { data, isFetching, refetch } = useGetAnalysisDataQuery(undefined, { skip: hasLocal });

  // 3) Decide which dataset to display: prefer local if present, else use server response
  const resolved = useMemo(() => {
    if (hasLocal) {
      return {
        single: singleData || null,
        aggregate: aggregateData || null,
      };
    }
    if (data) {
      return {
        single: data.singleProductAnalysis || null,
        aggregate: data.aggregateAnalysis || null,
      };
    }
    return { single: null, aggregate: null };
  }, [hasLocal, singleData, aggregateData, data]);

  // 4) Pick the active view:
  // - If activeAnalysis is set, honor it when the corresponding data exists
  // - Else default to whichever dataset exists
  const which = useMemo(() => {
    if (activeAnalysis === 'single' && resolved.single) return 'single';
    if (activeAnalysis === 'aggregate' && resolved.aggregate) return 'aggregate';
    if (resolved.single) return 'single';
    if (resolved.aggregate) return 'aggregate';
    return null;
  }, [activeAnalysis, resolved]);

  // 5) Render states
  if (!hasLocal && isFetching) {
    return (
      <div className="flex justify-center items-center h-[50vh] bg-white">
        <div className="animate-spin h-16 w-16 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!which) {
    return (
      <div className="bg-white text-black p-4 sm:p-8">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto min-h-[60vh]">
          <div className="bg-white rounded-2xl p-10 w-full border border-gray-200 shadow-sm">
            <AlertCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">No Analysis Found</h2>
            <p className="text-gray-600 mt-2">
              Upload a CSV on the Warehouse Setup page to generate analysis, then return to the dashboard.
            </p>
            <Link to="/warehouse">
              <Button
                size="lg"
                className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold h-12 px-8"
              >
                Go to Warehouse Setup
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 6) Render the chosen dashboard
  return (
    <div className="bg-white text-black p-4 sm:p-8 space-y-8">
      {which === 'single' && resolved.single && (
        <SingleProductDashboard forecastData={resolved.single} onReset={refetch} />
      )}
      {which === 'aggregate' && resolved.aggregate && (
        <AggregateDashboard aggregateData={resolved.aggregate} onReset={refetch} />
      )}
    </div>
  );
};

export default DashboardPage;
