import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle } from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;
const SupplierSelection = () => {
  const [file, setFile] = useState(null);
  const [weights, setWeights] = useState({
    cost: 30,
    reliability: 25,
    quality: 20,
    lead_time: 15,
    location: 10
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid CSV file');
    }
  };

  // Handle weight changes
  const handleWeightChange = (criterion, value) => {
    setWeights(prev => ({
      ...prev,
      [criterion]: Number(value)
    }));
  };

  // Download template
  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/suppliers/template');
      const template = await response.json();
      
      // Create CSV content
      const headers = template.headers.join(',');
      const sampleRows = template.sample_data.map(row => 
        template.headers.map(header => row[header]).join(',')
      ).join('\n');
      
      const csvContent = `${headers}\n${sampleRows}`;
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'supplier_evaluation_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download template');
    }
  };

  // Run supplier evaluation
  const evaluateSuppliers = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('weights', JSON.stringify({
      cost: weights.cost / 100,
      reliability: weights.reliability / 100,
      quality: weights.quality / 100,
      lead_time: weights.lead_time / 100,
      location: weights.location / 100
    }));

    try {
      const response = await fetch('http://localhost:3000/api/evaluate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to evaluate suppliers');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFile(null);
    setResults(null);
    setError(null);
    document.getElementById('fileInput').value = '';
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#DDDBCB] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-yellow-400">Supplier Evaluation & Scoring</h2>
          <p className="mt-2 text-lg text-gray-300">
            Rank suppliers based on cost, reliability, quality, and other factors
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-black/20 border-white/20">
          <CardHeader>
            <h3 className="text-2xl font-semibold text-white">Upload Supplier Data</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Template Download */}
            <div className="flex items-center justify-between p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
              <div>
                <h4 className="text-lg font-semibold text-blue-300">Need a template?</h4>
                <p className="text-sm text-gray-400">
                  Download our CSV template with sample supplier data
                </p>
              </div>
              <Button 
                onClick={downloadTemplate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="fileInput" className="text-lg text-[#DDDBCB]">
                Upload Supplier CSV File
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="fileInput"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="bg-black/20 border-white/20 text-white"
                />
                {file && (
                  <span className="text-green-400 text-sm">
                    Uploaded
                  </span>
                )}
              </div>
            </div>

            {/* Weights Configuration */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Evaluation Criteria Weights (%)</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(weights).map(([criterion, value]) => (
                  <div key={criterion} className="space-y-2">
                    <Label className="text-sm capitalize text-gray-300">
                      {criterion.replace('_', ' ')}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => handleWeightChange(criterion, e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Total: {Object.values(weights).reduce((sum, val) => sum + val, 0)}%
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={evaluateSuppliers}
                disabled={loading || !file}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Evaluate Suppliers
                  </>
                )}
              </Button>
              
              {results && (
                <Button onClick={resetForm} variant="outline" className="border-gray-500 text-gray-300">
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <>
            {/* Summary Stats */}
            <Card className="bg-black/20 border-white/20">
              <CardHeader>
                <h3 className="text-2xl font-semibold text-white">Evaluation Summary</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      {results.total_suppliers}
                    </div>
                    <div className="text-gray-400">Total Suppliers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {results.suppliers.filter(s => s.recommendation === 'Highly Recommended').length}
                    </div>
                    <div className="text-gray-400">Highly Recommended</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {results.suppliers[0]?.total_score.toFixed(1)}
                    </div>
                    <div className="text-gray-400">Top Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Chart */}
            <Card className="bg-black/20 border-white/20">
              <CardHeader>
                <h3 className="text-2xl font-semibold text-white">Supplier Scores Comparison</h3>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={results.suppliers.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="supplier_name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_score" fill="#FCD34D" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Results Table */}
            <Card className="bg-black/20 border-white/20">
              <CardHeader>
                <h3 className="text-2xl font-semibold text-white">Detailed Rankings</h3>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-3 px-4 text-gray-400">Rank</th>
                        <th className="text-left py-3 px-4 text-gray-400">Supplier</th>
                        <th className="text-center py-3 px-4 text-gray-400">Total Score</th>
                        <th className="text-center py-3 px-4 text-gray-400">Cost</th>
                        <th className="text-center py-3 px-4 text-gray-400">Reliability</th>
                        <th className="text-center py-3 px-4 text-gray-400">Quality</th>
                        <th className="text-center py-3 px-4 text-gray-400">Lead Time</th>
                        <th className="text-center py-3 px-4 text-gray-400">Location</th>
                        <th className="text-center py-3 px-4 text-gray-400">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.suppliers.map((supplier) => (
                        <tr key={supplier.supplier_id} className="border-b border-gray-700 hover:bg-black/20">
                          <td className="py-3 px-4 text-white font-semibold">#{supplier.rank}</td>
                          <td className="py-3 px-4 text-white">{supplier.supplier_name}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-lg font-bold text-yellow-400">
                              {supplier.total_score}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-300">{supplier.cost_score}</td>
                          <td className="py-3 px-4 text-center text-gray-300">{supplier.reliability_score}</td>
                          <td className="py-3 px-4 text-center text-gray-300">{supplier.quality_score}</td>
                          <td className="py-3 px-4 text-center text-gray-300">{supplier.lead_time_score}</td>
                          <td className="py-3 px-4 text-center text-gray-300">{supplier.location_score}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded text-sm font-medium
                              ${supplier.recommendation_color === 'green' ? 'bg-green-900/50 text-green-300' :
                                supplier.recommendation_color === 'yellow' ? 'bg-yellow-900/50 text-yellow-300' :
                                supplier.recommendation_color === 'orange' ? 'bg-orange-900/50 text-orange-300' :
                                'bg-red-900/50 text-red-300'}`}>
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
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierSelection;
