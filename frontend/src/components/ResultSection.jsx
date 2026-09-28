import React from 'react';

const OFFICIAL_CATEGORIES = [
  "VEHICLE", "ENGINE", "BATTERY", "MILEAGE", "SAFETY",
  "COMFORT", "SERVICE", "INFOTAINMENT", "PRICE"
];

export default function ResultSection({ result }) {
  if (!result) return null;

  const overallSentiment = (result.overall_sentiment || 'NEUTRAL').toUpperCase();
  const overallConf = Math.round((result.overall_confidence || 0) * 100);
  const aspects = result.aspects || [];

  const formatSentiment = (sentiment) => {
    const s = sentiment?.toUpperCase() || 'NEUTRAL';
    if (s === 'POSITIVE') return '+ POSITIVE';
    if (s === 'NEGATIVE') return '− NEGATIVE';
    return '• NEUTRAL';
  };

  return (
    <div className="mono-card p-6 mb-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-mono-700">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-mono-300">
            ANALYSIS RESULT
          </h3>
        </div>
        {result.processing_time_ms && (
          <div className="text-[11px] font-mono text-mono-400">
            Inference: {result.processing_time_ms} ms
          </div>
        )}
      </div>

      {/* 9-Aspect Taxonomy Minimal Horizontal List */}
      <div className="mb-6 pb-4 border-b border-mono-700">
        <div className="text-[10px] font-mono uppercase tracking-widest text-mono-400 mb-2">
          9-ASPECT TAXONOMY
        </div>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono">
          {OFFICIAL_CATEGORIES.map((cat, idx) => {
            const isDetected = aspects.some(
              a => (a.category || '').toUpperCase() === cat || a.aspect?.toUpperCase().includes(cat)
            );
            return (
              <React.Fragment key={cat}>
                <span className={isDetected ? "text-mono-white font-bold" : "text-mono-500"}>
                  {cat}
                </span>
                {idx < OFFICIAL_CATEGORIES.length - 1 && (
                  <span className="text-mono-700">·</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Overall Sentiment Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 mb-6 border-b border-mono-700">
        
        {/* Left: Overall Sentiment */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-mono-400 block mb-1">
            OVERALL SENTIMENT
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-mono-white tracking-tight">
            {overallSentiment}
          </div>
        </div>

        {/* Right: Confidence Metric */}
        <div className="md:text-right">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mono-400 block mb-1">
            CONFIDENCE
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-mono-white tracking-tight">
            {overallConf}%
          </div>
        </div>

      </div>

      {/* Detected Aspects Minimal Rows */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-mono-300">
            DETECTED ASPECTS ({aspects.length})
          </span>
        </div>

        {aspects.length === 0 ? (
          <div className="py-6 text-center text-xs font-mono text-mono-400 border border-mono-700 rounded bg-mono-950">
            No specific automotive aspect detected. General sentiment classified.
          </div>
        ) : (
          <div className="border-t border-mono-700 divide-y divide-mono-700">
            {aspects.map((asp, idx) => {
              const category = (asp.category || 'VEHICLE').toUpperCase();
              const term = asp.aspect;
              const sentimentText = formatSentiment(asp.sentiment);
              const conf = Math.round((asp.confidence || 0) * 100);

              return (
                <div 
                  key={idx} 
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-mono-900/50 transition-colors px-1"
                >
                  {/* Category & Extracted Term */}
                  <div>
                    <span className="text-[10px] font-mono font-bold text-mono-400 uppercase tracking-wider block">
                      {category}
                    </span>
                    <span className="text-sm font-semibold text-mono-white capitalize">
                      {term}
                    </span>
                  </div>

                  {/* Sentiment & Confidence */}
                  <div className="flex items-center space-x-6 self-start sm:self-center font-mono text-xs">
                    <span className="font-bold text-mono-white">
                      {sentimentText}
                    </span>
                    <span className="text-mono-400 w-12 text-right">
                      {conf}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Structured Output Minimal Table */}
      {aspects.length > 0 && (
        <div className="pt-4 border-t border-mono-700">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mono-400 block mb-3">
            STRUCTURED OUTPUT
          </span>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-mono-700 text-mono-400 text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 pr-4">CATEGORY</th>
                  <th className="py-2.5 pr-4">ASPECT</th>
                  <th className="py-2.5 pr-4">SENTIMENT</th>
                  <th className="py-2.5 pr-4">CONFIDENCE</th>
                  <th className="py-2.5">CONTEXT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mono-700/60 text-mono-200">
                {aspects.map((asp, idx) => (
                  <tr key={idx} className="hover:bg-mono-900/40">
                    <td className="py-3 pr-4 font-bold text-mono-white">{asp.category || 'VEHICLE'}</td>
                    <td className="py-3 pr-4 text-mono-300 capitalize">{asp.aspect}</td>
                    <td className="py-3 pr-4 font-semibold text-mono-white">{formatSentiment(asp.sentiment)}</td>
                    <td className="py-3 pr-4 text-mono-300">{Math.round((asp.confidence || 0) * 100)}%</td>
                    <td className="py-3 text-mono-400 italic max-w-xs truncate">
                      "{asp.context_clause || result.original_text}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
