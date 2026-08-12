import React, { useState, useEffect } from 'react';
import { Settings, Play, Lock, ChevronDown, ChevronUp } from 'lucide-react';

interface DataTransformationProps {
  data: number[];
  onTransform: (method: string) => void;
  isTransforming: boolean;
}

export function DataTransformation({ data, onTransform, isTransforming }: DataTransformationProps) {
  const [method, setMethod] = useState<string>('yeo-johnson');
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if Box-Cox is allowed (no data point <= 0)
  const isBoxCoxDisabled = data.some(val => val <= 0);
  
  // If Box-Cox becomes disabled but is currently selected, switch to Yeo-Johnson
  useEffect(() => {
    if (isBoxCoxDisabled && method === 'box-cox') {
      setMethod('yeo-johnson');
    }
  }, [data, isBoxCoxDisabled, method]);

  const handleApply = () => {
    onTransform(method);
  };

  return (
    <div className="glass-card mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Settings className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-white">Transformasi Data (Opsional)</h2>
            <p className="text-sm text-gray-400">Atasi data yang tidak berdistribusi normal</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-medium text-gray-300">
              Metode Transformasi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setMethod('yeo-johnson')}
                className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                  method === 'yeo-johnson'
                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${method === 'yeo-johnson' ? 'text-purple-300' : 'text-gray-300'}`}>
                    Yeo-Johnson
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    method === 'yeo-johnson' ? 'border-purple-500' : 'border-gray-500'
                  }`}>
                    {method === 'yeo-johnson' && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                  </div>
                </div>
                <p className="text-xs text-gray-400">Cocok untuk semua jenis data (termasuk nilai negatif & nol)</p>
              </button>

              <button
                onClick={() => !isBoxCoxDisabled && setMethod('box-cox')}
                disabled={isBoxCoxDisabled}
                className={`p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden ${
                  isBoxCoxDisabled
                    ? 'opacity-50 cursor-not-allowed border-white/5 bg-black/20'
                    : method === 'box-cox'
                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {isBoxCoxDisabled && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-lg border border-white/10">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-300 font-medium">Terkunci (Ada data ≤ 0)</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${method === 'box-cox' ? 'text-purple-300' : 'text-gray-300'}`}>
                    Box-Cox
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    method === 'box-cox' ? 'border-purple-500' : 'border-gray-500'
                  }`}>
                    {method === 'box-cox' && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                  </div>
                </div>
                <p className="text-xs text-gray-400">Hanya untuk data bernilai positif (&gt;0)</p>
              </button>
            </div>
          </div>

          <button
            onClick={handleApply}
            disabled={isTransforming || data.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isTransforming ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
            {isTransforming ? "Menerapkan Transformasi..." : "Terapkan Transformasi"}
          </button>
        </div>
      )}
    </div>
  );
}
