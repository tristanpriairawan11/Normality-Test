"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { DataInput } from "@/components/DataInput";
import { TestConfig } from "@/components/TestConfig";
import { ResultDisplay, CalculateResponse } from "@/components/ResultDisplay";
import { RotateCcw, Play, AlertTriangle } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<number[]>([]);
  const [method, setMethod] = useState<string>("Otomatis (Disarankan)");
  const [alpha, setAlpha] = useState<number>(0.05);
  
  const [result, setResult] = useState<CalculateResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setResult(null);
    setError(null);
    // Complete reset of child components would require more state lifting,
    // but hiding results and errors is enough for now.
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-900/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      <main className="max-w-4xl mx-auto relative z-10">
        <Header />
        
        <div className="space-y-6">
          <DataInput onDataReady={setData} />
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
              <ResultDisplay result={result} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
