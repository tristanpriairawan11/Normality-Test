"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { DataInput } from "@/components/DataInput";
import { TestConfig } from "@/components/TestConfig";
import { ResultDisplay } from "@/components/ResultDisplay";
import { RotateCcw, Play } from "lucide-react";

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate network request / calculation
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
    }, 800);
  };

  const handleReset = () => {
    setShowResults(false);
    // Note: To fully reset child components, we might need state lifting, 
    // but for this demo, hiding the results is sufficient.
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-900/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      <main className="max-w-4xl mx-auto relative z-10">
        <Header />
        
        <div className="space-y-6">
          <DataInput />
          <TestConfig />
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-12">
            <button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
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
          {showResults && (
            <div className="mt-8" id="results">
              <ResultDisplay />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
