import React, { useState, useEffect } from "react";
import SleekNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// NEW: A single doodle component to render different SVG shapes
const Doodle = ({ type, color, size }) => {
  const commonProps = {
    stroke: color,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    width: size,
    height: size,
  };

  switch (type) {
    case 'squiggle':
      return <svg {...commonProps} viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-9-9 9 9 0 0 0-9 9 9 9 0 0 1 9 9 9 9 0 0 0 9-9z"></path></svg>;
    case 'plus':
      return <svg {...commonProps} viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"></path></svg>;
    case 'circle-z':
        return <svg {...commonProps} viewBox="0 0 24 24"><path d="M10 8h4l-4 8h4m4-12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>;
    case 'triangle':
        return <svg {...commonProps} viewBox="0 0 24 24"><path d="M12 2 2 22h20L12 2z"></path></svg>;
    default:
      return null;
  }
};

// NEW: Component for the background doodles
const DoodleBackground = () => {
  const [doodles, setDoodles] = useState([]);
  const doodleTypes = ['squiggle', 'plus', 'circle-z', 'triangle'];
  const doodleColors = ['#00bcd4', '#4dd0e1', '#26c6da', '#80deea']; // Shades of cyan

  useEffect(() => {
    const generatedDoodles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      type: doodleTypes[Math.floor(Math.random() * doodleTypes.length)],
      color: doodleColors[Math.floor(Math.random() * doodleColors.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotate: `${Math.random() * 360}deg`,
      size: Math.floor(Math.random() * 30) + 20, // size between 20 and 50px
    }));
    setDoodles(generatedDoodles);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
      {doodles.map(doodle => (
        <div
          key={doodle.id}
          className="absolute"
          style={{
            top: doodle.top,
            left: doodle.left,
            transform: `rotate(${doodle.rotate}) translate(-50%, -50%)`,
          }}
        >
          <Doodle type={doodle.type} color={doodle.color} size={doodle.size} />
        </div>
      ))}
    </div>
  );
};


// Forecast Dashboard
const ForecastDashboard = ({ forecastData }) => {
  const renderChart = (title, dataKey, chartData) => {
    if (!chartData || chartData.length === 0) return null;

    return (
      <div className="bg-black/20 p-6 rounded-xl shadow-md mb-8 backdrop-blur-sm">
        <h3 className="text-xl text-white font-semibold mb-4 text-center">{title} Forecast (Next 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="ds" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="yhat" name="Forecast" stroke="#00bcd4" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="yhat_upper" name="Upper Bound" stroke="#4caf50" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="yhat_lower" name="Lower Bound" stroke="#ff9800" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-cyan-400">Setup Complete!</h2>
        <p className="mt-2 text-lg text-gray-300">Here are your demand forecasts based on the data you provided.</p>
      </div>
      <section className="mt-8">
        {renderChart('Sales', 'yhat', forecastData.sales)}
        {renderChart('Order Quantity', 'yhat', forecastData.quantity)}
        {renderChart('Deliveries', 'yhat', forecastData.deliveries)}
      </section>
    </div>
  );
};


const initialFormData = {
  businessName: "",
  businessType: "",
  contactName: "",
  contactEmail: "",
  warehouseName: "",
  warehouseAddress: "",
  storageLocations: "",
  salesCsv: null,
};


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
                isCompleted ? 'bg-cyan-500 text-black' : isCurrent ? 'bg-cyan-600 border-2 border-cyan-400 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {isCompleted ? '✓' : stepNumber}
            </div>
            <p className={`mt-2 text-xs font-semibold transition-all duration-300 ${isCurrent || isCompleted ? 'text-white' : 'text-gray-400'}`}>{step}</p>
          </div>
          {stepNumber < steps.length && (
            <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${isCompleted ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);


const WarehouseSetupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000/api/forecast';

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
  
  const handleForecast = async () => {
    const file = formData.salesCsv;
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append('file', file);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }

      const forecastResults = await response.json();
      setForecastData(forecastResults);
      setStep(4);

    } catch (err) {
      console.error("Error during forecast:", err);
      setError(err.message || "Failed to fetch forecast data. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const inputStyles = "bg-black/20 border-white/20 focus:ring-2 focus:ring-cyan-500 h-12 text-base";
    
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
                  <SelectTrigger id="businessType" className={inputStyles}><SelectValue placeholder="Select a type" /></SelectTrigger>
                  <SelectContent><SelectItem value="ecommerce">E-commerce</SelectItem><SelectItem value="retail">Retail</SelectItem><SelectItem value="wholesale">Wholesale</SelectItem><SelectItem value="manufacturing">Manufacturing</SelectItem></SelectContent>
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
                <Textarea id="storageLocations" placeholder="Describe your bin/location system, e.g., 'Aisle A, Shelf 1, Bin 01'" value={formData.storageLocations} onChange={handleInputChange} className={`${inputStyles} h-24`} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl text-[#DDDBCB] font-bold">Upload Sales Data</h3>
              <p className="text-[#DDDBCB] mt-1">Upload your sales CSV to generate a forecast.</p>
            </div>
            <p className="text-center text-sm text-gray-400">Ensure the file has columns for: <strong className="text-white/80">ds, y_sales, y_quantity, y_deliveries</strong>.</p>
            <div className="flex flex-col items-center justify-center p-12 mt-4 border-2 border-dashed border-white/20 rounded-lg hover:border-cyan-500 hover:bg-black/20 transition-all duration-300">
              <Upload className="w-16 h-16 text-gray-500"/>
              <p className="mt-4 text-xl font-semibold">Drag & drop your CSV file here</p>
              <p className="text-gray-400">or</p>
              <div className="relative inline-flex items-center justify-center h-10 px-4 py-2 mt-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 w-40 rounded-md text-sm font-medium transition-colors">
                  <span className="cursor-pointer">Choose a file</span>
                  <input type="file" onChange={handleFileChange} accept=".csv, .xlsx, .xls" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              {formData.salesCsv && <p className="mt-2 text-cyan-400">{formData.salesCsv.name}</p>}
              {loading && <p className="mt-4 text-cyan-400">Processing file...</p>}
              {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
          </div>
        );
      case 4:
        return <ForecastDashboard forecastData={forecastData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <SleekNavbar />
      {/* MODIFIED: Added `relative` and `overflow-hidden` to the main container. */}
      <div className="min-h-screen bg-[#101010] text-[#DDDBCB] font-sans flex flex-col items-center justify-center p-4 pt-24 md:pt-16 relative overflow-hidden">
        
        {/* MODIFIED: Added the doodle background component here. */}
        <DoodleBackground />

        {/* MODIFIED: Wrapped content in a div with relative positioning and a higher z-index to place it above the doodles. */}
        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="text-center max-w-5xl mb-12 mt-16">
            <span className="text-5xl md:text-6xl font-bold font-poppins">Get done with your warehouse setup real quick.</span>
          </div>
          <Card className="w-full max-w-6xl rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl">
            <CardHeader className="p-8">
              <Stepper currentStep={step} steps={['Business', 'Warehouse', 'Sales Data']} />
            </CardHeader>
            <CardContent className="px-8 md:px-12 py-10 min-h-[45vh]">
              {renderStepContent()}
            </CardContent>
            <CardFooter className="flex justify-between p-8 bg-black/20 rounded-b-2xl">
              {step > 1 && step < 4 ? (
                <Button size="lg" variant="outline" className="cursor-pointer" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="mr-2 h-5 w-5"/>
                  Previous
                </Button>
              ) : (
                <div /> // Placeholder
              )}
              {step < 3 ? (
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer" onClick={() => setStep(step + 1)}>
                  Next Step
                  <ArrowRight className="ml-2 h-5 w-5"/>
                </Button>
              ) : step === 3 ? (
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer" onClick={handleForecast} disabled={!formData.salesCsv || loading}>
                  {loading ? "Processing..." : "Run Forecast"}
                  <ArrowRight className="ml-2 h-5 w-5"/>
                </Button>
              ) : null}
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WarehouseSetupPage;

