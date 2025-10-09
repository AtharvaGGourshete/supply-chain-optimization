import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, Legend } from "recharts";

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

    const formattedData = chartData.map((item) => ({ ...item, ds: formatDate(item.ds) }));

    return (
      <Card className="bg-white border-gray-200 shadow-lg rounded-2xl">
        <CardHeader><h3 className="text-xl text-gray-800 font-semibold text-center">{title} (Next 30 Days)</h3></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="ds" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <RechartTooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }} labelStyle={{ color: '#1F2937' }} formatter={(value, name) => [value.toFixed(2), { yhat: "Predicted", yhat_upper: "Upper CI", yhat_lower: "Lower CI" }[name] || name]} />
              <Legend formatter={(name) => ({ yhat: "Predicted", yhat_upper: "Upper CI", yhat_lower: "Lower CI" }[name] || name)} />
              <Line type="monotone" dataKey="yhat" name="Predicted" stroke={color} strokeWidth={2} activeDot={{ r: 8 }} dot={false} />
              <Line type="monotone" dataKey="yhat_upper" name="Upper CI" stroke={color} strokeDasharray="5 5" strokeOpacity={0.5} dot={false} />
              <Line type="monotone" dataKey="yhat_lower" name="Lower CI" stroke={color} strokeDasharray="5 5" strokeOpacity={0.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const kpis = [
    { label: "Forecasted Demand", value: forecastData?.sales?.forecasted_demand, color: "text-green-600" },
    { label: "Safety Stock", value: forecastData?.sales?.safety_stock, color: "text-blue-600" },
    { label: "Reorder Point", value: forecastData?.sales?.reorder_point, color: "text-orange-600" },
    { label: "Optimal Order Qty", value: forecastData?.sales?.optimal_replenishment_quantity, color: "text-indigo-600" },
  ];

  return (
    <div className="space-y-12 w-full max-w-7xl">
        <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800">
                <span className="text-green-600">Single-Product</span> Analysis
            </h2>
            <p className="mt-3 text-lg text-gray-600">Inventory optimization metrics and demand forecasts for an individual product.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map(({ label, value, color }) => (
            <Card key={label} className="bg-white border-gray-200 text-center shadow-lg rounded-2xl">
                <CardHeader className="p-6">
                    <span className="text-gray-600 font-medium">{label}</span>
                    <h2 className={`text-5xl font-bold ${color} mt-2`}>
                        {value?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}
                    </h2>
                </CardHeader>
            </Card>
            ))}
        </div>
        <section className="space-y-8">
            {renderChart("sales", "Sales Forecast", "#16A34A")}
            {renderChart("quantity", "Orders Forecast", "#3B82F6")}
            {renderChart("deliveries", "Deliveries Forecast", "#4F46E5")}
        </section>
        {onReset && (
            <div className="flex justify-center pt-4">
                <Button onClick={onReset} size="lg" className="bg-gray-700 hover:bg-gray-800 text-white h-12 px-8">
                    Refresh Data
                </Button>
            </div>
        )}
    </div>
  );
};
