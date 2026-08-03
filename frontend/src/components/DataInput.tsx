"use client";

import { useState, useEffect, useCallback } from "react";
import { UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type InputMethod = "upload" | "manual";

interface DataInputProps {
  onDataReady: (data: number[]) => void;
}

export function DataInput({ onDataReady }: DataInputProps) {
  const [method, setMethod] = useState<InputMethod>("upload");
  const [manualData, setManualData] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  // Parse manual data whenever it changes
  useEffect(() => {
    if (method === "manual") {
      const parsed = manualData
        .split(/[\s,;]+/)
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n));
      onDataReady(parsed);
    }
  }, [manualData, method, onDataReady]);

  // Handle file upload
  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setUploadError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Gagal mengunggah file");
      }

      const data = await res.json();
      setUploadResult(data);
      
      if (data.numeric_columns && data.numeric_columns.length > 0) {
        const firstCol = data.numeric_columns[0];
        setSelectedColumn(firstCol);
        onDataReady(data.column_data[firstCol].filter((x: any) => x !== null));
      } else {
        setUploadError("Tidak ditemukan kolom numerik pada file.");
      }
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleColumnSelect = (col: string) => {
    setSelectedColumn(col);
    if (uploadResult && uploadResult.column_data[col]) {
      onDataReady(uploadResult.column_data[col].filter((x: any) => x !== null));
    }
  };

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
        <div className="space-y-4">
          <div className="border-2 border-dashed border-white/10 hover:border-primary-500/50 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all bg-black/10 group cursor-pointer relative overflow-hidden">
            <input 
              type="file" 
              accept=".csv, .xls, .xlsx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-primary-400 animate-spin mb-4" />
                <p className="text-gray-300 font-medium">Memproses file...</p>
              </>
            ) : file && !uploadError ? (
              <>
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-white font-medium text-lg mb-1">{file.name}</p>
                <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${uploadError ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-400 group-hover:text-primary-400'}`}>
                  {uploadError ? <AlertCircle className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
                </div>
                {uploadError ? (
                  <p className="text-red-400 font-medium mb-2">{uploadError}</p>
                ) : (
                  <>
                    <p className="text-gray-300 font-medium mb-2">Pilih file atau tarik ke sini</p>
                    <p className="text-gray-500 text-sm">Mendukung file CSV, XLS, XLSX</p>
                  </>
                )}
              </>
            )}
          </div>

          {/* Column Selection if file is uploaded */}
          {uploadResult && uploadResult.numeric_columns && uploadResult.numeric_columns.length > 0 && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-4">
              <label className="text-sm text-gray-300 font-medium mb-2 block">Pilih Kolom Data yang Diuji:</label>
              <select 
                value={selectedColumn} 
                onChange={(e) => handleColumnSelect(e.target.value)}
                className="glass-input appearance-none w-full cursor-pointer"
              >
                {uploadResult.numeric_columns.map((col: string) => (
                  <option key={col} value={col} className="bg-gray-900">{col}</option>
                ))}
              </select>
              
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">Preview Baris Pertama:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-black/40">
                      <tr>
                        {uploadResult.numeric_columns.map((col: string) => (
                          <th key={col} className="px-4 py-2 border-b border-white/5">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {uploadResult.preview.map((row: any, idx: number) => (
                        <tr key={idx} className="border-b border-white/5 last:border-0">
                          {uploadResult.numeric_columns.map((col: string) => (
                            <td key={col} className={`px-4 py-2 ${col === selectedColumn ? 'bg-primary-500/10 font-medium text-white' : ''}`}>
                              {row[col] !== undefined && row[col] !== null ? row[col].toString() : '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
