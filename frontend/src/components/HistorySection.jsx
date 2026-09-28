import React from 'react';

export default function HistorySection({ history, onSelectReview, onClearHistory }) {
  if (!history || history.length === 0) return null;

  const formatSentiment = (sentiment) => {
    const s = sentiment?.toUpperCase() || 'NEUTRAL';
    if (s === 'POSITIVE') return '+ POSITIVE';
    if (s === 'NEGATIVE') return '− NEGATIVE';
    return '• NEUTRAL';
  };

  return (
    <div className="mono-card p-6 mb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-mono-700">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-mono-300">
            RECENT ANALYZED REVIEWS
          </h3>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs font-mono text-mono-400 hover:text-mono-white underline transition-colors"
        >
          Clear History
        </button>
      </div>

      {/* Numbered Minimal List */}
      <div className="divide-y divide-mono-700 max-h-[480px] overflow-y-auto pr-1">
        {history.map((item, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const conf = Math.round((item.overall_confidence || 0) * 100);
          const sentimentText = formatSentiment(item.overall_sentiment);

          return (
            <div
              key={idx}
              className="py-4 hover:bg-mono-900/40 transition-colors px-1 group cursor-pointer"
              onClick={() => onSelectReview && onSelectReview(item)}
            >
              <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                <div className="flex items-center space-x-3">
                  <span className="text-mono-500 font-bold">{num}</span>
                  <span className="font-bold text-mono-white">{sentimentText}</span>
                  <span className="text-mono-500">·</span>
                  <span className="text-mono-400">{conf}%</span>
                </div>

                <span className="text-[11px] text-mono-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Inspect →
                </span>
              </div>

              <p className="text-xs text-mono-300 italic leading-relaxed pl-7">
                "{item.original_text}"
              </p>

              {item.aspects && item.aspects.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-mono-400 pl-7 mt-2">
                  {item.aspects.map((asp, aIdx) => (
                    <span key={aIdx}>
                      <strong className="text-mono-200">{asp.category || 'ASPECT'}:</strong> {asp.aspect} ({formatSentiment(asp.sentiment)})
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
