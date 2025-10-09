// path: frontend/src/pages/DashboardPage.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAnalysisDataQuery } from '../features/api/analysisApi';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SingleProductDashboard } from '../components/dashboards/SingleProductDashboard';
import { AggregateDashboard } from '../components/dashboards/AggregateDashboard';
// ** DELETE THESE - They are now in ProtectedRoute **
// import SleekNavbar from '@/components/Navbar';
// import Footer from '@/components/Footer';

const DashboardPage = () => {
    const { isLoading, refetch } = useGetAnalysisDataQuery();
    const { singleData, aggregateData, activeAnalysis } = useSelector(state => state.analysis);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="animate-spin h-16 w-16 border-4 border-orange-400 border-t-transparent rounded-full"></div>
                </div>
            );
        }

        if (activeAnalysis === 'single' && singleData) {
            return <SingleProductDashboard forecastData={singleData} onReset={refetch} />;
        }
        if (activeAnalysis === 'aggregate' && aggregateData) {
            return <AggregateDashboard aggregateData={aggregateData} onReset={refetch} />;
        }
        if (singleData) {
             return <SingleProductDashboard forecastData={singleData} onReset={refetch} />;
        }
        if (aggregateData) {
            return <AggregateDashboard aggregateData={aggregateData} onReset={refetch} />;
        }

        // Fallback "No Data" message
        return (
            <div className="flex flex-col items-center justify-center text-center h-full max-w-2xl mx-auto">
                 <div className="bg-white rounded-2xl p-12 w-full">
                    <AlertCircle className="w-20 h-20 text-white mb-6 mx-auto" />
                    <h2 className="text-4xl font-bold">No Analysis Data Available</h2>
                    <p className="text-gray-400 mt-3">Please upload a CSV file on the Warehouse Setup page to get started.</p>
                    <Link to="/warehouse">
                        <Button size="lg" className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 px-8">
                            Go to Warehouse Setup
                        </Button>
                    </Link>
                </div>
            </div>
        );
    };

    // The return statement is now much simpler.
    // It only returns the content that should be placed inside the main layout area.
    return (
        <div className="bg-white text-black p-4 sm:p-8 space-y-12">
            {/* Main Header for the Dashboard */}
            {/* <div className="text-center">
                <h2 className="text-5xl md:text-6xl font-extrabold text-black">
                    <span>Analysis</span> Dashboard
                </h2>
                <p className="mt-3 text-lg text-gray-400 max-w-3xl mx-auto">
                    Review your inventory optimization metrics and business forecasts.
                </p>
            </div> */}
            
            {/* Render the active dashboard content */}
            {renderContent()}
        </div>
    );
};

export default DashboardPage;
