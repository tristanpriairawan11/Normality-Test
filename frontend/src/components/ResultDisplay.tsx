"use client";

import { Download, FileText, CheckCircle2, XCircle, Calculator } from "lucide-react";

export interface CalculateResponse {
  n: number;
  method_used: string;
  is_auto_selected: boolean;
  test_name: string;
  statistic: number;
  p_value: number;
  alpha: number;
  is_normal: boolean;
  decision_text: string;
  conclusion_text: string;
}

interface ResultDisplayProps {
  result: CalculateResponse;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const isNormal = result.is_normal;

  return (
    <div className="glass-card animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <div className="p-2.5 bg-blue-500/10 rounded-xl">
          <Calculator className="w-6 h-6 text-blue-400" />
        </div>
        Hasil Uji Normalitas
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Stats Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
            <span className="text-gray-400">Jumlah Sampel (N)</span>
            <span className="font-mono text-lg font-semibold text-white">{result.n}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
            <span className="text-gray-400">Metode Uji</span>
            <span className="font-medium text-blue-400 text-right">
              {result.is_auto_selected && <span className="block text-xs text-blue-400/70 mb-0.5">Dipilih otomatis:</span>}
              {result.test_name}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
            <span className="text-gray-400">Statistic</span>
            <span className="font-mono text-lg font-semibold text-white">{result.statistic.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
            <span className="text-gray-400">p-value</span>
            <span className="font-mono text-lg font-semibold text-white">{result.p_value.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
            <span className="text-gray-400">Alpha (α)</span>
            <span className="font-mono text-lg font-semibold text-white">{result.alpha}</span>
          </div>
        </div>

        {/* Conclusion Column */}
        <div className="flex flex-col h-full">
          <div className={`flex-1 p-6 rounded-xl border ${isNormal ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} flex flex-col items-center justify-center text-center`}>
            {isNormal ? (
              <CheckCircle2 className="w-16 h-16 text-green-400 mb-4 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
            ) : (
              <XCircle className="w-16 h-16 text-red-400 mb-4 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
            )}
            
            <h3 className="text-xl font-bold text-white mb-2">
              {isNormal ? "Data Berdistribusi Normal" : "Data Tidak Berdistribusi Normal"}
            </h3>
            
            <p className={`text-sm ${isNormal ? 'text-green-300/80' : 'text-red-300/80'} mb-6`}>
              {result.decision_text}
            </p>

            <div className="w-full bg-black/40 p-4 rounded-lg text-left border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Kesimpulan:</p>
              <p className="text-sm text-gray-200">
                {result.conclusion_text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Downloads */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
        <button className="btn-secondary flex-1 flex items-center justify-center gap-2 group">
          <FileText className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
          Download PDF
        </button>
        <button className="btn-secondary flex-1 flex items-center justify-center gap-2 group">
          <Download className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
          Download CSV
        </button>
      </div>
    </div>
  );
}
