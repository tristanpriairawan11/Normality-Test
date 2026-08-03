"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";

type InputMethod = "upload" | "manual";

export function DataInput() {
  const [method, setMethod] = useState<InputMethod>("upload");
  const [manualData, setManualData] = useState("");
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="glass-card mb-8">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <span className="bg-primary-500/20 text-primary-400 p-2 rounded-lg mr-3">1</span>
        Masukkan Data
      </h2>

      {/* Tabs */}
      <div className="flex space-x-2 bg-black/20 p-1 rounded-xl mb-6">
        <button
          onClick={() => setMethod("upload")}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
            method === "upload" 
              ? "bg-white/10 text-white shadow-sm border border-white/5" 
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          }`}
        >
          <UploadCloud className="w-5 h-5" />
          Upload CSV / Excel
        </button>
        <button
          onClick={() => setMethod("manual")}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
            method === "manual" 
              ? "bg-white/10 text-white shadow-sm border border-white/5" 
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          }`}
        >
          <FileText className="w-5 h-5" />
          Input Manual
        </button>
      </div>

      {/* Upload Section */}
      {method === "upload" && (
        <div className="border-2 border-dashed border-white/10 hover:border-primary-500/50 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all bg-black/10 group cursor-pointer relative">
          <input 
            type="file" 
            accept=".csv, .xls, .xlsx"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file ? (
            <>
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-white font-medium text-lg mb-1">{file.name}</p>
              <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-white/5 text-gray-400 group-hover:text-primary-400 rounded-full flex items-center justify-center mb-4 transition-colors">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-gray-300 font-medium mb-2">Pilih file atau tarik ke sini</p>
              <p className="text-gray-500 text-sm">Mendukung file CSV, XLS, XLSX</p>
            </>
          )}
        </div>
      )}

      {/* Manual Section */}
      {method === "manual" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-end mb-2">
            <label className="text-sm text-gray-300 font-medium">Data (pisahkan dengan koma, spasi, atau baris baru)</label>
            <span className="text-xs text-gray-500">Contoh: 12, 15, 18, 17, 22</span>
          </div>
          <textarea
            value={manualData}
            onChange={(e) => setManualData(e.target.value)}
            className="glass-input min-h-[150px] resize-y font-mono text-lg"
            placeholder="Ketik atau paste data numerik di sini..."
          />
        </div>
      )}
    </div>
  );
}
