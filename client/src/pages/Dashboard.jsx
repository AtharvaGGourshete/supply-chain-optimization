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
  Brush,
} from "recharts";
import { FiMenu, FiX } from "react-icons/fi";
import Glow from "@/components/ui/glow";
import {
  PackageCheck,
  ShieldCheck,
  Target,
  TrendingUp,
  LineChart as LineChartIcon,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// =================================================================================
// 1. Custom Tooltip Component (Unchanged)
// =================================================================================
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-4 bg-gray-900 bg-opacity-90 border border-gray-700 rounded-lg shadow-xl text-white backdrop-blur-sm">
        <p className="label text-base font-semibold">{`Date: ${label}`}</p>
        <p className="intro text-cyan-400">{`Predicted: ${data.yhat.toFixed(2)}`}</p>
        <p className="desc text-gray-400 text-sm">{`Confidence Range: ${data.yhat_lower.toFixed(
          2
        )} - ${data.yhat_upper.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

// =================================================================================
// 2. Enhanced, Reusable Forecast Chart Component
// =================================================================================
const ForecastChart = ({ data, title, color, icon }) => {
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
    <div className="bg-black/20 p-6 rounded-2xl shadow-lg mb-8 backdrop-blur-sm border border-gray-800">
      {/* --- Enhanced Chart Header --- */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-3">
          {icon && React.cloneElement(icon, { style: { color } })}
          <h3 className="text-xl text-white font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-gray-400">Next 30-Day Forecast</p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData} margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="ds" stroke="#A0AEC0" tick={{ fill: "#A0AEC0" }} />
          <YAxis
            stroke="#A0AEC0"
            tick={{ fill: "#A0AEC0" }}
            tickFormatter={(v) => (v > 1000 ? `${v / 1000}k` : v)}
          />
          <RechartTooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeDasharray: "3 3" }} />
          <Legend onClick={handleLegendClick} />
          <Area
            type="monotone"
            dataKey="confidenceRange"
            name="Confidence Interval"
            stroke={false}
            fill={color}
            fillOpacity={opacity.confidence === 1 ? 0.2 : 0}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="yhat"
            name="Predicted"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }}
            connectNulls
            strokeOpacity={opacity.yhat}
          />
          {/* <Brush dataKey="ds" height={30} stroke={color} fill="rgba(0,0,0,0.5)" y={360} /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ChartSkeleton = () => (
    <div className="bg-black/20 p-6 rounded-2xl shadow-lg mb-8 backdrop-blur-sm border border-gray-800 animate-pulse">
        <div className="flex flex-col items-center mb-6">
            <div className="h-6 w-48 bg-gray-700 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-gray-700 rounded-md"></div>
        </div>
        <div className="w-full h-[400px] bg-gray-800 rounded-lg"></div>
    </div>
);


// =================================================================================
// 3. Refactored Single Product Dashboard View
// =================================================================================
const SingleProductDashboard = ({ forecastData, onReset, isLoading }) => {
  // --- Dynamic Product Name ---
  // Try to get the product name from your data, with a fallback.
  const productName = forecastData?.productInfo?.name || "";

  const kpis = [
    { label: "Forecasted Demand", value: forecastData?.sales?.forecasted_demand, color: "text-[#DDDBCB]", icon: <TrendingUp/> },
    { label: "Safety Stock", value: forecastData?.sales?.safety_stock, color: "text-[#DDDBCB]", icon: <ShieldCheck/> },
    { label: "Reorder Point", value: forecastData?.sales?.reorder_point, color: "text-[#DDDBCB]", icon: <Target/> },
    { label: "Optimal Order Qty", value: forecastData?.sales?.optimal_replenishment_quantity, color: "text-[#DDDBCB]", icon: <PackageCheck/> },
  ];

  const chartConfig = [
    { metric: "sales", title: `Sales Forecast ${productName ? `for ${productName}` : ''}`, color: "#00BCD4", icon: <LineChartIcon className="h-6 w-6"/> },
    { metric: "quantity", title: `Orders Forecast ${productName ? `for ${productName}` : ''}`, color: "#4CAF50", icon: <ShoppingCart className="h-6 w-6"/> },
    { metric: "deliveries", title: `Deliveries Forecast ${productName ? `for ${productName}` : ''}`, color: "#FF9800", icon: <Truck className="h-6 w-6"/> },
  ];

  if (isLoading) {
      return (
          <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => <Card key={i} className="bg-gray-800 h-28 animate-pulse"></Card>)}
              </div>
              <ChartSkeleton />
              <ChartSkeleton />
          </div>
      )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map(({ label, value, color, icon }) => (
          <Card key={label} className="bg-white border-gray-700 text-white group relative">
            
            <div className="relative bg-white rounded-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">{label}</CardTitle>
                    {React.cloneElement(icon, { className: "h-4 w-4 text-muted-foreground"})}
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${color}`}>{value?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "N/A"}</div>
                </CardContent>
            </div>
          </Card>
        ))}
      </div>
      <section>
        {chartConfig.map((config) => (
          <ForecastChart
            key={config.metric}
            data={forecastData?.[config.metric]?.forecast}
            title={config.title}
            color={config.color}
            icon={config.icon}
          />
        ))}
      </section>
      <div className="flex justify-center pt-8">
        <Button onClick={onReset} className="bg-gray-600 hover:bg-gray-700 px-8 py-3 text-base">Run Another Forecast</Button>
      </div>
    </div>
  );
};

// =================================================================================
// 4. Main Dashboard Component (Entry Point)
// =================================================================================
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Simulate loading state
  const location = useLocation();
  const navigate = useNavigate();

  const { forecastData } = location.state || {};

  useEffect(() => {
      // Simulate data fetching delay. Remove this in production.
      const timer = setTimeout(() => {
          setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
  }, []);

  const handleReset = () => navigate("/warehouse");

  const renderContent = () => {
    if (!forecastData && !isLoading) {
      return (
        <div className="text-center text-black">
          <h2 className="text-2xl font-bold mb-4">No Forecast Data Available</h2>
          <p className="mb-6">To view the dashboard, please run a new forecast.</p>
          <Button onClick={handleReset} className="bg-yellow-600 hover:bg-yellow-700">Go Back to Forecast Page</Button>
        </div>
      );
    }
    return <SingleProductDashboard forecastData={forecastData} onReset={handleReset} isLoading={isLoading} />;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      
      <div className="hidden lg:flex lg:flex-shrink-0"><Sidebar /></div>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2"><button onClick={() => setIsSidebarOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full"><FiX className="h-6 w-6 text-white" /></button></div>
            <Sidebar />
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400"><FiMenu className="h-6 w-6" /></button>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-white text-black">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
