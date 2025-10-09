import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRunSingleForecastMutation, useRunAggregateForecastMutation } from "../features/api/analysisApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, Upload, AlertCircle, Info } from "lucide-react";
import { ScaleLoader } from "react-spinners";

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
            <div className={`flex-1 h-1 mx-4 transition-all duration-300 rounded-full ${isCompleted ? "bg-green-600" : "bg-gray-300"}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

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
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [runSingleForecast, { isLoading: isSingleLoading }] = useRunSingleForecastMutation();
  const [runAggregateForecast, { isLoading: isAggregateLoading }] = useRunAggregateForecastMutation();
  const loading = isSingleLoading || isAggregateLoading;

  const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));  // React controlled inputs [web:32]
  const handleSelectChange = (value, id) => setFormData((prev) => ({ ...prev, [id]: value }));  // shadcn Select onValueChange pattern [web:32]
  const handleFileChange = (event) => setFormData((prev) => ({ ...prev, salesCsv: event.target.files?.[0] ?? null }));  // file into FormData later [web:42]

  const handleNumericChange =
    (id) =>
    (e) => {
      const raw = e.target.value;
      if (raw === "") {
        setFormData((prev) => ({ ...prev, [id]: "" }));
        return;
      }
      const num = Number(raw);
      if (!Number.isNaN(num)) setFormData((prev) => ({ ...prev, [id]: num }));
    };  // keep numeric state clean for payload [web:32]

  const handleForecast = async () => {
    if (!formData.salesCsv) {
      setError("Please upload a sales data CSV file.");
      return;
    }
    setError("");

    const payload = new FormData();
    payload.append("file", formData.salesCsv);  // Flask reads request.files["file"] [web:42]

    if (formData.analysisType === "single") {
      // Append flat snake_case keys that Flask reads from request.form.get(...)
      payload.append("service_level", String(formData.serviceLevel));
      payload.append("lead_time_days", String(formData.leadTimeDays));
      payload.append("current_inventory", String(formData.currentInventory));
      payload.append("ordering_cost", String(formData.orderingCost));
      payload.append("holding_cost", String(formData.holdingCost));
      payload.append("unit_cost", String(formData.unitCost));  // flat fields for multipart form [web:55]
    }

    try {
      if (formData.analysisType === "single") {
        await runSingleForecast(payload).unwrap();  // RTK Query with FormData body (don’t set content-type) [web:23]
      } else if (formData.analysisType === "aggregate") {
        await runAggregateForecast(payload).unwrap();  // same FormData handling [web:23]
      }
      navigate("/dashboard");  // navigate after success [web:33]
    } catch (err) {
      setError(err?.data?.message || "Analysis failed. Please check your data and try again.");  // unwrap error path [web:66]
    }
  };

  const renderStepContent = () => {
    const inputStyles =
      "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 h-12 text-base rounded-lg";
    const labelStyles = "text-base font-medium text-gray-700 flex items-center";

    const FileUploadArea = ({ onFileChange, file, requiredColumns }) => (
      <div className="space-y-6">
        <div
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 cursor-pointer"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <Upload className="w-16 h-16 text-gray-400" />
          <p className="mt-4 text-xl font-semibold text-gray-700">Drag & drop your file here</p>
          <p className="text-gray-500">or</p>
          <Button as="span" variant="outline" className="mt-2 text-green-700 border-green-600 hover:bg-green-600 hover:text-white">
            Choose a file
          </Button>
          <input id="fileInput" type="file" onChange={onFileChange} accept=".csv" className="hidden" />
        </div>
        {file && <p className="text-center text-green-700 font-semibold">{file.name}</p>}
        <p className="text-center text-sm text-gray-600">
          Required columns:{" "}
          {requiredColumns
            .map((col) => (
              <strong key={col} className="text-gray-800">
                {col}
              </strong>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}
          .
        </p>
      </div>
    );  // basic uploader UI [web:42]

    const NumericField = ({ id, label, placeholder, step, value, docKey }) => {
      const labelNode = (
        <>
          {label}
          {docKey && (
            <Link to={`/documentation?highlight=${docKey}`} className="ml-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" aria-label={`Learn more about ${label}`} className="ml-2">
                    <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learn more</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          )}
        </>
      );

      return (
        <div className="space-y-2">
          <Label htmlFor={id} className={labelStyles}>
            {labelNode}
          </Label>
          <Input
            id={id}
            type="number"
            inputMode="decimal"
            step={step}
            placeholder={placeholder}
            value={value}
            onChange={handleNumericChange(id)}
            className={inputStyles}
          />
        </div>
      );
    };  // numeric inputs for single-product params with optional tooltip/link

    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName" className={labelStyles}>
                Business Name
              </Label>
              <Input id="businessName" placeholder="e.g., Quantum Logistics" value={formData.businessName} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType" className={labelStyles}>
                Business Type
              </Label>
              <Select value={formData.businessType} onValueChange={(value) => handleSelectChange(value, "businessType")}>
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
              <Label htmlFor="contactName" className={labelStyles}>
                Contact Name
              </Label>
              <Input id="contactName" placeholder="e.g., Alex Ray" value={formData.contactName} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className={labelStyles}>
                Contact Email
              </Label>
              <Input id="contactEmail" type="email" placeholder="e.g., alex.ray@quantum.com" value={formData.contactEmail} onChange={handleInputChange} className={inputStyles} />
            </div>
          </div>
        );  // step 1 fields [web:32]
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="warehouseName" className={labelStyles}>
                Warehouse Name / ID
              </Label>
              <Input id="warehouseName" placeholder="e.g., Central Hub" value={formData.warehouseName} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouseAddress" className={labelStyles}>
                Warehouse Address
              </Label>
              <Input id="warehouseAddress" placeholder="e.g., 456 Supply Chain Ave" value={formData.warehouseAddress} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="storageLocations" className={labelStyles}>
                Storage System (Optional)
              </Label>
              <Textarea id="storageLocations" placeholder="Describe your storage layout..." value={formData.storageLocations} onChange={handleInputChange} className={`${inputStyles} h-24`} />
            </div>
          </div>
        );  // step 2 fields [web:32]
      case 3:
        if (!formData.analysisType) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Button variant="outline" className="h-48 border-gray-300 text-gray-800 hover:bg-green-600 hover:text-white hover:border-green-600 font-semibold text-xl flex flex-col justify-center items-center" onClick={() => setFormData((prev) => ({ ...prev, analysisType: "single" }))}>
                <span>Single Product</span>
                <span className="text-sm font-normal text-gray-500 mt-2">Optimize a single item.</span>
              </Button>
              <Button variant="outline" className="h-48 border-gray-300 text-gray-800 hover:bg-green-600 hover:text-white hover:border-green-600 font-semibold text-xl flex flex-col justify-center items-center" onClick={() => setFormData((prev) => ({ ...prev, analysisType: "aggregate" }))}>
                <span>Aggregate Business</span>
                <span className="text-sm font-normal text-black-500 mt-2">Get high-level predictions.</span>
              </Button>
            </div>
          );
        }  // analysis type chooser [web:32]

        return (
          <div className="space-y-8">
            <FileUploadArea
              onFileChange={handleFileChange}
              file={formData.salesCsv}
              requiredColumns={formData.analysisType === "single" ? ["ds", "y_sales", "y_quantity", "y_deliveries"] : ["ds", "y_sales", "y_revenue"]}
            />
            {formData.analysisType === "single" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <NumericField id="serviceLevel" label="Service Level (0.0 - 1.0)" placeholder="e.g., 0.95" step="0.01" value={formData.serviceLevel} docKey="serviceLevel" />
                <NumericField id="leadTimeDays" label="Lead Time (Days)" placeholder="e.g., 7" value={formData.leadTimeDays} docKey="leadTime" />
                <NumericField id="currentInventory" label="Current On-Hand Inventory" placeholder="e.g., 250" value={formData.currentInventory} docKey="currentInventory" />
                <NumericField id="orderingCost" label="Ordering Cost" placeholder="e.g., 100" value={formData.orderingCost} docKey="orderingCost" />
                <NumericField id="holdingCost" label="Holding Cost" placeholder="e.g., 10" value={formData.holdingCost} docKey="holdingCost" />
                <NumericField id="unitCost" label="Unit Cost" placeholder="e.g., 50" value={formData.unitCost} docKey="unitCost" />
              </div>
            )}
          </div>
        ); 
      default:
        return null; 
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
                  <Button
                    size="lg"
                    variant="outline"
                    className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300 h-12 px-8"
                    onClick={() => {
                      if (step === 3 && formData.analysisType) setFormData((prev) => ({ ...prev, analysisType: null }));
                      else setStep(step - 1);
                    }}
                  >
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
                    disabled={loading}
                  >
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
