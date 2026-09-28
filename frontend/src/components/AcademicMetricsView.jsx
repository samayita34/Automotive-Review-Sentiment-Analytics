import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  FileCode2, 
  TrendingUp, 
  Target, 
  BarChart, 
  ShieldCheck,
  AlertTriangle,
  Download
} from 'lucide-react';
import { fetchModelMetrics, triggerEvaluation } from '../services/api';

export default function AcademicMetricsView() {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchModelMetrics();
      setMetricsData(data);
    } catch (err) {
      setError(err.message || 'Failed to load evaluation metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleRunEvaluation = async (split = 'test') => {
    try {
      setEvaluating(true);
      const res = await triggerEvaluation(split);
      setMetricsData(res.results);
    } catch (err) {
      alert('Evaluation failed: ' + err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleDownloadJSON = () => {
    if (!metricsData) return;
    const blob = new Blob([JSON.stringify(metricsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'automotive_absa_evaluation_report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-300">Computing Authentic Academic Evaluation Metrics on Test Benchmark...</p>
        <p className="text-xs text-slate-500 mt-1">Executing RoBERTa Transformer & Aspect-Extraction Pipeline</p>
      </div>
    );
  }

  if (error || !metricsData) {
    return (
      <div className="glass-card p-8 text-center border-rose-800/50 bg-rose-950/20">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-rose-300">Unable to load evaluation metrics</p>
        <p className="text-xs text-slate-400 mt-1">{error}</p>
        <button
          onClick={loadMetrics}
          className="mt-4 px-4 py-1.5 bg-carbon-800 border border-slate-700 text-xs text-white rounded-lg hover:bg-carbon-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const metrics = metricsData.metrics || {};
  const cm = metricsData.confusion_matrix || { labels: ['Positive', 'Neutral', 'Negative'], matrix: [[0,0,0],[0,0,0],[0,0,0]] };
  const perClass = metricsData.per_class_metrics || {};
  const aspectPerf = metricsData.aspect_performance || {};

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card p-5 border-blue-500/30 bg-gradient-to-r from-slate-900 via-carbon-800 to-indigo-950/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ACADEMIC BENCHMARK EVALUATION
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Split: <strong>{metricsData.evaluation_split || 'test'}</strong> (N={metricsData.total_test_samples || 0})
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5">
              Model Performance & Confusion Matrix
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Ground-truth academic evaluation verifying the Transformer-based ABSA pipeline against verified automotive customer reviews. All metrics are computed dynamically using scikit-learn.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-2 bg-carbon-800 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-200 rounded-lg flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => handleRunEvaluation('test')}
              disabled={evaluating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-lg shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${evaluating ? 'animate-spin' : ''}`} />
              <span>{evaluating ? 'Running...' : 'Re-Evaluate Test Split'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core ML Evaluation Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Accuracy */}
        <div className="glass-card p-4 border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Accuracy</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {((metrics.accuracy || 0) * 100).toFixed(2)}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Overall classification accuracy</p>
        </div>

        {/* F1-Score (Macro) */}
        <div className="glass-card p-4 border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">F1-Score (Macro)</span>
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-mono">
            {((metrics.f1_macro || 0) * 100).toFixed(2)}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Weighted F1: {((metrics.f1_weighted || 0) * 100).toFixed(2)}%</p>
        </div>

        {/* Precision (Macro) */}
        <div className="glass-card p-4 border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Precision (Macro)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
            {((metrics.precision_macro || 0) * 100).toFixed(2)}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Weighted Prec: {((metrics.precision_weighted || 0) * 100).toFixed(2)}%</p>
        </div>

        {/* Recall (Macro) */}
        <div className="glass-card p-4 border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Recall (Macro)</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            {((metrics.recall_macro || 0) * 100).toFixed(2)}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Weighted Rec: {((metrics.recall_weighted || 0) * 100).toFixed(2)}%</p>
        </div>

      </div>

      {/* Grid: Confusion Matrix & Per-Class Classification Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Confusion Matrix (7 cols) */}
        <div className="lg:col-span-7 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-400" />
                3x3 Confusion Matrix (Sentiment Classes)
              </h3>
              <p className="text-xs text-slate-400">Rows: Actual Ground Truth | Columns: Model Prediction</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-carbon-900 border border-slate-700 text-slate-300">
              Classes: Positive, Neutral, Negative
            </span>
          </div>

          {/* Matrix Heatmap Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-xs font-semibold text-slate-500 text-left">Actual \ Predicted</th>
                  {cm.labels?.map((label) => (
                    <th key={label} className="p-2 text-xs font-bold text-slate-300 bg-carbon-900/80 border border-slate-800">
                      Pred {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cm.labels?.map((trueLabel, rowIdx) => (
                  <tr key={trueLabel}>
                    <td className="p-2 text-xs font-bold text-slate-300 bg-carbon-900/80 border border-slate-800 text-left">
                      Actual {trueLabel}
                    </td>
                    {cm.matrix?.[rowIdx]?.map((count, colIdx) => {
                      const isDiagonal = rowIdx === colIdx;
                      const normVal = cm.matrix_normalized?.[rowIdx]?.[colIdx] || 0;
                      
                      // Color intensity based on correctness
                      let cellStyle = 'bg-carbon-900/40 text-slate-400';
                      if (isDiagonal) {
                        cellStyle = count > 0 ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-carbon-900/60 text-slate-500';
                      } else if (count > 0) {
                        cellStyle = 'bg-rose-950/40 border-rose-800/40 text-rose-300 font-medium';
                      }

                      return (
                        <td 
                          key={colIdx} 
                          className={`p-3 border border-slate-800 transition-all font-mono ${cellStyle}`}
                        >
                          <div className="text-base sm:text-lg">{count}</div>
                          <div className="text-[10px] opacity-70">({(normVal * 100).toFixed(0)}%)</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800">
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/50 border border-emerald-400 mr-1.5"></span>
              Diagonal = True Positives
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/50 border border-rose-400 mr-1.5"></span>
              Off-Diagonal = Misclassifications
            </span>
          </div>
        </div>

        {/* Per-Class Classification Report (5 cols) */}
        <div className="lg:col-span-5 glass-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Per-Class Classification Report
            </h3>
            <p className="text-xs text-slate-400 mb-4">Granular precision, recall and F1 by sentiment class</p>

            <div className="space-y-3">
              {Object.entries(perClass).map(([className, report]) => {
                const f1Pct = Math.round((report.f1_score || 0) * 100);
                const precPct = Math.round((report.precision || 0) * 100);
                const recPct = Math.round((report.recall || 0) * 100);

                return (
                  <div key={className} className="p-3 rounded-xl bg-carbon-900/80 border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{className} Class</span>
                      <span className="text-[10px] text-slate-400 font-mono">Support: {report.support}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="bg-carbon-950 p-1.5 rounded border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-sans block">Prec</span>
                        <span className="font-semibold text-cyan-300">{precPct}%</span>
                      </div>
                      <div className="bg-carbon-950 p-1.5 rounded border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-sans block">Rec</span>
                        <span className="font-semibold text-amber-300">{recPct}%</span>
                      </div>
                      <div className="bg-carbon-950 p-1.5 rounded border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-sans block">F1</span>
                        <span className="font-semibold text-emerald-300">{f1Pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Evaluation pipeline utilizes zero-division safety and standard scikit-learn macro/weighted aggregation.
          </div>
        </div>

      </div>

      {/* Aspect-Level Extraction & Sentiment Performance Table */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              9-Aspect Detection & Sentiment Accuracy Breakdown
            </h3>
            <p className="text-xs text-slate-400">Evaluates whether target automotive aspects were correctly isolated and assigned appropriate polarity</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {Object.keys(aspectPerf).length} Aspects Monitored
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left divide-y divide-slate-800">
            <thead className="bg-carbon-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Aspect</th>
                <th className="px-4 py-2.5">Test Occurrences</th>
                <th className="px-4 py-2.5">Aspect Detection Rate</th>
                <th className="px-4 py-2.5">Aspect Sentiment Accuracy</th>
                <th className="px-4 py-2.5">Performance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-carbon-900/40 text-slate-300 font-mono">
              {Object.entries(aspectPerf).map(([aspectName, stats]) => {
                const detRate = Math.round((stats.detection_accuracy || 0) * 100);
                const sentAcc = Math.round((stats.sentiment_accuracy || 0) * 100);

                return (
                  <tr key={aspectName} className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-white font-sans">{aspectName}</td>
                    <td className="px-4 py-2.5">{stats.occurrences}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center space-x-2">
                        <span>{detRate}%</span>
                        <div className="w-16 h-1.5 bg-carbon-950 rounded-full overflow-hidden">
                          <div style={{ width: `${detRate}%` }} className="h-full bg-cyan-400"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center space-x-2">
                        <span className={sentAcc >= 70 ? 'text-emerald-400' : 'text-amber-400'}>{sentAcc}%</span>
                        <div className="w-16 h-1.5 bg-carbon-950 rounded-full overflow-hidden">
                          <div style={{ width: `${sentAcc}%` }} className={`h-full ${sentAcc >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        sentAcc >= 75
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {sentAcc >= 75 ? 'Optimal' : 'Moderate'}
                      </span>
                    </td>
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
