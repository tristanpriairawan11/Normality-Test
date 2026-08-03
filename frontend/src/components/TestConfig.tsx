"use client";

import { Settings2, Info } from "lucide-react";

export function TestConfig() {
  return (
    <div className="glass-card mb-8">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <span className="bg-purple-500/20 text-purple-400 p-2 rounded-lg mr-3">2</span>
        Konfigurasi Uji
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Method Selection */}
        <div className="space-y-3">
          <label className="text-sm text-gray-300 font-medium">Metode Uji Normalitas</label>
          <div className="relative">
            <select className="glass-input appearance-none cursor-pointer">
              <option value="auto" className="bg-surface text-white">✨ (Default) Otomatis (Disarankan)</option>
              <optgroup label="Pilih Manual" className="bg-surface text-gray-400">
                <option value="jarque_bera" className="text-white">Jarque Bera</option>
                <option value="skewness_kurtosis" className="text-white">Skewness Kurtosis</option>
                <option value="shapiro_wilk" className="text-white">Shapiro Wilk</option>
                <option value="shapiro_francia" className="text-white">Shapiro Francia</option>
                <option value="ryan_joiner" className="text-white">Ryan Joiner</option>
                <option value="lilliefors" className="text-white">Lilliefors</option>
                <option value="cramer_von_mises" className="text-white">Cramer Von Mises</option>
                <option value="anderson_darling" className="text-white">Anderson Darling</option>
                <option value="kolmogorov_smirnov" className="text-white">Kolmogorov Smirnov</option>
              </optgroup>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <Settings2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-start gap-1.5 mt-2">
            <Info className="w-4 h-4 shrink-0 text-blue-400" />
            Metode otomatis akan memilih uji terbaik berdasarkan jumlah sampel data Anda.
          </p>
        </div>

        {/* Alpha Selection */}
        <div className="space-y-3">
          <label className="text-sm text-gray-300 font-medium">Nilai Alpha (α)</label>
          <input 
            type="number" 
            step="0.01"
            min="0.01"
            max="0.99"
            defaultValue="0.05"
            className="glass-input"
          />
          <p className="text-xs text-gray-500 flex items-start gap-1.5 mt-2">
            Tingkat signifikansi (biasanya 0.05 atau 5%).
          </p>
        </div>
      </div>
    </div>
  );
}
