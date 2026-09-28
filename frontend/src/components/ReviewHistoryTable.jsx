import React from 'react';
import { 
  History, 
  Trash2, 
  Car, 
  Smile, 
  Frown, 
  Meh, 
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ReviewHistoryTable({ history, onSelectReview, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-card p-8 text-center text-slate-400">
        <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-xs">No analysis history recorded yet.</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Analyzed customer reviews will appear here automatically.</p>
      </div>
    );
  }

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Negative':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="glass-card p-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <History className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Recent Analyzed Reviews ({history.length})</h3>
            <p className="text-[11px] text-slate-400">Chronological history of evaluated automotive feedback</p>
          </div>
        </div>

        {onClearHistory && (
          <button
            onClick={onClearHistory}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Review List */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {history.map((record) => {
          const overallSentiment = record.overall_sentiment || 'Neutral';
          const conf = Math.round((record.overall_confidence || 0) * 100);
          const aspects = record.aspects || [];

          return (
            <div
              key={record.id}
              className="p-3.5 rounded-xl bg-carbon-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-bold text-white">
                    {record.vehicle_model || 'Automotive Review'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {record.timestamp || 'Just now'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    {conf}% Conf
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getSentimentBadge(overallSentiment)}`}>
                    {overallSentiment}
                  </span>
                </div>
              </div>

              {/* Text Snippet */}
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{record.original_text}"
              </p>

              {/* Extracted Aspect Badges & Inspect action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center">
                    <Layers className="w-3 h-3 mr-1 text-slate-500" />
                    Aspects:
                  </span>
                  {aspects.map((asp, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono border ${getSentimentBadge(asp.sentiment)}`}
                    >
                      {asp.aspect}: {asp.sentiment}
                    </span>
                  ))}
                </div>

                {onSelectReview && (
                  <button
                    onClick={() => onSelectReview(record)}
                    className="text-[11px] text-blue-400 hover:text-cyan-300 font-semibold flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span>View Result</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
