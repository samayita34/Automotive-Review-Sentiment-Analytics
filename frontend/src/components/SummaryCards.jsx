import React from 'react';

export default function SummaryCards({ history = [] }) {
  const total = history.length;
  const positiveCount = history.filter(r => r.overall_sentiment?.toLowerCase() === 'positive').length;
  const negativeCount = history.filter(r => r.overall_sentiment?.toLowerCase() === 'negative').length;
  const neutralCount = history.filter(r => r.overall_sentiment?.toLowerCase() === 'neutral').length;

  const posPct = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((negativeCount / total) * 100) : 0;
  const neuPct = total > 0 ? Math.round((neutralCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      
      {/* 1. Total Reviews */}
      <div className="mono-card p-4 flex flex-col justify-between">
        <span className="text-[11px] font-mono text-mono-400 uppercase tracking-widest">
          TOTAL REVIEWS
        </span>
        <div className="mt-3">
          <span className="text-3xl font-extrabold text-mono-white font-mono tracking-tight">
            {total}
          </span>
        </div>
      </div>

      {/* 2. Positive */}
      <div className="mono-card p-4 flex flex-col justify-between">
        <span className="text-[11px] font-mono text-mono-400 uppercase tracking-widest">
          + POSITIVE
        </span>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-mono-white font-mono tracking-tight">
            {positiveCount}
          </span>
          <span className="text-xs font-mono text-mono-300">
            {posPct}%
          </span>
        </div>
      </div>

      {/* 3. Negative */}
      <div className="mono-card p-4 flex flex-col justify-between">
        <span className="text-[11px] font-mono text-mono-400 uppercase tracking-widest">
          − NEGATIVE
        </span>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-mono-white font-mono tracking-tight">
            {negativeCount}
          </span>
          <span className="text-xs font-mono text-mono-300">
            {negPct}%
          </span>
        </div>
      </div>

      {/* 4. Neutral */}
      <div className="mono-card p-4 flex flex-col justify-between">
        <span className="text-[11px] font-mono text-mono-400 uppercase tracking-widest">
          • NEUTRAL
        </span>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-mono-white font-mono tracking-tight">
            {neutralCount}
          </span>
          <span className="text-xs font-mono text-mono-300">
            {neuPct}%
          </span>
        </div>
      </div>

    </div>
  );
}
