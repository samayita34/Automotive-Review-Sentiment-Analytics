import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

const ALL_ASPECTS = [
  "Vehicle", "Engine", "Battery", "Mileage", "Safety",
  "Comfort", "Service", "Infotainment", "Price"
];

export default function AspectBreakdownChart({ stats }) {
  if (!stats) return null;

  const aspectDist = stats.aspect_sentiment_distribution || {};

  const chartData = ALL_ASPECTS.map((aspect) => {
    const counts = aspectDist[aspect] || { Positive: 0, Neutral: 0, Negative: 0, total: 0 };
    return {
      aspect,
      Positive: counts.Positive || 0,
      Neutral: counts.Neutral || 0,
      Negative: counts.Negative || 0,
      total: (counts.Positive || 0) + (counts.Neutral || 0) + (counts.Negative || 0)
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pos = payload.find(p => p.dataKey === 'Positive')?.value || 0;
      const neu = payload.find(p => p.dataKey === 'Neutral')?.value || 0;
      const neg = payload.find(p => p.dataKey === 'Negative')?.value || 0;
      const total = pos + neu + neg;
      const posRate = total > 0 ? ((pos / total) * 100).toFixed(1) : 0;

      return (
        <div className="bg-carbon-800 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-bold text-white text-sm border-b border-slate-700 pb-1">{label} Aspect</p>
          <div className="text-slate-300 font-mono space-y-0.5">
            <p className="text-emerald-400">Positive: {pos} ({total > 0 ? ((pos/total)*100).toFixed(0) : 0}%)</p>
            <p className="text-amber-400">Neutral: {neu} ({total > 0 ? ((neu/total)*100).toFixed(0) : 0}%)</p>
            <p className="text-rose-400">Negative: {neg} ({total > 0 ? ((neg/total)*100).toFixed(0) : 0}%)</p>
            <p className="text-slate-400 border-t border-slate-700/60 pt-1">Total Mentions: {total}</p>
            <p className="text-cyan-300">Positivity Index: {posRate}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Aspect-Wise Sentiment Distribution</h3>
            <p className="text-[11px] text-slate-400">Distribution across 9 automotive aspects</p>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex items-center space-x-3 text-xs font-medium">
          <span className="flex items-center text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span> Positive
          </span>
          <span className="flex items-center text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span> Neutral
          </span>
          <span className="flex items-center text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5"></span> Negative
          </span>
        </div>
      </div>

      {/* Recharts Stacked Bar Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="aspect" 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              axisLine={{ stroke: '#334155' }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              axisLine={{ stroke: '#334155' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Positive" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Neutral" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Negative" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Positive vs Top Negative Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800">
        
        {/* Most Positive */}
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Highest Customer Satisfaction</span>
          </div>
          <div className="space-y-1 text-xs">
            {stats.most_positive_aspects?.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-300">
                <span className="font-medium text-white">{idx + 1}. {item.aspect}</span>
                <span className="text-emerald-400 font-mono font-semibold">{item.positive_rate}% Pos ({item.positive_count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Negative */}
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400 mb-1.5">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Major Customer Complaints</span>
          </div>
          <div className="space-y-1 text-xs">
            {stats.most_negative_aspects?.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-300">
                <span className="font-medium text-white">{idx + 1}. {item.aspect}</span>
                <span className="text-rose-400 font-mono font-semibold">{item.negative_rate}% Neg ({item.negative_count})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
