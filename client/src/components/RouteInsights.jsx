import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Route,
  Clock,
  MapPin,
  Fuel,
  TrendingUp,
  Navigation,
  Target,
  BarChart3,
  Timer,
  DollarSign,
} from "lucide-react";

const   RouteInsights = ({ routes }) => {
  // Calculate insights from the route data
  const calculateInsights = () => {
    if (!routes || routes.length === 0) return {};

    let totalDistance = 0;
    let totalDuration = 0;
    let waypointsCount = 0;

    routes.forEach(route => {
      totalDistance += route.distance || 0;
      totalDuration += route.duration || 0;
      waypointsCount += route.waypoints?.length || 0;
    });

    // Convert meters to kilometers and seconds to hours/minutes
    const distanceKm = (totalDistance / 1000).toFixed(1);
    const durationHours = Math.floor(totalDuration / 3600);
    const durationMinutes = Math.floor((totalDuration % 3600) / 60);
    
    // Calculate estimated costs in INR
    const fuelCostPerKm = 12; // ₹12 per km (updated for Indian rates)
    const estimatedFuelCost = (distanceKm * fuelCostPerKm).toFixed(0);
    const driverCostPerHour = 150; // ₹150 per hour (updated for Indian rates)
    const estimatedDriverCost = ((totalDuration / 3600) * driverCostPerHour).toFixed(0);
    const totalCost = (parseFloat(estimatedFuelCost) + parseFloat(estimatedDriverCost)).toFixed(0);

    return {
      totalDistance: distanceKm,
      totalDuration: `${durationHours}h ${durationMinutes}m`,
      waypointsCount,
      estimatedFuelCost,
      estimatedDriverCost,
      totalCost,
      routesCount: routes.length,
      avgSpeed: ((distanceKm / (totalDuration / 3600)) || 0).toFixed(1),
    };
  };

  const insights = calculateInsights();

  if (!routes || routes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 mt-6 mb-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        {/* <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
          <BarChart3 className="h-6 w-6 text-white" />
        </div> */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Route Optimization Insights</h2>
          <p className="text-gray-600">Analysis of your optimized delivery route</p>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Distance</CardTitle>
            <Route className="h-4 w-4 text-[#30767b]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30767b] mb-1">{insights.totalDistance} km</div>
            <p className="text-xs text-gray-500">Total route distance</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-[#30767b]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30767b] mb-1">{insights.totalDuration}</div>
            <p className="text-xs text-gray-500">Estimated travel time</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Delivery Stops</CardTitle>
            <MapPin className="h-4 w-4 text-[#30767b]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30767b] mb-1">{insights.waypointsCount - 1}</div>
            <p className="text-xs text-gray-500">Number of stops</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Estimated Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-[#30767b]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#30767b] mb-1">₹{insights.totalCost}</div>
            <p className="text-xs text-gray-500">Fuel + driver costs</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-gray-100">
                <TrendingUp className="h-5 w-5 text-[#30767b]" />
              </div>
              <div className="text-lg font-semibold text-[#30767b]">{insights.avgSpeed} km/h</div>
              <div className="text-sm text-gray-600">Average Speed</div>
            </div>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-gray-100">
                <Fuel className="h-5 w-5 text-[#30767b]" />
              </div>
              <div className="text-lg font-semibold text-[#30767b]">₹{insights.estimatedFuelCost}</div>
              <div className="text-sm text-gray-600">Fuel Cost</div>
            </div>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-gray-100">
                <Timer className="h-5 w-5 text-[#30767b]" />
              </div>
              <div className="text-lg font-semibold text-[#30767b]">₹{insights.estimatedDriverCost}</div>
              <div className="text-sm text-gray-600">Driver Cost</div>
            </div>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-gray-100">
                <Navigation className="h-5 w-5 text-[#30767b]" />
              </div>
              <div className="text-lg font-semibold text-[#30767b]">{insights.routesCount}</div>
              <div className="text-sm text-gray-600">Routes Generated</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteInsights;
