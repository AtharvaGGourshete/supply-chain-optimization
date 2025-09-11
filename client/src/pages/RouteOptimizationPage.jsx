import React, { useState } from "react";
import RouteForm from "@/components/RouteForm";
import RouteMap from "@/components/RouteMap";
import RouteInsights from "@/components/RouteInsights"; // Only added this import
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const RouteOptimizationPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl text-center">
          {routes.length === 0 ? (
            <>
              <h1 className="text-4xl font-bold mb-2">Route Optimization</h1>
              <p className="text-gray-400 mb-6">
                Enter a depot and delivery locations to find the optimal route.
              </p>
            </>
          ) : (
            <h1 className="text-4xl font-bold mb-6 mt-20">Optimized Route</h1>
          )}

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4 shadow-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="relative">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 rounded-xl">
                <div className="animate-spin h-12 w-12 border-4 border-green-400 border-t-transparent rounded-full"></div>
                <span className="mt-4 text-lg text-green-300 font-semibold">
                  Optimizing routes...
                </span>
              </div>
            )}

            {routes.length === 0 ? (
              <RouteForm
                onRoutesOptimized={handleRoutesOptimized}
                onError={handleError}
                setLoading={setLoading}
              />
            ) : (
              <>
                <RouteMap routes={routes} onReset={handleReset} />
                {/* Only added this component under the map */}
                <RouteInsights routes={routes} />
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RouteOptimizationPage;
