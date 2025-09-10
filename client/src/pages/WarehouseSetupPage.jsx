import React, { useState } from "react";
import SleekNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
//   TooltipProvider,
// } from "@radix-ui/react-tooltip";
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
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Stepper component
const Stepper = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center w-full mb-8">
    {steps.map((step, index) => {
      const stepNumber = index + 1;
      const isCompleted = currentStep > stepNumber;
      const isCurrent = currentStep === stepNumber;
      return (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                isCompleted ? 'bg-yellow-500 text-black' : isCurrent ? 'bg-yellow-600 border-2 border-yellow-400 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {isCompleted ? '✓' : stepNumber}
            </div>
            <p className={`mt-2 text-xs font-semibold transition-all duration-300 ${isCurrent || isCompleted ? 'text-white' : 'text-gray-400'}`}>{step}</p>
          </div>
          {stepNumber < steps.length && (
            <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${isCompleted ? 'bg-yellow-200' : 'bg-gray-700'}`}></div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// Format date to dd-mm-yy or mm-yy
const formatDate = (dateStr, isMonthly = false) => {
  if (dateStr.includes('Q')) {
    // Quarterly format: qx-yy
    const [year, quarter] = dateStr.split('Q');
    return `Q${quarter}-${year.slice(-2)}`;
  }
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  if (isMonthly) {
    return `${month}-${year}`;
  }
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

// Single Product Dashboard
const SingleProductDashboard = ({ forecastData, onReset }) => {
  const renderChart = (metric, title, dataKey, color) => {
    if (!forecastData?.[metric]?.forecast) {
      return <div className="text-center text-gray-400 py-20">No chart data available for {title}</div>;
    }
    // Format dates to dd-mm-yy
    const formattedData = forecastData[metric].forecast.map(item => ({
      ...item,
      ds: formatDate(item.ds)
    }));
    return (
      <div className="bg-black/20 p-6 rounded-xl shadow-md mb-8 backdrop-blur-sm">
        <h3 className="text-xl text-white font-semibold mb-4 text-center">{title} (Next 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="ds" />
            <YAxis />
            <RechartTooltip
              formatter={(value, name) => {
                const labelMap = {
                  yhat: 'Predicted',
                  yhat_upper: 'Upper CI',
                  yhat_lower: 'Lower CI'
                };
                return [value.toFixed(2), labelMap[name] || name];
              }}
              labelFormatter={(lbl) => `Date: ${lbl}`}
            />
            <Legend
              formatter={(name) => {
                const labelMap = {
                  yhat: 'Predicted',
                  yhat_upper: 'Upper CI',
                  yhat_lower: 'Lower CI'
                };
                return labelMap[name] || name;
              }}
            />
            <Line type="monotone" dataKey="yhat" name="yhat" stroke={color} strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="yhat_upper" name="yhat_upper" stroke={color} strokeDasharray="5 5" strokeOpacity={0.5} />
            <Line type="monotone" dataKey="yhat_lower" name="yhat_lower" stroke={color} strokeDasharray="5 5" strokeOpacity={0.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const kpis = [
    { label: "Forecasted Demand (1 month)", value: forecastData?.sales?.forecasted_demand, color: "text-yellow-400" },
    { label: "Safety Stock", value: forecastData?.sales?.safety_stock, color: "text-lime-400" },
    { label: "Reorder Point", value: forecastData?.sales?.reorder_point, color: "text-rose-400" },
    { label: "Optimal Order Qty", value: forecastData?.sales?.optimal_replenishment_quantity, color: "text-purple-400" },
  ];

  // Debug: Log to confirm KPI rendering
  console.log('Rendering KPIs with tooltips:', kpis);

  return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-yellow-400">Inventory Optimization</h2>
          <p className="mt-2 text-lg text-gray-300">Here are your recommendations based on your data.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {kpis.map(({ label, value, color }) => (
            <Card key={label} className="bg-black/20 border-white/20">
              <CardHeader>
                    <span className="text-gray-400 cursor-pointer">{label}</span>
                <h2 className={`text-4xl font-bold ${color} mt-2`}>
                  {value?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}
                </h2>
              </CardHeader>
            </Card>
          ))}
        </div>
        <section className="mt-8">
          {renderChart('sales', 'Sales Forecast', 'yhat', '#00bcd4')}
          {renderChart('quantity', 'Orders Forecast', 'yhat', '#4caf50')}
          {renderChart('deliveries', 'Deliveries Forecast', 'yhat', '#ff9800')}
        </section>
        <div className="flex justify-center pt-8">
          <Button onClick={onReset} className="bg-gray-600 hover:bg-gray-700">Run Another Forecast</Button>
        </div>
      </div>
  );
};

// Aggregate Dashboard
const AggregateDashboard = ({ aggregateData, onReset }) => {
  const renderChart = (title, dataKey, chartData, color) => {
    if (!chartData || chartData.length === 0) {
      return <div className="text-center text-gray-400 py-20">No chart data available for {title}</div>;
    }
    // Format dates to mm-yy for monthly, qx-yy for quarterly
    const formattedData = chartData.map(item => ({
      ...item,
      ds: formatDate(item.ds, !item.ds.includes('Q'))
    }));
    return (
      <div className="bg-black/20 p-6 rounded-xl shadow-md mb-8 backdrop-blur-sm">
        <h3 className="text-xl text-white font-semibold mb-4 text-center">{title} Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="ds" />
            <YAxis />
            <RechartTooltip
              formatter={(val) => [val.toFixed(2), title]}
              labelFormatter={(lbl) => `Date: ${lbl}`}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (!aggregateData) {
    return <div className="text-center text-red-500 py-20">No aggregate data available.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-yellow-400">Business Forecasts</h2>
        <p className="mt-2 text-lg text-gray-300">Here are your high-level business predictions.</p>
      </div>
      <section className="mt-8">
        {renderChart('Monthly Sales', 'yhat', aggregateData.monthly_sales || [], "#8884d8")}
        {renderChart('Quarterly Revenue', 'yhat', aggregateData.quarterly_revenue || [], "#82ca9d")}
      </section>
      <div className="flex justify-center pt-8">
        <Button onClick={onReset} className="bg-gray-600 hover:bg-gray-700">Run Another Forecast</Button>
      </div>
    </div>
  );
};

// Main page component
export default function WarehouseSetupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    contactName: "",
    contactEmail: "",
    warehouseName: "",
    warehouseAddress: "",
    storageLocations: "",
    salesCsv: null,
    serviceLevel: 0.95,
    leadTimeDays: 7,
    currentInventory: 0,
    orderingCost: 100,
    holdingCost: 10,
    unitCost: 50,
    analysisType: null,
  });
  const [forecastData, setForecastData] = useState(null);
  const [aggregateData, setAggregateData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL_SINGLE = 'http://localhost:5000/forecast-and-optimize-product';
  const API_URL_AGGREGATE = 'http://localhost:5000/forecast-aggregate-data';

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, businessType: value }));
  };

  const handleFileChange = (event) => {
    setFormData(prev => ({ ...prev, salesCsv: event.target.files[0] }));
  };

  const handleNumericChange = (id) => (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && value.trim() !== "")) {
      setFormData(prev => ({ ...prev, [id]: Number(value) }));
    }
  };

  const handleForecast = async () => {
    const file = formData.salesCsv;
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");

    const data = new FormData();
    data.append('file', file);
    let url = '';

    if (formData.analysisType === 'single') {
      url = API_URL_SINGLE;
      data.append("service_level", formData.serviceLevel);
      data.append("lead_time_days", formData.leadTimeDays);
      data.append("current_inventory", formData.currentInventory);
      data.append("ordering_cost", formData.orderingCost);
      data.append("holding_cost", formData.holdingCost);
      data.append("unit_cost", formData.unitCost);
    } else {
      url = API_URL_AGGREGATE;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }

      const results = await response.json();
      if (formData.analysisType === "single") {
      navigate("/dashboard", { state: { forecastData: results } });
    } else {  
      navigate("/dashboard", { state: { aggregateData: results } });
    }
    } catch (err) {
      console.error("Error during forecast:", err);
      setError(err.message || "Failed to fetch forecast data. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      businessName: "",
      businessType: "",
      contactName: "",
      contactEmail: "",
      warehouseName: "",
      warehouseAddress: "",
      storageLocations: "",
      salesCsv: null,
      serviceLevel: 0.95,
      leadTimeDays: 7,
      currentInventory: 0,
      orderingCost: 100,
      holdingCost: 10,
      unitCost: 50,
      analysisType: null,
    });
    setForecastData(null);
    setAggregateData(null);
    setError(null);
    setStep(1);
  };

  const renderStepContent = () => {
    const inputStyles = "bg-black/20 border-white/20 focus:ring-2 focus:ring-cyan-500 h-12 text-base text-white";

    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl text-[#DDDBCB] font-bold">Business Information</h3>
              <p className="text-[#DDDBCB] mt-1">Let's start with the basics.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-lg text-[#DDDBCB]">Business Name</Label>
                <Input id="businessName" placeholder="Acme Innovations Inc." value={formData.businessName} onChange={handleInputChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType" className="text-lg text-[#DDDBCB]">Business Type</Label>
                <Select value={formData.businessType} onValueChange={handleSelectChange}>
                  <SelectTrigger id="businessType" className={inputStyles}>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-lg text-[#DDDBCB]">Primary Contact Name</Label>
                <Input id="contactName" placeholder="Jane Doe" value={formData.contactName} onChange={handleInputChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-lg text-[#DDDBCB]">Contact Email</Label>
                <Input id="contactEmail" type="email" placeholder="jane.doe@acme.com" value={formData.contactEmail} onChange={handleInputChange} className={inputStyles} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl text-[#DDDBCB] font-bold">Warehouse Details</h3>
              <p className="text-[#DDDBCB] mt-1">Where will the inventory be stored?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="warehouseName" className="text-lg text-[#DDDBCB]">Warehouse Name / ID</Label>
                <Input id="warehouseName" placeholder="Main Warehouse" value={formData.warehouseName} onChange={handleInputChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouseAddress" className="text-lg text-[#DDDBCB]">Warehouse Address</Label>
                <Input id="warehouseAddress" placeholder="123 Industrial Way, Suite 100" value={formData.warehouseAddress} onChange={handleInputChange} className={inputStyles} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storageLocations" className="text-lg text-[#DDDBCB]">Storage System (Optional)</Label>
              <Textarea id="storageLocations" placeholder="Describe your bin/location system, e.g., 'Aisle A, Shelf 1, Bin 01'" value={formData.storageLocations} onChange={handleInputChange} className={`${inputStyles} h-24 text-white`} />
            </div>
          </div>
        );
      case 3:
        if (!formData.analysisType) {
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl text-[#DDDBCB] font-bold">Select Analysis Type</h3>
                <p className="text-gray-400 mt-1">What kind of forecast do you want to run?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Button
                  size="lg"
                  className="h-40 bg-yellow-600 hover:bg-yellow-700 cursor-pointer font-semibold text-lg"
                  onClick={() => setFormData(prev => ({ ...prev, analysisType: 'single' }))}
                >
                  Single Product Optimization
                </Button>
                <Button
                  size="lg"
                  className="h-40 bg-yellow-600 hover:bg-yellow-700 cursor-pointer font-semibold text-lg"
                  onClick={() => setFormData(prev => ({ ...prev, analysisType: 'aggregate' }))}
                >
                  Aggregate Business Forecast
                </Button>
              </div>
            </div>
          );
        } else if (formData.analysisType === 'single') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-3xl text-[#DDDBCB] font-bold">Single Product Optimization</h3>
                <p className="text-gray-400 mt-1">Provide sales data and key metrics for a single product.</p>
              </div>
              <div className="flex flex-col items-center justify-center p-12 mt-4 border-2 border-dashed border-white/20 rounded-lg hover:border-yellow-500 hover:bg-black/20 transition-all duration-300">
                <Upload className="w-16 h-16 text-gray-500" />
                <p className="mt-4 text-xl font-semibold">Drag & drop your file here</p>
                <p className="text-gray-400">or</p>
                <div className="relative inline-flex items-center justify-center h-10 px-4 py-2 mt-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 w-40 rounded-md text-sm font-medium transition-colors">
                  <span className="cursor-pointer">Choose a file</span>
                  <input type="file" onChange={handleFileChange} accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                {formData.salesCsv && <p className="mt-2 text-yellow-400">{formData.salesCsv.name}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceLevel" className="text-lg text-[#DDDBCB]">Service Level (0.0 - 1.0)</Label>
                  <Input id="serviceLevel" type="number" step="0.01" placeholder="e.g., 0.95" value={formData.serviceLevel} onChange={handleNumericChange("serviceLevel")} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadTimeDays" className="text-lg text-[#DDDBCB]">Lead Time (Days)</Label>
                  <Input id="leadTimeDays" type="number" placeholder="e.g., 7" value={formData.leadTimeDays} onChange={handleNumericChange("leadTimeDays")} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentInventory" className="text-lg text-[#DDDBCB]">Current On-Hand Inventory</Label>
                  <Input id="currentInventory" type="number" placeholder="e.g., 250" value={formData.currentInventory} onChange={handleNumericChange("currentInventory")} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderingCost" className="text-lg text-[#DDDBCB]">Ordering Cost</Label>
                  <Input id="orderingCost" type="number" placeholder="e.g., 100" value={formData.orderingCost} onChange={handleNumericChange("orderingCost")} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holdingCost" className="text-lg text-[#DDDBCB]">Holding Cost</Label>
                  <Input id="holdingCost" type="number" placeholder="e.g., 10" value={formData.holdingCost} onChange={handleNumericChange("holdingCost")} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitCost" className="text-lg text-[#DDDBCB]">Unit Cost</Label>
                  <Input id="unitCost" type="number" placeholder="e.g., 50" value={formData.unitCost} onChange={handleNumericChange("unitCost")} className={inputStyles} />
                </div>
              </div>
              <p className="text-center text-sm text-gray-400">
                Ensure the file has columns for: <strong className="text-white/80">ds</strong>, <strong className="text-white/80">y_sales</strong>, <strong className="text-white/80">y_quantity</strong>, and <strong className="text-white/80">y_deliveries</strong>.
              </p>
              {error && <p className="text-center text-red-500 mt-2">{error}</p>}
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-3xl text-[#DDDBCB] font-bold">Aggregate Business Forecast</h3>
                <p className="text-gray-400 mt-1">Provide high-level data to forecast total monthly sales and quarterly revenue.</p>
              </div>
              <div className="flex flex-col items-center justify-center p-12 mt-4 border-2 border-dashed border-white/20 rounded-lg hover:border-yellow-500 hover:bg-black/20 transition-all duration-300">
                <Upload className="w-16 h-16 text-gray-500" />
                <p className="mt-4 text-xl font-semibold">Drag & drop your file here</p>
                <p className="text-gray-400">or</p>
                <div className="relative inline-flex items-center justify-center h-10 px-4 py-2 mt-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 w-40 rounded-md text-sm font-medium transition-colors">
                  <span className="cursor-pointer">Choose a file</span>
                  <input type="file" onChange={handleFileChange} accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                {formData.salesCsv && <p className="mt-2 text-yellow-400">{formData.salesCsv.name}</p>}
              </div>
              <p className="text-center text-sm text-gray-400">
                Ensure the file has columns for: <strong className="text-white/80">ds</strong>, <strong className="text-white/80">y_sales</strong>, and <strong className="text-white/80">y_revenue</strong>.
              </p>
              {error && <p className="text-center text-red-500 mt-2">{error}</p>}
            </div>
          );
        }
      case 4:
        if (loading) {
          return (
            <div className="flex flex-col items-center justify-center w-full min-h-[45vh]">
              <div className="animate-spin h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-yellow-300 font-medium text-lg">Running analysis...</p>
            </div>
          );
        } else if (error) {
          return <div className="text-center text-red-500 py-20">{error}</div>;
        } else if (formData.analysisType === 'single' && forecastData) {
          return <SingleProductDashboard forecastData={forecastData} onReset={handleReset} />;
        } else if (formData.analysisType === 'aggregate' && aggregateData) {
          return <AggregateDashboard aggregateData={aggregateData} onReset={handleReset} />;
        } else {
          return <div className="text-center text-red-500 py-20">No data available. Please try again.</div>;
        }
      default:
        return null;
    }
  };

  return (
    <>
      <SleekNavbar />
      <div className="min-h-screen bg-[#101010] text-[#DDDBCB] font-sans flex flex-col items-center justify-center p-4 pt-24 md:pt-16 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="text-center max-w-5xl mb-12 mt-16">
            <span className="text-5xl md:text-6xl font-bold font-poppins">Get done with your warehouse setup real quick.</span>
          </div>
          <Card className="w-full max-w-6xl rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl">
            <CardHeader className="p-8">
              <Stepper currentStep={step} steps={['Business', 'Warehouse', 'Analytics', 'Results']} />
            </CardHeader>
            <CardContent className="px-8 md:px-12 py-10 min-h-[45vh]">
              {renderStepContent()}
            </CardContent>
            {step < 4 && (
              <CardFooter className="flex justify-between p-8 bg-black/20 rounded-b-2xl">
                {step > 1 ? (
                  <Button
                    size="lg"
                    variant="outline"
                    className="cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white hover:text-white border-none"
                    onClick={() => {
                      if (step === 3 && formData.analysisType) {
                        setFormData(prev => ({ ...prev, analysisType: null }));
                      } else {
                        setStep(step - 1);
                      }
                    }}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Previous
                  </Button>
                ) : <div />}
                {step < 3 || (step === 3 && formData.analysisType) ? (
                  <Button
                    size="lg"
                    className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
                    onClick={() => {
                      if (step === 3) handleForecast();
                      else setStep(step + 1);
                    }}
                    disabled={loading || (step === 3 && !formData.salesCsv)}
                  >
                    {loading ? "Processing..." : (step === 3 ? "Run Analysis" : "Next Step")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : null}
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}