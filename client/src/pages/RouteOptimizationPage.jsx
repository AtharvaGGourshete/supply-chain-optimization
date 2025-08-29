import React, { useState } from "react";
import RouteForm from "@/components/RouteForm";
import RouteMap from "@/components/RouteMap";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
const RouteOptimizationPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRoutesOptimized = (routes) => {
    setRoutes(routes);
    setError(null);
  };

  const handleError = (message) => {
    setError(message);
    setRoutes([]);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mt-20 mb-6">Route Optimization</h1>

      {error && (
        <div className="bg-red-900 text-red-200 px-4 py-2 rounded-lg mb-4 shadow">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <RouteForm
            onRoutesOptimized={handleRoutesOptimized}
            onError={handleError}
            setLoading={setLoading}
          />
        </div>

        {/* Map Section */}
        <div className="lg:col-span-2 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 rounded-xl">
              <div className="animate-spin h-10 w-10 border-4 border-green-400 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-green-300 font-medium">
                Optimizing routes...
              </span>
            </div>
          )}
          <RouteMap routes={routes} />
        </div>
      </div>
    </div>
    <Footer />
    </>
    
  );
};

export default RouteOptimizationPage;
