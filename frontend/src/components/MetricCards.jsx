import React from 'react';
import { 
  FileText, 
  Smile, 
  Frown, 
  Meh, 
  TrendingUp, 
  TrendingDown, 
  Layers
} from 'lucide-react';

export default function MetricCards({ stats }) {
  if (!stats) return null;

  const totalReviews = stats.total_reviews || 0;
  const posCount = stats.positive_count || 0;
  const negCount = stats.negative_count || 0;
  const neuCount = stats.neutral_count || 0;

  const posPct = stats.positive_percentage || 0;
  const negPct = stats.negative_percentage || 0;
  const neuPct = stats.neutral_percentage || 0;

  const mostPositive = stats.most_positive_aspects?.[0];
  const mostNegative = stats.most_negative_aspects?.[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Reviews Card */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Reviews Analyzed</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white font-mono">{totalReviews}</span>
          <span className="text-xs text-slate-400">Processed</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-400">
          <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
          <span>{stats.total_aspect_mentions || 0} Aspect Mentions Extracted</span>
        </div>
      </div>

      {/* 2. Positive Reviews Card */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Positive Reviews</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Smile className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{posCount}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            {posPct}%
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate">Top: <strong className="text-emerald-300">{mostPositive?.aspect || 'Battery'}</strong></span>
          {mostPositive && <span className="text-emerald-400 font-mono">{mostPositive.positive_rate}% Pos</span>}
        </div>
      </div>

      {/* 3. Negative Reviews Card */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-rose-400 uppercase tracking-wider">Negative Reviews</span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Frown className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-rose-400 font-mono">{negCount}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/40">
            {negPct}%
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate">Pain Point: <strong className="text-rose-300">{mostNegative?.aspect || 'Service'}</strong></span>
          {mostNegative && <span className="text-rose-400 font-mono">{mostNegative.negative_rate}% Neg</span>}
        </div>
      </div>

      {/* 4. Neutral Reviews Card */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Neutral / Mixed</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Meh className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-amber-400 font-mono">{neuCount}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
            {neuPct}%
          </span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-400">
          <span>Multi-aspect contrastive feedback</span>
        </div>
      </div>

    </div>
  );
}
