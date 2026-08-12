"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { DataInput } from "@/components/DataInput";
import { HistogramChart } from "@/components/HistogramChart";
import { TestConfig } from "@/components/TestConfig";
import { ResultDisplay, CalculateResponse } from "@/components/ResultDisplay";
import { DataTransformation } from "@/components/DataTransformation";
import { RotateCcw, Play, AlertTriangle, Download } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<number[]>([]);
  const [method, setMethod] = useState<string>("Otomatis (Disarankan)");
  const [alpha, setAlpha] = useState<number>(0.05);
  
  const [result, setResult] = useState<CalculateResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedData, setTransformedData] = useState<number[] | null>(null);
  const [transformError, setTransformError] = useState<string | null>(null);

  const [transformedMethod, setTransformedMethod] = useState<string>("Otomatis (Disarankan)");
  const [transformedAlpha, setTransformedAlpha] = useState<number>(0.05);
  const [transformedResult, setTransformedResult] = useState<CalculateResponse | null>(null);
  const [isCalculatingTransformed, setIsCalculatingTransformed] = useState(false);
  const [transformedError, setTransformedError] = useState<string | null>(null);

  const handleDataReady = (newData: number[]) => {
    setData(newData);
    // Reset all results when new data is inputted
    setResult(null);
    setError(null);
    setTransformedData(null);
    setTransformError(null);
    setTransformedResult(null);
    setTransformedError(null);
  };

  const handleCalculate = async () => {
    if (data.length < 3) {
      setError("Minimal diperlukan 3 data untuk melakukan uji normalitas.");
      return;
    }
    
    setIsCalculating(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetch("http://localhost:8000/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          method: method === "Otomatis (Disarankan)" ? null : method,
          alpha
        })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Terjadi kesalahan saat menghitung.");
      }
      
      const resData = await res.json();
      setResult(resData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    // A complete hard reset to return the app to its original state
    window.location.reload();
  };

  const handleTransform = async (transformMethod: string) => {
    setIsTransforming(true);
    setTransformError(null);
    setTransformedData(null);
    setTransformedResult(null);
    
    try {
      const res = await fetch("http://localhost:8000/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          method: transformMethod
        })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Terjadi kesalahan saat melakukan transformasi.");
      }
      
      const resData = await res.json();
      setTransformedData(resData.transformed_data);
    } catch (err: any) {
      setTransformError(err.message);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCalculateTransformed = async () => {
    if (!transformedData || transformedData.length < 3) {
      setTransformedError("Minimal diperlukan 3 data untuk melakukan uji normalitas.");
      return;
    }
    
    setIsCalculatingTransformed(true);
    setTransformedError(null);
    setTransformedResult(null);
    
    try {
      const res = await fetch("http://localhost:8000/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: transformedData,
          method: transformedMethod === "Otomatis (Disarankan)" ? null : transformedMethod,
          alpha: transformedAlpha
        })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Terjadi kesalahan saat menghitung.");
      }
      
      const resData = await res.json();
      setTransformedResult(resData);
    } catch (err: any) {
      setTransformedError(err.message);
    } finally {
      setIsCalculatingTransformed(false);
    }
  };

  const handleDownloadTransformed = () => {
    if (!transformedData) return;
    const csvContent = "data:text/csv;charset=utf-8," + "Index,Transformed_Value\n" + transformedData.map((val, idx) => `${idx + 1},${val}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transformed_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-900/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      <main className="max-w-4xl mx-auto relative z-10">
        <Header />
        
        <div className="space-y-6">
          <DataInput onDataReady={handleDataReady} />
          
          <HistogramChart data={data} />

          <TestConfig 
            method={method} 
            onMethodChange={setMethod} 
            alpha={alpha} 
            onAlphaChange={setAlpha} 
          />
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-12">
            <button 
              onClick={handleCalculate}
              disabled={isCalculating || data.length === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
              {isCalculating ? "Menghitung..." : "Hitung Normalitas"}
            </button>
            <button 
              onClick={handleReset}
              className="btn-secondary sm:w-auto w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-500" id="results">
              <ResultDisplay result={result} data={data} />
            </div>
          )}

          {/* Data Transformation */}
          <div className="mt-12">
            <DataTransformation 
              data={data}
              onTransform={handleTransform}
              isTransforming={isTransforming}
            />
            {transformError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 mt-4">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{transformError}</p>
              </div>
            )}
          </div>

          {/* Transformed Data Analysis */}
          {transformedData && (
            <div className="mt-12 pt-12 border-t border-white/10 animate-in fade-in duration-500 space-y-6">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">Analisis Data Hasil Transformasi</h2>
                    <p className="text-gray-400">Visualisasi dan uji normalitas untuk data yang telah ditransformasikan.</p>
                  </div>
                  <button
                    onClick={handleDownloadTransformed}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm border border-white/10"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </button>
                </div>

                {/* Data Preview */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4">
                  <p className="text-sm text-gray-300 font-medium mb-3">Preview Data Hasil Transformasi (5 Baris Pertama):</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs text-gray-400 uppercase bg-black/40">
                        <tr>
                          <th className="px-4 py-2 border-b border-white/5 w-16">No</th>
                          <th className="px-4 py-2 border-b border-white/5">Nilai Transformasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transformedData.slice(0, 5).map((val, idx) => (
                          <tr key={idx} className="border-b border-white/5 last:border-0">
                            <td className="px-4 py-2 text-gray-500">{idx + 1}</td>
                            <td className="px-4 py-2 bg-primary-500/10 font-medium text-white">
                              {val.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <HistogramChart data={transformedData} />

              <TestConfig 
                method={transformedMethod} 
                onMethodChange={setTransformedMethod} 
                alpha={transformedAlpha} 
                onAlphaChange={setTransformedAlpha} 
              />
              
              {transformedError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{transformedError}</p>
                </div>
              )}

              {/* Actions for Transformed */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-8">
                <button 
                  onClick={handleCalculateTransformed}
                  disabled={isCalculatingTransformed || transformedData.length === 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculatingTransformed ? (
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                  {isCalculatingTransformed ? "Menghitung..." : "Hitung Normalitas Data Transformasi"}
                </button>
              </div>

              {/* Results for Transformed */}
              {transformedResult && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                  <ResultDisplay result={transformedResult} data={transformedData} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
