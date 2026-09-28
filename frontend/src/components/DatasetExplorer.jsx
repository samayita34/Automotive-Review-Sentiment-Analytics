import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Car, 
  Smile, 
  Frown, 
  Meh, 
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { fetchDatasetSamples } from '../services/api';

export default function DatasetExplorer({ onSelectSample }) {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSplit, setSelectedSplit] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');

  useEffect(() => {
    loadDataset();
  }, []);

  const loadDataset = async () => {
    try {
      setLoading(true);
      const data = await fetchDatasetSamples();
      setSamples(data.samples || []);
    } catch (err) {
      console.error('Error fetching dataset samples:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSamples = samples.filter((item) => {
    const matchesSearch = 
      item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.vehicle_model && item.vehicle_model.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSplit = selectedSplit === 'all' || item.split === selectedSplit;
    const matchesSentiment = selectedSentiment === 'all' || item.ground_truth_overall === selectedSentiment;

    return matchesSearch && matchesSplit && matchesSentiment;
  });

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
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card p-5 border-blue-500/30 bg-gradient-to-r from-blue-950/30 via-carbon-800 to-indigo-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
              Academic Benchmark Dataset
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Automotive Customer Reviews Dataset Explorer
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Curated automotive review benchmark annotated with ground-truth overall sentiments and 9 aspect-specific sentiments for scientific evaluation.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-carbon-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Total Samples: <strong>{samples.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reviews by model, aspect keywords (e.g. battery, mpg, CarPlay)..."
            className="w-full bg-carbon-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Split Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedSplit}
            onChange={(e) => setSelectedSplit(e.target.value)}
            className="bg-carbon-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Splits ({samples.length})</option>
            <option value="test">Test Split ({samples.filter(s => s.split === 'test').length})</option>
            <option value="train">Train Split ({samples.filter(s => s.split === 'train').length})</option>
          </select>

          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="bg-carbon-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
        </div>

      </div>

      {/* Dataset Grid List */}
      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Loading benchmark dataset...</p>
        </div>
      ) : filteredSamples.length === 0 ? (
        <div className="glass-card p-8 text-center text-xs text-slate-400">
          No dataset samples found matching your search filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSamples.map((item) => (
            <div 
              key={item.id}
              className="glass-card p-4 flex flex-col justify-between hover:border-slate-600 transition-all group"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 bg-carbon-900 rounded border border-slate-800">
                      {item.id}
                    </span>
                    <span className="text-xs font-bold text-white flex items-center">
                      <Car className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                      {item.vehicle_model || 'Automobile'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.split}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getSentimentBadge(item.ground_truth_overall)}`}>
                      {item.ground_truth_overall}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-200 leading-relaxed my-2.5">
                  "{item.text}"
                </p>
              </div>

              {/* Ground Truth Aspects */}
              <div className="pt-3 border-t border-slate-800/80 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-mono">Aspects:</span>
                  {Object.entries(item.ground_truth_aspects || {}).map(([asp, sent]) => (
                    <span 
                      key={asp}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono border ${getSentimentBadge(sent)}`}
                    >
                      {asp}: {sent}
                    </span>
                  ))}
                </div>

                {onSelectSample && (
                  <button
                    onClick={() => onSelectSample(item.text, item.vehicle_model)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold self-end sm:self-auto hover:underline"
                  >
                    Test in Live Analyzer →
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
