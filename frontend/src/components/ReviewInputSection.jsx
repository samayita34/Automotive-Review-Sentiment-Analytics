import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Lightbulb, 
  Car, 
  AlertCircle,
  Zap
} from 'lucide-react';

const PRESET_REVIEWS = [
  {
    label: "Battery Range & Infotainment (Prompt Example)",
    vehicle: "Tesla Model 3",
    text: "The battery range is excellent, but the charging time is too long. The infotainment system is easy to use."
  },
  {
    label: "Engine V8 Power vs Gas Mileage",
    vehicle: "Ford Mustang GT",
    text: "The V8 engine power and acceleration are absolutely thrilling, but the gas mileage is terrible."
  },
  {
    label: "Safety & Smooth Suspension",
    vehicle: "Volvo XC90",
    text: "Top-tier safety features with flawless ADAS lane keeping and excellent emergency braking. Ride quality is very plush."
  },
  {
    label: "Affordable Price & Poor Service",
    vehicle: "Honda Civic",
    text: "The price is very affordable and maintenance costs are low, but the dealership customer service was awful."
  },
  {
    label: "Touchscreen Lag & Stiff Ride",
    vehicle: "Polestar 2",
    text: "The infotainment touchscreen is laggy and Apple CarPlay disconnects frequently, though the exterior styling looks sharp."
  }
];

export default function ReviewInputSection({ onAnalyze, loading }) {
  const [reviewText, setReviewText] = useState(PRESET_REVIEWS[0].text);
  const [vehicleModel, setVehicleModel] = useState(PRESET_REVIEWS[0].vehicle);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectPreset = (preset) => {
    setReviewText(preset.text);
    setVehicleModel(preset.vehicle);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!reviewText.trim()) {
      setErrorMessage('Please enter an automotive review before analyzing.');
      return;
    }
    setErrorMessage('');
    onAnalyze(reviewText.trim(), vehicleModel.trim() || 'Automotive Review');
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="glass-card p-5 mb-6 border-slate-700/70">
      
      {/* Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Automotive Review Input</h2>
            <p className="text-xs text-slate-400">Input customer feedback to extract 9 target aspects and polarity</p>
          </div>
        </div>

        {/* Quick Presets Dropdown / Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 flex items-center">
            <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-400" /> Presets:
          </span>
          <select
            onChange={(e) => {
              const selected = PRESET_REVIEWS[parseInt(e.target.value, 10)];
              if (selected) handleSelectPreset(selected);
            }}
            className="bg-carbon-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {PRESET_REVIEWS.map((preset, idx) => (
              <option key={idx} value={idx}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        
        {/* Vehicle Model Tag */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
              <Car className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              placeholder="Vehicle Model (e.g. Tesla Model 3)"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-carbon-900 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-carbon-900 border border-slate-700 rounded text-slate-400 font-mono text-[10px]">Ctrl + Enter</kbd> to analyze
          </span>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="Type or paste an automotive customer review here... (e.g. The battery range is excellent, but the charging time is too long. The infotainment is easy to use.)"
            className="w-full bg-carbon-900/90 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-sans leading-relaxed resize-y"
          />
          <div className="absolute bottom-2.5 right-3 text-[11px] text-slate-500 font-mono">
            {reviewText.length} chars | {reviewText.trim() ? reviewText.trim().split(/\s+/).length : 0} words
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-lg animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setReviewText('');
                setVehicleModel('');
                setErrorMessage('');
              }}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-carbon-700 rounded-lg transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !reviewText.trim()}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-lg transition-all duration-200 ${
              loading || !reviewText.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-500/25 hover:shadow-cyan-500/35 border border-blue-400/30'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Extracting Aspects & Sentiment...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Analyze Review</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
