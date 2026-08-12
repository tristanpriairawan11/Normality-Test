"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { Loader2, AlertTriangle, Settings } from "lucide-react";

interface HistogramChartProps {
  data: number[];
}

interface HistogramData {
  bin_edges: number[];
  frequencies: number[];
  normal_curve_x: number[];
  normal_curve_y: number[];
}

export function HistogramChart({ data }: HistogramChartProps) {
  const [chartData, setChartData] = useState<HistogramData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNormalCurve, setShowNormalCurve] = useState(false);
  const [bins, setBins] = useState<number>(0); // 0 means default Sturges
  const [showChart, setShowChart] = useState(false);

  const fetchHistogram = async (binsCount?: number) => {
    if (data.length < 3) {
      setError("Minimal diperlukan 3 data untuk visualisasi.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch("http://localhost:8000/api/histogram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          bins: binsCount || null,
        }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Terjadi kesalahan saat mengambil data histogram.");
      }
      
      const resData = await res.json();
      setChartData(resData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset the chart visibility when data changes so it acts "like beginning"
    setShowChart(false);
  }, [data]);

  useEffect(() => {
    if (data && data.length > 0 && showChart) {
      fetchHistogram(bins > 0 ? bins : undefined);
    } else {
      setChartData(null);
    }
  }, [data, bins, showChart]); // automatically fetch when bins change

  // Prepare data for recharts
  let rechartsData: any[] = [];
  if (chartData) {
    // Recharts ComposedChart needs one unified data array if we want to combine bar and line easily,
    // but the x-axis points for normal curve (100 points) and bins (e.g. 10 bins) are different.
    // An alternative is to just map normal curve to the same bin centers for simplicity,
    // or use a separate series.
    // For a simple histogram, we just use bin centers.
    
    const { bin_edges, frequencies, normal_curve_x, normal_curve_y } = chartData;
    
    // Create bin data
    for (let i = 0; i < frequencies.length; i++) {
      const binCenter = (bin_edges[i] + bin_edges[i+1]) / 2;
      const binRange = `${bin_edges[i].toFixed(2)} - ${bin_edges[i+1].toFixed(2)}`;
      
      // Interpolate normal curve value for this bin center
      let normalValue = null;
      if (showNormalCurve) {
        // Find closest x in normal_curve_x
        let closestIdx = 0;
        let minDiff = Infinity;
        for (let j = 0; j < normal_curve_x.length; j++) {
          const diff = Math.abs(normal_curve_x[j] - binCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = j;
          }
        }
        normalValue = normal_curve_y[closestIdx];
      }
      
      rechartsData.push({
        name: binRange,
        center: parseFloat(binCenter.toFixed(2)),
        frequency: frequencies[i],
        normalValue: showNormalCurve ? parseFloat(normalValue!.toFixed(2)) : undefined,
      });
    }
  }

  return (
    <div className="glass-card mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="bg-primary-500/20 text-primary-400 p-2 rounded-lg mr-3">2</span>
          Visualisasi Data
        </h2>
        
        {!showChart ? (
          <button 
            onClick={() => setShowChart(true)}
            disabled={!data || data.length < 3}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tampilkan Visualisasi Histogram
          </button>
        ) : (
          <button 
            onClick={() => setShowChart(false)}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Sembunyikan
          </button>
        )}
      </div>

      {showChart && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            
            {/* Bins Controls */}
            <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg">
              <button
                onClick={() => setBins(0)}
                className={`text-sm px-3 py-1.5 rounded-md transition-all ${bins === 0 ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                Default (Sturges)
              </button>
              
              <div className="w-px h-6 bg-white/10 mx-1"></div>
              
              <div className="flex flex-col gap-1 min-w-[150px]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Custom Bins:</span>
                  <span className={bins > 0 ? "text-primary-400 font-medium" : "text-gray-500"}>
                    {bins > 0 ? bins : '-'}
                  </span>
                </div>
                <input 
                  type="range" 
                  className={`w-full cursor-pointer ${bins === 0 ? 'opacity-50' : 'accent-primary-500'}`} 
                  value={bins === 0 ? 10 : bins}
                  onChange={(e) => setBins(parseInt(e.target.value))}
                  min="1"
                  max="50"
                  step="1"
                />
              </div>
            </div>
            
            {/* Normal Curve Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-black/20 p-3 rounded-lg h-full">
              <input 
                type="checkbox" 
                checked={showNormalCurve}
                onChange={(e) => setShowNormalCurve(e.target.checked)}
                className="accent-primary-500 w-4 h-4"
              />
              <span className="text-sm text-gray-300 select-none">Kurva Normal</span>
            </label>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-4" />
              <p className="text-gray-400">Memuat visualisasi...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px] text-red-400 gap-2 bg-red-500/5 rounded-xl border border-red-500/10">
              <AlertTriangle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          ) : chartData ? (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={rechartsData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#a1a1aa" 
                    tick={{fill: '#a1a1aa', fontSize: 12}}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#a1a1aa" 
                    tick={{fill: '#a1a1aa', fontSize: 12}}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="frequency" name="Frekuensi" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  {showNormalCurve && (
                    <Line 
                      type="monotone" 
                      dataKey="normalValue" 
                      name="Kurva Normal"
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false} 
                      activeDot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
