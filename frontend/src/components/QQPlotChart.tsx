"use client";

import { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { Loader2, AlertTriangle } from "lucide-react";

interface QQPlotChartProps {
  data: number[];
}

interface QQPlotData {
  theoretical_quantiles: number[];
  sample_quantiles: number[];
  slope: number;
  intercept: number;
  r_value: number;
}

export function QQPlotChart({ data }: QQPlotChartProps) {
  const [chartData, setChartData] = useState<QQPlotData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQQPlot = async () => {
      if (!data || data.length < 3) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch("http://localhost:8000/api/qqplot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Terjadi kesalahan saat mengambil data QQ Plot.");
        }
        
        const resData = await res.json();
        setChartData(resData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQQPlot();
  }, [data]);

  if (!data || data.length === 0) return null;

  // Prepare data for recharts
  let rechartsData: any[] = [];
  let minX = 0, maxX = 0;
  
  if (chartData) {
    const { theoretical_quantiles, sample_quantiles, slope, intercept } = chartData;
    
    for (let i = 0; i < theoretical_quantiles.length; i++) {
      rechartsData.push({
        x: parseFloat(theoretical_quantiles[i].toFixed(4)),
        y: parseFloat(sample_quantiles[i].toFixed(4)),
        // The ideal line is y = slope * x + intercept
        idealY: parseFloat((slope * theoretical_quantiles[i] + intercept).toFixed(4)),
      });
    }
    
    if (theoretical_quantiles.length > 0) {
      minX = Math.min(...theoretical_quantiles);
      maxX = Math.max(...theoretical_quantiles);
    }
  }

  return (
    <div className="mt-6 border border-white/10 bg-black/20 rounded-xl p-6">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <span>📈</span>
        QQ Plot (Normal Probability Plot)
      </h3>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[250px]">
          <Loader2 className="w-6 h-6 text-primary-400 animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Memuat QQ Plot...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[250px] text-red-400 gap-2">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      ) : chartData ? (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={rechartsData}
              margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="x" 
                type="number" 
                name="Theoretical Quantiles"
                stroke="#a1a1aa" 
                tick={{fill: '#a1a1aa', fontSize: 12}}
                domain={['auto', 'auto']}
                label={{ value: 'Theoretical Quantiles', position: 'insideBottom', offset: -10, fill: '#a1a1aa', fontSize: 12 }}
              />
              <YAxis 
                dataKey="y" 
                type="number" 
                name="Sample Data"
                stroke="#a1a1aa" 
                tick={{fill: '#a1a1aa', fontSize: 12}}
                domain={['auto', 'auto']}
                label={{ value: 'Sample Quantiles', angle: -90, position: 'insideLeft', fill: '#a1a1aa', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{strokeDasharray: '3 3'}}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Scatter name="Data" dataKey="y" fill="#8b5cf6" />
              <Line 
                name="Normal Reference"
                dataKey="idealY"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="text-center mt-2 text-xs text-gray-400">
            R-value: {chartData.r_value.toFixed(4)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
