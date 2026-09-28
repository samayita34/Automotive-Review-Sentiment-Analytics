import React from 'react';
import { 
  CheckCircle2, 
  Smile, 
  Frown, 
  Meh, 
  Percent, 
  Clock, 
  Cpu, 
  Car, 
  Layers,
  Sparkles,
  Tag
} from 'lucide-react';

export default function AnalysisResultCard({ result }) {
  if (!result) return null;

  const overallSentiment = result.overall_sentiment || 'Neutral';
  const overallConf = Math.round((result.overall_confidence || 0) * 100);
  const aspects = result.aspects || [];
  const stats = result.stats || {};
  const sentimentDist = result.sentiment_distribution || {};

  const getSentimentTheme = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return {
          bg: 'bg-emerald-950/50',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          barColor: 'bg-emerald-500',
          icon: Smile
        };
      case 'Negative':
        return {
          bg: 'bg-rose-950/50',
          border: 'border-rose-500/40',
          text: 'text-rose-400',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          barColor: 'bg-rose-500',
          icon: Frown
        };
      default:
        return {
          bg: 'bg-amber-950/50',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          barColor: 'bg-amber-500',
          icon: Meh
        };
    }
  };

  const overallTheme = getSentimentTheme(overallSentiment);
  const OverallIcon = overallTheme.icon;

  return (
    <div className="glass-card p-5 mb-6 border-slate-700/80">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Analysis Results
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-normal">
                {result.vehicle_model || 'Automotive Feedback'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Aspect-level extraction & sentiment classification</p>
          </div>
        </div>

        {/* NLP Telemetry */}
        <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {stats.processing_time_ms || 12} ms
          </span>
          <span className="flex items-center">
            <Cpu className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {aspects.length} Aspects Detected
          </span>
        </div>
      </div>

      {/* Main Grid: Overall Banner & Aspect Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* 1. Overall Sentiment Highlight Card */}
        <div className={`p-4 rounded-xl border ${overallTheme.border} ${overallTheme.bg} flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Overall Sentiment</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium border border-slate-700 bg-carbon-900/60 text-slate-300">
                Confidence: {overallConf}%
              </span>
            </div>

            <div className="flex items-center space-x-3 my-2">
              <div className={`w-12 h-12 rounded-xl border ${overallTheme.border} bg-carbon-900/80 flex items-center justify-center`}>
                <OverallIcon className={`w-7 h-7 ${overallTheme.text}`} />
              </div>
              <div>
                <h4 className={`text-2xl font-black ${overallTheme.text}`}>
                  {overallSentiment}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {overallSentiment === 'Positive' ? 'Favorable Customer Impression' : overallSentiment === 'Negative' ? 'Customer Pain Points Detected' : 'Balanced / Mixed Impression'}
                </p>
              </div>
            </div>
          </div>

          {/* Probability Breakdown Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
              <span className="text-emerald-400">Pos: {Math.round((sentimentDist.Positive || 0) * 100)}%</span>
              <span className="text-amber-400">Neu: {Math.round((sentimentDist.Neutral || 0) * 100)}%</span>
              <span className="text-rose-400">Neg: {Math.round((sentimentDist.Negative || 0) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-carbon-900 rounded-full overflow-hidden flex">
              <div style={{ width: `${(sentimentDist.Positive || 0) * 100}%` }} className="bg-emerald-500 transition-all duration-500"></div>
              <div style={{ width: `${(sentimentDist.Neutral || 0) * 100}%` }} className="bg-amber-500 transition-all duration-500"></div>
              <div style={{ width: `${(sentimentDist.Negative || 0) * 100}%` }} className="bg-rose-500 transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {/* 2. Aspect-Level Sentiment Cards (Span 2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Detected Aspects & Context Sentiments ({aspects.length})
            </h4>
            <span className="text-[11px] text-slate-500">Aspect-Targeted Evaluation</span>
          </div>

          {aspects.length === 0 ? (
            <div className="p-4 rounded-xl bg-carbon-900/60 border border-slate-800 text-center text-xs text-slate-400">
              No specific aspect terms detected. Defaulting to general vehicle sentiment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aspects.map((asp, idx) => {
                const theme = getSentimentTheme(asp.sentiment);
                const AspIcon = theme.icon;
                const confPercent = Math.round((asp.confidence || 0) * 100);

                return (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-carbon-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <span className="text-sm font-bold text-white">{asp.aspect}</span>
                        {asp.raw_term && asp.raw_term.toLowerCase() !== asp.aspect.toLowerCase() && (
                          <span className="text-[10px] text-slate-400 font-mono">({asp.raw_term})</span>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1 border ${theme.badgeBg}`}>
                        <AspIcon className="w-3 h-3 mr-1" />
                        <span>{asp.sentiment}</span>
                      </span>
                    </div>

                    {/* Target Clause Context */}
                    <div className="text-xs text-slate-300 italic bg-carbon-950/60 p-2 rounded-lg border border-slate-800/80 line-clamp-2">
                      "{asp.context_clause}"
                    </div>

                    {/* Confidence Meter */}
                    <div className="pt-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1 font-mono">
                        <span>Confidence</span>
                        <span className="font-semibold text-slate-200">{confPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-carbon-950 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${confPercent}%` }} 
                          className={`h-full ${theme.barColor} transition-all duration-500`}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Academic Table View Summary */}
      <div className="mt-5 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Structured Output Summary
        </h4>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-xs">
            <thead className="bg-carbon-900/90 text-slate-400 font-medium">
              <tr>
                <th className="px-3 py-2 text-left">Aspect</th>
                <th className="px-3 py-2 text-left">Mentioned Entity</th>
                <th className="px-3 py-2 text-left">Sentiment</th>
                <th className="px-3 py-2 text-left">Confidence</th>
                <th className="px-3 py-2 text-left">Context Clause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-carbon-900/40 text-slate-300 font-mono">
              {aspects.map((asp, idx) => {
                const theme = getSentimentTheme(asp.sentiment);
                return (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="px-3 py-2 font-bold text-white font-sans">{asp.aspect}</td>
                    <td className="px-3 py-2 text-cyan-300">{asp.raw_term}</td>
                    <td className="px-3 py-2">
                      <span className={`font-semibold ${theme.text}`}>{asp.sentiment}</span>
                    </td>
                    <td className="px-3 py-2">{Math.round((asp.confidence || 0) * 100)}%</td>
                    <td className="px-3 py-2 font-sans italic text-slate-400 max-w-xs truncate">{asp.context_clause}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
