import React, { useState } from "react";
import RouteForm from "@/components/RouteForm";
import RouteMap from "@/components/RouteMap";
import RouteInsights from "@/components/RouteInsights";

const RouteOptimizationPage = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // All functional logic remains the same
    const handleRoutesOptimized = (optimizedRoutes) => {
        setRoutes(optimizedRoutes);
        setError(null);
    };
    const handleError = (message) => {
        setError(message);
        setRoutes([]);
    };
    const handleReset = () => {
        setRoutes([]);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 poppins flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-5xl mx-auto text-center mt-8">
                {/* Conditional Header */}
                {routes.length === 0 ? (
                    <>
                        <h1 className="text-5xl font-extrabold text-gray-800">
                            <span className="text-green-600">Route</span> Optimization
                        </h1>
                        <p className="mt-3 text-lg text-gray-600">
                            Enter a depot and delivery locations to find the optimal route.
                        </p>
                    </>
                ) : (
                    <h1 className="text-5xl font-extrabold text-gray-800">
                        Optimized <span className="text-green-600">Route</span>
                    </h1>
                )}

                {/* Main Content Area */}
                <div className="mt-8 relative">
                    {/* Loading Overlay */}
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20 rounded-2xl">
                            <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
                            <span className="mt-4 text-lg text-green-700 font-semibold">
                                Optimizing routes...
                            </span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6 shadow-md">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Conditional rendering of Form or Map/Insights */}
                    {routes.length === 0 ? (
                        <RouteForm
                            onRoutesOptimized={handleRoutesOptimized}
                            onError={handleError}
                            setLoading={setLoading}
                        />
                    ) : (
                        <div className="space-y-8">
                            <RouteMap routes={routes} onReset={handleReset} />
                            <RouteInsights routes={routes} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteOptimizationPage;
