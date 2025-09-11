import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  Legend,
  Area,
} from "recharts";
import { FiMenu, FiX } from "react-icons/fi";
import {
  PackageCheck,
  ShieldCheck,
  Target,
  TrendingUp,
  LineChart as LineChartIcon,
  ShoppingCart,
  Truck,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// =================================================================================
// 1. Light Theme Custom Tooltip Component (UNCHANGED)
// =================================================================================
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-sm font-medium text-gray-900 mb-2">{`Date: ${label}`}</p>
        <p className="text-blue-600 font-semibold">{`Predicted: ${data.yhat ? data.yhat.toFixed(2) : payload[0].value?.toFixed(2)}`}</p>
        {data.yhat_lower && data.yhat_upper && (
          <p className="text-gray-500 text-xs mt-1">{`Range: ${data.yhat_lower.toFixed(2)} - ${data.yhat_upper.toFixed(2)}`}</p>
        )}
      </div>
    );
  }
  return null;
};

// =================================================================================
// 2. Enhanced Chart with More Visible Grid Lines (UNCHANGED)
// =================================================================================
const ForecastChart = ({ data, title, color, icon, description }) => {
  const [opacity, setOpacity] = useState({ yhat: 1, confidence: 1 });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  const formattedData = data?.map((item) => ({
    ...item,
    ds: formatDate(item.ds),
    confidenceRange: [item.yhat_lower, item.yhat_upper],
  }));

  const handleLegendClick = (e) =>
    setOpacity((o) => ({ ...o, [e.dataKey]: o[e.dataKey] === 1 ? 0 : 1 }));

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {icon && React.cloneElement(icon, { className: "h-5 w-5", style: { color } })}
              {title}
            </CardTitle>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <BarChart3 className="h-4 w-4" />
            <span>30-Day Forecast</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {/* ENHANCED GRID LINES - Much More Visible */}
            <CartesianGrid 
              strokeDasharray="2 2" 
              stroke="#9CA3AF" 
              strokeWidth={1.5}
              opacity={1}
            />
            <XAxis 
              dataKey="ds" 
              stroke="#6B7280" 
              tick={{ fill: "#6B7280", fontSize: 12 }} 
              tickLine={{ stroke: "#9CA3AF", strokeWidth: 1.5 }}
              axisLine={{ stroke: "#9CA3AF", strokeWidth: 2 }}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickLine={{ stroke: "#9CA3AF", strokeWidth: 1.5 }}
              axisLine={{ stroke: "#9CA3AF", strokeWidth: 2 }}
              tickFormatter={(v) => (v > 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            />
            <RechartTooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeDasharray: "2 2" }} />
            <Legend onClick={handleLegendClick} />
            <Area
              type="monotone"
              dataKey="confidenceRange"
              name="Confidence Range"
              stroke={false}
              fill={color}
              fillOpacity={opacity.confidence === 1 ? 0.1 : 0}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="yhat"
              name="Forecast"
              stroke={color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff", fill: color }}
              connectNulls
              strokeOpacity={opacity.yhat}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// =================================================================================
// 3. Light Theme Loading Skeleton (UNCHANGED)
// =================================================================================
const ChartSkeleton = () => (
  <Card className="bg-white border border-gray-200">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="w-full h-[350px] bg-gray-50 rounded-lg animate-pulse"></div>
    </CardContent>
  </Card>
);

// =================================================================================
// 4. Enhanced KPI Card Component (UNCHANGED)
// =================================================================================
const KPICard = ({ label, value, color, icon, trend, trendDirection, description }) => (
  <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 group">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {label}
      </CardTitle>
      <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300`}>
        {React.cloneElement(icon, { className: `h-4 w-4 ${color}` })}
      </div>
    </CardHeader>
    
    <CardContent>
      <div className={`text-2xl font-bold ${color} mb-1`}>
        {value?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "N/A"}
      </div>
      
      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}
      
      <div className={`flex items-center gap-1 text-xs ${
        trendDirection === 'up' ? 'text-green-600' : 'text-red-500'
      }`}>
        {trendDirection === 'up' ? 
          <ArrowUp className="h-3 w-3" /> : 
          <ArrowDown className="h-3 w-3" />
        }
        <span className="font-medium">{trend}</span>
        <span className="text-gray-400">vs last month</span>
      </div>
    </CardContent>
  </Card>
);

// =================================================================================
// 5. NEW: Aggregate Dashboard Component
// =================================================================================
const AggregateDashboard = ({ aggregateData, onReset, isLoading }) => {
  // Format date function for aggregate data
  const formatAggregateDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("Q")) {
      const [year, quarter] = dateStr.split("Q");
      return `Q${quarter}-${year.slice(-2)}`;
    }
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}-${year}`;
  };

  const kpis = [
    {
      label: "Annual Sales Forecast",
      value: aggregateData?.annual_sales_forecast,
      color: "text-blue-600",
      icon: <TrendingUp/>,
      trend: "+15.2%",
      trendDirection: "up",
      description: "Total units for next 12 months"
    },
    {
      label: "Annual Revenue Forecast",
      value: aggregateData?.annual_revenue_forecast,
      color: "text-green-600",
      icon: <DollarSign/>,
      trend: "+18.7%",
      trendDirection: "up",
      description: "Total revenue for next 12 months"
    },
    {
      label: "Growth Trajectory",
      value: (() => {
        const monthlySales = aggregateData?.monthly_sales || [];
        if (monthlySales.length >= 2) {
          const firstMonth = monthlySales[0]?.yhat || 0;
          const lastMonth = monthlySales[monthlySales.length - 1]?.yhat || 0;
          const growth = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth * 100) : 0;
          return Math.round(growth);
        }
        return 0;
      })(),
      color: "text-purple-600",
      icon: <Activity/>,
      trend: "+3.4%",
      trendDirection: "up",
      description: "Year-over-year growth rate"
    },
    {
      label: "Forecast Horizon",
      value: 12,
      color: "text-orange-600",
      icon: <AlertCircle/>,
      trend: "Monthly",
      trendDirection: "up",
      description: "Months of projection"
    },
  ];

  const chartConfig = [
    {
      data: aggregateData?.monthly_sales,
      title: "Monthly Sales Forecast",
      color: "#2563EB",
      icon: <TrendingUp className="h-5 w-5"/>,
      description: "12-month business sales projection with trend analysis"
    },
    {
      data: aggregateData?.monthly_revenue,
      title: "Monthly Revenue Forecast", 
      color: "#059669",
      icon: <DollarSign className="h-5 w-5"/>,
      description: "Monthly revenue breakdown and projections"
    },
    {
      data: aggregateData?.quarterly_revenue,
      title: "Quarterly Revenue Forecast",
      color: "#EA580C", 
      icon: <BarChart3 className="h-5 w-5"/>,
      description: "4-quarter revenue projection with seasonal patterns"
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-2">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Chart Skeletons */}
        <div className="space-y-6">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="text-center space-y-2 pb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Business Forecast Analytics
        </h1>
        <p className="text-gray-600">Comprehensive business-level forecasting and insights</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Forecast Charts */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Business Forecast Analysis</h2>
        </div>
        
        {chartConfig.map((config, index) => (
          <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 150}ms` }}>
            <ForecastChart
              data={config.data?.map(item => ({
                ...item,
                ds: formatAggregateDate(item.ds)
              }))}
              title={config.title}
              color={config.color}
              icon={config.icon}
              description={config.description}
            />
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-8">
        <Button 
          onClick={onReset} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
        >
          <Activity className="h-5 w-5" />
          Generate New Forecast
        </Button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// =================================================================================
// 6. EXISTING: Single Product Dashboard (UNCHANGED)
// =================================================================================
const SingleProductDashboard = ({ forecastData, onReset, isLoading }) => {
  const productName = forecastData?.productInfo?.name || "";

  const kpis = [
    { 
      label: "Forecasted Demand", 
      value: forecastData?.sales?.forecasted_demand, 
      color: "text-blue-600", 
      icon: <TrendingUp/>,
      trend: "+12.5%",
      trendDirection: "up",
      description: "Expected units needed"
    },
    { 
      label: "Safety Stock", 
      value: forecastData?.sales?.safety_stock, 
      color: "text-green-600", 
      icon: <ShieldCheck/>,
      trend: "+5.2%",
      trendDirection: "up",
      description: "Buffer inventory level"
    },
    { 
      label: "Reorder Point", 
      value: forecastData?.sales?.reorder_point, 
      color: "text-orange-600", 
      icon: <Target/>,
      trend: "-2.1%",
      trendDirection: "down",
      description: "When to place orders"
    },
    { 
      label: "Optimal Order Qty", 
      value: forecastData?.sales?.optimal_replenishment_quantity, 
      color: "text-purple-600", 
      icon: <PackageCheck/>,
      trend: "+8.7%",
      trendDirection: "up",
      description: "Recommended order size"
    },
  ];

  const chartConfig = [
    { 
      metric: "sales", 
      title: `Sales Forecast`, 
      color: "#2563EB", 
      icon: <LineChartIcon className="h-5 w-5"/>,
      description: "Predicted sales volume over the next 30 days"
    },
    { 
      metric: "quantity", 
      title: `Order Volume Forecast`, 
      color: "#059669", 
      icon: <ShoppingCart className="h-5 w-5"/>,
      description: "Expected number of orders to be placed"
    },
    { 
      metric: "deliveries", 
      title: `Delivery Schedule Forecast`, 
      color: "#EA580C", 
      icon: <Truck className="h-5 w-5"/>,
      description: "Anticipated delivery patterns and volume"
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-2">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Chart Skeletons */}
        <div className="space-y-6">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      {productName && (
        <div className="text-center space-y-2 pb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {productName} Analytics Dashboard
          </h1>
          <p className="text-gray-600">Real-time forecasting and inventory insights</p>
        </div>
      )}

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Forecast Charts */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Forecast Analysis</h2>
        </div>
        
        {chartConfig.map((config, index) => (
          <div key={config.metric} className="animate-fadeIn" style={{ animationDelay: `${index * 150}ms` }}>
            <ForecastChart
              data={forecastData?.[config.metric]?.forecast}
              title={`${config.title}${productName ? ` - ${productName}` : ''}`}
              color={config.color}
              icon={config.icon}
              description={config.description}
            />
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-8">
        <Button 
          onClick={onReset} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
        >
          <Activity className="h-5 w-5" />
          Generate New Forecast
        </Button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// =================================================================================
// 7. Main Dashboard Component (Updated to Handle Both Types)
// =================================================================================
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Get both forecastData and aggregateData from location.state
  const { forecastData, aggregateData } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => navigate("/warehouse");

  const renderContent = () => {
    if (!forecastData && !aggregateData && !isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-900">No Forecast Data Available</h2>
          <p className="text-gray-600 max-w-md">
            To view the dashboard insights, please run a new forecast analysis from the warehouse page.
          </p>
          <Button 
            onClick={handleReset} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go to Forecasting
          </Button>
        </div>
      );
    }

    // If aggregateData exists, show AggregateDashboard
    if (aggregateData) {
      return <AggregateDashboard aggregateData={aggregateData} onReset={handleReset} isLoading={isLoading} />;
    }

    // Otherwise, show SingleProductDashboard (your existing logic)
    return <SingleProductDashboard forecastData={forecastData} onReset={handleReset} isLoading={isLoading} />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/25" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10"
              >
                <FiX className="h-6 w-6 text-white" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 lg:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="text-gray-600 hover:text-gray-900"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h1>
          <div className="w-6"></div> {/* Spacer for centering */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
