import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle, Info } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ScaleLoader } from "react-spinners"; // <-- 1. IMPORT THE SPINNER
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const API_URL = import.meta.env.VITE_API_URL;

const SupplierSelectionPage = () => {
  const [file, setFile] = useState(null);
  const [weights, setWeights] = useState({
    cost: 30,
    reliability: 25,
    quality: 20,
    lead_time: 15,
    location: 10,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // All your handler functions remain the same
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a valid CSV file.");
    }
  };

  const handleWeightChange = (criterion, value) => {
    setWeights((prev) => ({
      ...prev,
      [criterion]: Number(value),
    }));
  };

  const evaluateSuppliers = async () => {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }
    const totalWeight = Object.values(weights).reduce(
      (sum, val) => sum + val,
      0
    );
    if (totalWeight !== 100) {
      setError(`Weights must sum to 100%. Current total: ${totalWeight}%.`);
      return;
    }
    setLoading(true);
    setResults(null);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "weights",
      JSON.stringify({
        cost: weights.cost / 100,
        reliability: weights.reliability / 100,
        quality: weights.quality / 100,
        lead_time: weights.lead_time / 100,
        location: weights.location / 100,
      })
    );
    try {
      const response = await fetch(`${API_URL}/api/evaluate`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "An unknown server error occurred." }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to evaluate suppliers.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResults(null);
    setError(null);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-8 poppins">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800">
            <span className="text-green-600">Supplier Evaluation</span> &
            Scoring
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Rank your partners based on custom weights for cost, quality,
            reliability, and more.
          </p>
        </div>

        <Card className="bg-white border-gray-200 shadow-lg rounded-2xl">
          <CardHeader className="border-b border-gray-200 p-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Configuration & Data Upload
            </h3>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div>
                <h4 className="text-xl font-semibold text-green-800">
                  Start with a Template
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Download our CSV template to ensure your data is formatted
                  correctly.
                </p>
              </div>
              <a href="./template_suppliers.csv">
              <Button
                className="mt-4 sm:mt-0 bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" /> Download Template
              </Button>
              </a>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="fileInput"
                className="text-lg font-medium text-gray-700"
              >
                Upload Supplier CSV
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="fileInput"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="flex-grow bg-white border-gray-300 text-gray-800 file:text-green-700 file:bg-green-100 file:hover:bg-green-200 file:cursor-pointer"
                />
                {file && (
                  <span className="text-sm font-medium text-green-600 flex items-center">
                    <Upload className="mr-1 h-4 w-4" />
                    {file.name}
                  </span>
                )}
              </div>
            </div>

            <TooltipProvider delayDuration={200}>
  <div className="space-y-4">
    <h4 className="text-xl font-semibold text-gray-800">
      Evaluation Criteria Weights (%)
    </h4>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Object.entries(weights).map(([criterion, value]) => {
        const labelText = criterion.replace("_", " ");

        const helpByKey = {
          cost: "Lower cost normalizes to a higher score; balance against quality and reliability.",
          reliability: "Delivery consistency, SLA adherence, and defect history influence reliability.",
          quality: "Inspection pass rates and product conformance drive quality scoring.",
          lead_time: "Shorter lead time is scored higher after scaling and normalization.",
          location: "Closer suppliers reduce logistics risk, time, and transportation cost.",
        };

        const tip = helpByKey[criterion] ?? "Adjust weight to influence total score contribution.";

        return (
          <div key={criterion} className="space-y-2">
            <div className="flex items-center gap-1">
              <Label className="text-sm capitalize text-gray-600">
                {labelText}
              </Label>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={`${labelText} help`}
                    className="inline-flex rounded p-0.5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-xs">
                  <p className="text-sm">{tip}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Input
              type="number"
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleWeightChange(criterion, e.target.value)}
              className="bg-white border-gray-300 text-gray-800 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        );
      })}
    </div>

    <p
      className={`text-sm font-semibold ${
        Object.values(weights).reduce((sum, val) => sum + val, 0) === 100
          ? "text-green-600"
          : "text-red-600"
      }`}
    >
      Total Weight: {Object.values(weights).reduce((sum, val) => sum + val, 0)}%
      (Must be 100%)
    </p>
  </div>
</TooltipProvider>

            {error && (
              <div className="flex items-center p-4 bg-red-100 rounded-lg border border-red-300">
                <AlertCircle className="mr-3 h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            )}
            <div className="flex space-x-4 pt-4">
              {/* --- 2. UPDATED BUTTON --- */}
              <Button
                onClick={evaluateSuppliers}
                // The button is correctly disabled while loading
                disabled={
                  loading ||
                  !file ||
                  Object.values(weights).reduce((sum, val) => sum + val, 0) !==
                    100
                }
                className="bg-green-600 text-white hover:bg-green-700 h-12 px-8 font-semibold flex items-center justify-center min-w-[150px]"
              >
                {/* This ternary operator shows the spinner when loading is true */}
                {loading ? (
                  <ScaleLoader
                    color={"#ffffff"}
                    height={20}
                    width={4}
                    radius={2}
                  />
                ) : (
                  "Run Evaluation"
                )}
              </Button>
              {(results || file) && (
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="h-12 px-8"
                >
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section remains the same */}
        {results && (
          <div className="space-y-8">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Evaluation Summary
                </h3>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600">
                    {results.total_suppliers}
                  </div>
                  <div className="text-gray-600 mt-1">Total Suppliers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600">
                    {
                      results.suppliers.filter(
                        (s) => s.recommendation === "Highly Recommended"
                      ).length
                    }
                  </div>
                  <div className="text-gray-600 mt-1">Highly Recommended</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600">
                    {results.suppliers[0]?.total_score.toFixed(1) || "N/A"}
                  </div>
                  <div className="text-gray-600 mt-1">Top Score</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Top 10 Supplier Scores
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={results.suppliers.slice(0, 10)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="supplier_name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      stroke="#4B5563"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#4B5563" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                      }}
                    />
                    <Bar
                      dataKey="total_score"
                      fill="#10B981"
                      name="Total Score"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Detailed Rankings
                </h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-b-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr className="border-b">
                        <th className="text-left p-3 font-bold text-gray-600">
                          Rank
                        </th>
                        <th className="text-left p-3 font-bold text-gray-600">
                          Supplier
                        </th>
                        <th className="text-center p-3 font-bold text-gray-600">
                          Total Score
                        </th>
                        {Object.keys(weights).map((criterion) => (
                          <th
                            key={criterion}
                            className="text-center p-3 font-bold text-gray-600 capitalize"
                          >
                            {criterion.replace("_", " ")}
                          </th>
                        ))}
                        <th className="text-center p-3 font-bold text-gray-600">
                          Recommendation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.suppliers.map((supplier, index) => (
                        <tr
                          key={supplier.supplier_id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3 font-bold text-green-700">
                            #{supplier.rank}
                          </td>
                          <td className="p-3 text-gray-800">
                            {supplier.supplier_name}
                          </td>
                          <td className="p-3 text-center font-bold text-green-600">
                            {supplier.total_score.toFixed(1)}
                          </td>
                          <td className="p-3 text-center text-gray-600">
                            {supplier.cost_score.toFixed(1)}
                          </td>
                          <td className="p-3 text-center text-gray-600">
                            {supplier.reliability_score.toFixed(1)}
                          </td>
                          <td className="p-3 text-center text-gray-600">
                            {supplier.quality_score.toFixed(1)}
                          </td>
                          <td className="p-3 text-center text-gray-600">
                            {supplier.lead_time_score.toFixed(1)}
                          </td>
                          <td className="p-3 text-center text-gray-600">
                            {supplier.location_score.toFixed(1)}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                supplier.recommendation_color === "green"
                                  ? "bg-green-100 text-green-800"
                                  : supplier.recommendation_color === "yellow"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {supplier.recommendation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierSelectionPage;
