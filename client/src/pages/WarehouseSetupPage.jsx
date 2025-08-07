import Footer from "@/components/Footer";
import SleekNavbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
// Added new icons for buttons
import { Building2, FileText, Package, Upload, User, ArrowLeft, ArrowRight } from "lucide-react";

// --- 1. NEW: Form Data State Management ---
// Central state to hold all form inputs
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

// --- 2. NEW: Stepper Component ---
// A visual component to show form progress
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
  // Initialize the form data state
  const [formData, setFormData] = useState(initialFormData);

  // Generic handler for text inputs and textareas
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Specific handler for the Select component
  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, businessType: value }));
  };

  const renderStepContent = () => {
    // Shared styling for input fields to make them stand out
    const inputStyles = "bg-black/20 border-white/20 focus:ring-2 focus:ring-cyan-500 h-12 text-base";
    
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold">Business Information</h3>
              <p className="text-gray-400 mt-1">Let's start with the basics.</p>
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
              <h3 className="text-3xl font-bold">Warehouse Details</h3>
              <p className="text-gray-400 mt-1">Where will the inventory be stored?</p>
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
              <h3 className="text-3xl font-bold">Upload Sales Data</h3>
              <p className="text-gray-400 mt-1">Upload last month's sales CSV to get started with analytics.</p>
            </div>
            <p className="text-center text-sm text-gray-400">Ensure the file has columns for: <strong className="text-white/80">OrderID, OrderDate, SKU, QuantitySold, PricePerUnit</strong>.</p>
            <div className="flex flex-col items-center justify-center p-12 mt-4 border-2 border-dashed border-white/20 rounded-lg hover:border-cyan-500 hover:bg-black/20 transition-all duration-300">
                <Upload className="w-16 h-16 text-gray-500"/>
                <p className="mt-4 text-xl font-semibold">Drag & drop your CSV file here</p>
                <p className="text-gray-400">or</p>
                <form><input type="file" variant="secondary" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mt-2 cursor-pointer h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 w-40"/></form>
            </div>
          </div>
        );
      default:
        return <div className="text-center py-20"><h2 className="text-4xl font-bold text-cyan-400">Setup Complete!</h2><p className="mt-4 text-lg">Your warehouse is ready. You can now proceed to your dashboard.</p></div>;
    }
  };


  return (
    <>
      <SleekNavbar />
      <div className="min-h-screen bg-[#101010] text-[#DDDBCB] font-poppins flex items-center justify-center p-4 mt-16">
        {/* --- 3. UPDATED: Card with larger size and more padding --- */}
        <Card className="w-full max-w-6xl rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl">
          <CardHeader className="p-8">
            <Stepper currentStep={step} steps={['Business', 'Warehouse', 'Sales Data']} />
          </CardHeader>
          <CardContent className="px-12 py-10 min-h-[45vh]">
            {renderStepContent()}
          </CardContent>
          <CardFooter className="flex justify-between p-8 bg-black/20 rounded-b-2xl">
            {step > 1 ? (
              <Button size="lg" variant="outline" className="cursor-pointer" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 h-5 w-5"/>
                Previous Step
              </Button>
            ) : (
              <div /> // Placeholder to keep the 'Next' button on the right
            )}
            {step < 5 ? (
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer" onClick={() => setStep(step + 1)}>
                {step === 4 ? "Finish Setup" : "Next Step"}
                <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            ) : null}
          </CardFooter>
        </Card>
      </div>
      <Footer className="" />
    </>
  );
};

export default WarehouseSetupPage;
