import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { PieChart as PieIcon, Activity } from 'lucide-react';

const COLORS = {
  Positive: '#10b981', // emerald-500
  Neutral: '#f59e0b',  // amber-500
  Negative: '#f43f5e'  // rose-500
};

export default function SentimentDistributionChart({ stats }) {
  if (!stats) return null;

  const data = [
    { name: 'Positive', value: stats.positive_count || 0, color: COLORS.Positive },
    { name: 'Neutral', value: stats.neutral_count || 0, color: COLORS.Neutral },
    { name: 'Negative', value: stats.negative_count || 0, color: COLORS.Negative }
  ].filter(d => d.value > 0);

  const total = stats.total_reviews || 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0];
      const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-carbon-800 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-white flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.payload.color }}></span>
            <span>{p.name}</span>
          </p>
          <p className="text-slate-300 font-mono mt-1">
            Count: <strong className="text-white">{p.value}</strong> ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <PieIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Overall Sentiment Distribution</h3>
              <p className="text-[11px] text-slate-400">Proportion across all analyzed reviews</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold bg-carbon-900 px-2 py-1 rounded border border-slate-800">
            N={total}
          </span>
        </div>

        {total === 0 ? (
          <div className="h-56 flex items-center justify-center text-xs text-slate-500">
            No review data available yet.
          </div>
        ) : (
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-white font-mono">{total}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Reviews</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Percentages */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-xs font-mono">
        <div className="bg-emerald-950/40 border border-emerald-900/50 p-2 rounded-lg">
          <span className="text-[10px] text-emerald-400 uppercase font-sans font-semibold block">Pos</span>
          <span className="text-sm font-bold text-emerald-300">{stats.positive_percentage || 0}%</span>
        </div>
        <div className="bg-amber-950/40 border border-amber-900/50 p-2 rounded-lg">
          <span className="text-[10px] text-amber-400 uppercase font-sans font-semibold block">Neu</span>
          <span className="text-sm font-bold text-amber-300">{stats.neutral_percentage || 0}%</span>
        </div>
        <div className="bg-rose-950/40 border border-rose-900/50 p-2 rounded-lg">
          <span className="text-[10px] text-rose-400 uppercase font-sans font-semibold block">Neg</span>
          <span className="text-sm font-bold text-rose-300">{stats.negative_percentage || 0}%</span>
        </div>
      </div>

    </div>
  );
}
