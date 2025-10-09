import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip } from "recharts";
import { Calendar, DollarSign, RefreshCw } from 'lucide-react'; // Import icons

// Helper function for formatting dates
const formatDate = (dateStr, isMonthly = false) => {
    if (!dateStr) return "";
    if (dateStr.includes("Q")) {
        const [year, quarter] = dateStr.split("Q");
        return `Q${quarter} '${year.slice(-2)}`;
    }
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = String(date.getFullYear()).slice(-2);
    return isMonthly ? `${month} '${year}` : `${String(date.getDate()).padStart(2, "0")}-${month}-${year}`;
};

export const AggregateDashboard = ({ aggregateData, onReset }) => {
  const renderChart = (title, dataKey, chartData, color, Icon) => {
    if (!chartData || chartData.length === 0) return null;

    const formattedData = chartData.map((item) => ({
      ...item,
      ds: formatDate(item.ds, true),
    }));

    return (
      <Card className="bg-white border-gray-200 shadow-lg rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-center space-x-2">
            <Icon className="w-6 h-6 text-gray-500" />
            <h3 className="text-xl text-gray-800 font-semibold">{title}</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="ds" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <RechartTooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} labelStyle={{ color: '#1f2937', fontWeight: 'bold' }} formatter={(val) => [val.toLocaleString(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0}), "Value"]} />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} activeDot={{ r: 8 }} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-gray-50/50 p-4 sm:p-8 space-y-12 w-full">
        <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                <span className="text-green-600">Aggregate Business</span> Forecast
            </h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                High-level sales and revenue predictions for your entire business.
            </p>
        </div>
        <section className=''>
            {renderChart("Monthly Sales", "yhat", aggregateData.monthly_sales || [], "#16a34a", Calendar)}
            {renderChart("Quarterly Revenue", "yhat", aggregateData.quarterly_revenue || [], "#3b82f6", DollarSign)}
        </section>
        {/* {onReset && (
            <div className="flex justify-center pt-4">
                <Button onClick={onReset} variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2">
                    <RefreshCw size={16} /> Refresh Data
                </Button>
            </div>
        )} */}
    </div>
  );
};
