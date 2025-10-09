import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRunSingleForecastMutation, useRunAggregateForecastMutation } from "../features/api/analysisApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Upload, AlertCircle } from "lucide-react";
import { ScaleLoader } from "react-spinners";

// Stepper component remains the same
const Stepper = ({ currentStep, steps }) => (
    <div className="flex items-center justify-center w-full">
    {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isCurrent = currentStep === stepNumber;
        return (
        <React.Fragment key={step}>
            <div className="flex flex-col items-center">
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2 ${
                isCompleted
                    ? "bg-green-600 border-green-600 text-white"
                    : isCurrent
                    ? "bg-green-800 text-white border-green-800"
                    : "bg-gray-200 border-gray-300 text-green-800"
                }`}
            >
                {isCompleted ? "✓" : stepNumber}
            </div>
            <p className={`mt-2 text-sm font-semibold transition-all duration-300 ${isCurrent || isCompleted ? "text-green-800" : "text-gray-500"}`}>
                {step}
            </p>
            </div>
            {stepNumber < steps.length && (
            <div className={`flex-1 h-1 mx-4 transition-all duration-300 rounded-full ${isCompleted ? "bg-green-600" : "bg-gray-300"}`}></div>
            )}
        </React.Fragment>
        );
    })}
    </div>
);


export default function WarehouseSetupPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        businessName: "", businessType: "", contactName: "", contactEmail: "",
        warehouseName: "", warehouseAddress: "", storageLocations: "", salesCsv: null,
        serviceLevel: 0.95, leadTimeDays: 7, currentInventory: 0,
        orderingCost: 100, holdingCost: 10, unitCost: 50, analysisType: null,
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [runSingleForecast, { isLoading: isSingleLoading }] = useRunSingleForecastMutation();
    const [runAggregateForecast, { isLoading: isAggregateLoading }] = useRunAggregateForecastMutation();
    
    const loading = isSingleLoading || isAggregateLoading;

    const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    const handleSelectChange = (value, id) => setFormData((prev) => ({ ...prev, [id]: value }));
    const handleFileChange = (event) => setFormData((prev) => ({ ...prev, salesCsv: event.target.files[0] }));
    
    // --- FIX IS HERE: Implemented the handleForecast function ---
    const handleForecast = async () => {
        if (!formData.salesCsv) {
            setError("Please upload a sales data CSV file.");
            return;
        }
        setError(""); // Clear previous errors

        const payload = new FormData();
        payload.append("file", formData.salesCsv);
        
        // Append other relevant parameters for the backend
        const parameters = {
            serviceLevel: formData.serviceLevel,
            leadTimeDays: formData.leadTimeDays,
            currentInventory: formData.currentInventory,
            orderingCost: formData.orderingCost,
            holdingCost: formData.holdingCost,
            unitCost: formData.unitCost,
        };
        payload.append("parameters", JSON.stringify(parameters));
        
        try {
            if (formData.analysisType === 'single') {
                // Use .unwrap() to get the actual response or throw an error
                await runSingleForecast(payload).unwrap();
            } else if (formData.analysisType === 'aggregate') {
                await runAggregateForecast(payload).unwrap();
            }
            
            // On success, navigate to the dashboard
            navigate('/dashboard');
        } catch (err) {
            // Set error message from backend response or a generic fallback
            setError(err.data?.message || "Analysis failed. Please check your data and try again.");
        }
    };

    const renderStepContent = () => {
        const inputStyles = "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 h-12 text-base rounded-lg";
        const labelStyles = "text-base font-medium text-gray-700 flex items-center";

        const FileUploadArea = ({ onFileChange, file, requiredColumns }) => (
            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 cursor-pointer"
                    onClick={() => document.getElementById("fileInput")?.click()}>
                    <Upload className="w-16 h-16 text-gray-400" />
                    <p className="mt-4 text-xl font-semibold text-gray-700">Drag & drop your file here</p>
                    <p className="text-gray-500">or</p>
                    <Button as="span" variant="outline" className="mt-2 text-green-700 border-green-600 hover:bg-green-600 hover:text-white">Choose a file</Button>
                    <input id="fileInput" type="file" onChange={onFileChange} accept=".csv" className="hidden" />
                </div>
                {file && <p className="text-center text-green-700 font-semibold">{file.name}</p>}
                <p className="text-center text-sm text-gray-600">
                    Required columns: {requiredColumns.map(col => <strong key={col} className="text-gray-800">{col}</strong>).reduce((prev, curr) => [prev, ', ', curr])}.
                </p>
            </div>
        );
        
        switch (step) {
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2"><Label htmlFor="businessName" className={labelStyles}>Business Name</Label><Input id="businessName" placeholder="e.g., Quantum Logistics" value={formData.businessName} onChange={handleInputChange} className={inputStyles} /></div>
                        <div className="space-y-2"><Label htmlFor="businessType" className={labelStyles}>Business Type</Label><Select value={formData.businessType} onValueChange={(value) => handleSelectChange(value, 'businessType')}><SelectTrigger id="businessType" className={inputStyles}><SelectValue placeholder="Select a type" /></SelectTrigger><SelectContent><SelectItem value="ecommerce">E-commerce</SelectItem><SelectItem value="retail">Retail</SelectItem><SelectItem value="wholesale">Wholesale</SelectItem><SelectItem value="manufacturing">Manufacturing</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="contactName" className={labelStyles}>Contact Name</Label><Input id="contactName" placeholder="e.g., Alex Ray" value={formData.contactName} onChange={handleInputChange} className={inputStyles} /></div>
                        <div className="space-y-2"><Label htmlFor="contactEmail" className={labelStyles}>Contact Email</Label><Input id="contactEmail" type="email" placeholder="e.g., alex.ray@quantum.com" value={formData.contactEmail} onChange={handleInputChange} className={inputStyles} /></div>
                    </div>
                );
            case 2:
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2"><Label htmlFor="warehouseName" className={labelStyles}>Warehouse Name / ID</Label><Input id="warehouseName" placeholder="e.g., Central Hub" value={formData.warehouseName} onChange={handleInputChange} className={inputStyles} /></div>
                        <div className="space-y-2"><Label htmlFor="warehouseAddress" className={labelStyles}>Warehouse Address</Label><Input id="warehouseAddress" placeholder="e.g., 456 Supply Chain Ave" value={formData.warehouseAddress} onChange={handleInputChange} className={inputStyles} /></div>
                        <div className="space-y-2 col-span-2"><Label htmlFor="storageLocations" className={labelStyles}>Storage System (Optional)</Label><Textarea id="storageLocations" placeholder="Describe your storage layout..." value={formData.storageLocations} onChange={handleInputChange} className={`${inputStyles} h-24`} /></div>
                    </div>
                );
            case 3:
                if (!formData.analysisType) {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Button variant="outline" className="h-48 border-gray-300 text-gray-800 hover:bg-green-600 hover:text-white hover:border-green-600 font-semibold text-xl flex flex-col justify-center items-center" onClick={() => setFormData((prev) => ({ ...prev, analysisType: "single" }))}><span>Single Product</span><span className="text-sm font-normal text-gray-500 mt-2">Optimize a single item.</span></Button>
                            <Button variant="outline" className="h-48 border-gray-300 text-gray-800 hover:bg-green-600 hover:text-white hover:border-green-600 font-semibold text-xl flex flex-col justify-center items-center" onClick={() => setFormData((prev) => ({ ...prev, analysisType: "aggregate" }))}><span>Aggregate Business</span><span className="text-sm font-normal text-black-500 mt-2">Get high-level predictions.</span></Button>
                        </div>
                    );
                }
                return <FileUploadArea onFileChange={handleFileChange} file={formData.salesCsv} requiredColumns={formData.analysisType === 'single' ? ["ds", "y_sales", "y_quantity", "y_deliveries"] : ["ds", "y_sales", "y_revenue"]} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 poppins flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-6xl mx-auto space-y-12">
                 <div className="text-center">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800">
                        <span className="text-green-600">Warehouse Setup</span> & Analytics
                    </h2>
                    <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
                       A step-by-step guide to configure your warehouse, upload data, and generate powerful inventory forecasts.
                    </p>
                </div>

                <Card className="w-full rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <CardHeader className="p-8 border-b border-gray-200">
                        <Stepper currentStep={step} steps={["Business", "Warehouse", "Analytics"]} />
                    </CardHeader>
                    <CardContent className="px-8 md:px-12 py-10 min-h-[40vh]">
                        {error && (
                            <div className="flex items-center p-4 mb-6 bg-red-100 rounded-lg border border-red-300">
                                <AlertCircle className="mr-3 h-5 w-5 text-red-600" />
                                <span className="text-red-800 font-medium">{error}</span>
                            </div>
                        )}
                        {renderStepContent()}
                    </CardContent>
                    {step < 4 && (
                        <CardFooter className="flex justify-between p-8 bg-gray-50 rounded-b-2xl border-t">
                            <div>
                                {step > 1 && (
                                    <Button size="lg" variant="outline" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300 h-12 px-8"
                                        onClick={() => {
                                            if (step === 3 && formData.analysisType) setFormData((prev) => ({ ...prev, analysisType: null }));
                                            else setStep(step - 1);
                                        }}>
                                        <ArrowLeft className="mr-2 h-5 w-5" /> Previous
                                    </Button>
                                )}
                            </div>
                            <div>
                                {(step < 3 || (step === 3 && formData.analysisType)) && (
                                    <Button
                                        size="lg"
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer h-12 px-8 flex items-center justify-center min-w-[180px]"
                                        onClick={() => (step === 3 ? handleForecast() : setStep(step + 1))}
                                        disabled={loading}>
                                        {loading ? (
                                            <ScaleLoader color={"#ffffff"} height={20} />
                                        ) : (
                                            <>
                                                {step === 3 ? "Run Analysis" : "Next Step"}
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}
