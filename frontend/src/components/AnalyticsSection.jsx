import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const MONO_CHART_COLORS = {
  positive: '#FFFFFF',  // White
  neutral: '#737373',   // Mid Gray
  negative: '#262626'   // Dark Gray (outlined with #404040)
};

const ALL_ASPECTS = [
  "Vehicle", "Engine", "Battery", "Mileage", "Safety",
  "Comfort", "Service", "Infotainment", "Price"
];

export default function AnalyticsSection({ history = [] }) {
  const total = history.length;
  const positiveCount = history.filter(r => r.overall_sentiment?.toLowerCase() === 'positive').length;
  const negativeCount = history.filter(r => r.overall_sentiment?.toLowerCase() === 'negative').length;
  const neutralCount = history.filter(r => r.overall_sentiment?.toLowerCase() === 'neutral').length;

  // Pie chart data
  const pieData = [
    { name: 'Positive', value: positiveCount, color: MONO_CHART_COLORS.positive },
    { name: 'Neutral', value: neutralCount, color: MONO_CHART_COLORS.neutral },
    { name: 'Negative', value: negativeCount, color: MONO_CHART_COLORS.negative }
  ].filter(d => d.value > 0);

  // Aspect distribution data
  const aspectDistribution = {};
  ALL_ASPECTS.forEach(asp => {
    aspectDistribution[asp] = { Positive: 0, Neutral: 0, Negative: 0, total: 0 };
  });

  history.forEach(record => {
    (record.aspects || []).forEach(asp => {
      const category = asp.category || (
        ALL_ASPECTS.find(a => a.toLowerCase() === asp.aspect?.toLowerCase()) || 'Vehicle'
      );
      const sent = asp.sentiment?.toLowerCase();
      if (aspectDistribution[category]) {
        if (sent === 'positive') aspectDistribution[category].Positive += 1;
        else if (sent === 'negative') aspectDistribution[category].Negative += 1;
        else aspectDistribution[category].Neutral += 1;
        aspectDistribution[category].total += 1;
      }
    });
  });

  const barData = ALL_ASPECTS.map(aspectName => ({
    aspect: aspectName.toUpperCase(),
    Positive: aspectDistribution[aspectName].Positive,
    Neutral: aspectDistribution[aspectName].Neutral,
    Negative: aspectDistribution[aspectName].Negative,
    total: aspectDistribution[aspectName].total
  }));

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0];
      const pct = total > 0 ? ((p.value / total) * 100).toFixed(0) : 0;
      return (
        <div className="bg-mono-950 border border-mono-700 p-2 text-[11px] font-mono rounded text-mono-white shadow-md">
          <p className="font-bold">{p.name}: {p.value} ({pct}%)</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pos = payload.find(p => p.dataKey === 'Positive')?.value || 0;
      const neu = payload.find(p => p.dataKey === 'Neutral')?.value || 0;
      const neg = payload.find(p => p.dataKey === 'Negative')?.value || 0;
      const tot = pos + neu + neg;

      return (
        <div className="bg-mono-950 border border-mono-700 p-2.5 text-xs font-mono rounded text-mono-white shadow-md space-y-0.5">
          <p className="font-bold border-b border-mono-700 pb-1">{label}</p>
          <p>+ Positive: {pos}</p>
          <p>• Neutral: {neu}</p>
          <p>− Negative: {neg}</p>
          <p className="text-mono-400 border-t border-mono-700/60 pt-0.5">Total: {tot}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      
      {/* 1. Overall Sentiment Distribution Donut Chart (5 cols) */}
      <div className="lg:col-span-5 mono-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-mono-300">
              SENTIMENT DISTRIBUTION
            </span>
            <span className="text-xs font-mono text-mono-400">
              N={total}
            </span>
          </div>

          {total === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs font-mono text-mono-500">
              No reviews analyzed yet.
            </div>
          ) : (
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="#000000" 
                        strokeWidth={2} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-mono-white font-mono">{total}</span>
                <span className="text-[9px] uppercase tracking-widest text-mono-400 font-mono">REVIEWS</span>
              </div>
            </div>
          )}
        </div>

        {/* Monochrome Legend */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-mono-700 text-center text-xs font-mono">
          <div className="border border-mono-700 p-2 rounded bg-mono-950">
            <span className="text-[10px] text-mono-400 block">+ POSITIVE</span>
            <span className="text-sm font-bold text-mono-white">{positiveCount}</span>
          </div>
          <div className="border border-mono-700 p-2 rounded bg-mono-950">
            <span className="text-[10px] text-mono-400 block">• NEUTRAL</span>
            <span className="text-sm font-bold text-mono-white">{neutralCount}</span>
          </div>
          <div className="border border-mono-700 p-2 rounded bg-mono-950">
            <span className="text-[10px] text-mono-400 block">− NEGATIVE</span>
            <span className="text-sm font-bold text-mono-white">{negativeCount}</span>
          </div>
        </div>

      </div>

      {/* 2. Aspect-Wise Sentiment Stacked Bar Chart (7 cols) */}
      <div className="lg:col-span-7 mono-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-mono-300">
              ASPECT-WISE DISTRIBUTION
            </span>

            <div className="flex items-center space-x-3 text-[11px] font-mono text-mono-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-mono-white mr-1.5"></span> + Pos
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-mono-400 mr-1.5"></span> • Neu
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-mono-700 border border-mono-600 mr-1.5"></span> − Neg
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -25, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="#171717" vertical={false} />
                <XAxis 
                  dataKey="aspect" 
                  tick={{ fill: '#737373', fontSize: 9, fontFamily: 'monospace' }} 
                  axisLine={{ stroke: '#262626' }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fill: '#737373', fontSize: 10, fontFamily: 'monospace' }} 
                  axisLine={{ stroke: '#262626' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="Positive" stackId="a" fill="#FFFFFF" />
                <Bar dataKey="Neutral" stackId="a" fill="#737373" />
                <Bar dataKey="Negative" stackId="a" fill="#262626" stroke="#404040" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-3 border-t border-mono-700 text-[10px] font-mono text-mono-400 flex items-center justify-between">
          <span>9 VEHICLE DIMENSIONS</span>
          <span>STACKED TOTALS</span>
        </div>

      </div>

    </div>
  );
}
