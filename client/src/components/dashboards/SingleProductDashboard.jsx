import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  Legend,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

// Helper function for date formatting
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

export const SingleProductDashboard = ({ forecastData, onReset }) => {
  const renderChart = (metric, title, color) => {
    const chartData = forecastData?.[metric]?.forecast;
    if (!chartData) return null;

    const formattedData = chartData.map((item) => ({
      ...item,
      ds: formatDate(item.ds),
    }));

    return (
      <Card className="bg-white border-gray-200 shadow-lg rounded-2xl">
        <CardHeader>
          <h3 className="text-xl text-gray-800 font-semibold text-center">
            {title} (Next 30 Days)
          </h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="ds" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <RechartTooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                }}
                labelStyle={{ color: "#1F2937" }}
                formatter={(value, name) => [
                  value.toFixed(2),
                  {
                    yhat: "Predicted",
                    yhat_upper: "Upper CI",
                    yhat_lower: "Lower CI",
                  }[name] || name,
                ]}
              />
              <Legend
                formatter={(name) =>
                  ({
                    yhat: "Predicted",
                    yhat_upper: "Upper CI",
                    yhat_lower: "Lower CI",
                  }[name] || name)
                }
              />
              <Line
                type="monotone"
                dataKey="yhat"
                name="Predicted"
                stroke={color}
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="yhat_upper"
                name="Upper CI"
                stroke={color}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="yhat_lower"
                name="Lower CI"
                stroke={color}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const kpis = [
    {
      label: "Forecasted Demand",
      value: forecastData?.sales?.forecasted_demand,
      color: "text-green-600",
      icon: <TrendingUp />,
      description: "Expected units needed",
    },
    {
      label: "Safety Stock",
      value: forecastData?.sales?.safety_stock,
      color: "text-green-600",
      icon: <ShieldCheck />,
      description: "Buffer inventory level",
    },
    {
      label: "Reorder Point",
      value: forecastData?.sales?.reorder_point,
      color: "text-green-600",
      icon: <Target />,
      description: "When to place orders",
    },
    {
      label: "Optimal Order Qty",
      value: forecastData?.sales?.optimal_replenishment_quantity,
      color: "text-green-600",
      icon: <PackageCheck />,
      description: "Recommended order size",
    },
  ];

  const KPICard = ({
    label,
    value,
    color,
    icon,
    trend,
    trendDirection,
    description,
  }) => (
    <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {label}
        </CardTitle>
        <div
          className={`p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300`}
        >
          {React.cloneElement(icon, { className: `h-4 w-4 ${color}` })}
        </div>
      </CardHeader>

      <CardContent>
        <div className={`text-2xl font-bold ${color} mb-1`}>
          {value?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ||
            "N/A"}
        </div>

        {description && (
          <p className="text-xs text-gray-500 mb-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-12 w-full max-w-7xl">
      <div className="text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800">
          <span className="text-green-600">Single-Product</span> Analysis
        </h2>
        <p className="mt-3 text-lg text-gray-600">
          Inventory optimization metrics and demand forecasts for an individual
          product.
        </p>
      </div>
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>
      <section className="space-y-8">
        {renderChart("sales", "Sales Forecast", "#16A34A")}
        {renderChart("quantity", "Orders Forecast", "#3B82F6")}
        {renderChart("deliveries", "Deliveries Forecast", "#4F46E5")}
      </section>
      {onReset && (
        <div className="flex justify-center pt-4">
          <Link to="/warehouse">
            <Button
              onClick={onReset}
              size="lg"
              className="bg-green-600 hover:bg-green-800 text-white h-12 px-8 cursor-pointer"
            >
              Add New Data
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
