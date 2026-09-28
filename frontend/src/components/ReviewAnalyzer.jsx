import React, { useState } from 'react';

const PRESET_REVIEWS = [
  {
    title: "Battery Range & Charging Time (Prompt Example)",
    text: "The battery range is excellent, but the charging time is too long. The infotainment system is easy to use."
  },
  {
    title: "V8 Engine Power vs Gas Mileage",
    text: "The V8 engine power and acceleration are absolutely thrilling, but the gas mileage is terrible."
  },
  {
    title: "Safety Features & Suspension Comfort",
    text: "Top-tier safety features with flawless ADAS lane keeping and excellent emergency braking. Ride quality is very plush."
  },
  {
    title: "Infotainment Touchscreen Lag",
    text: "The infotainment touchscreen is laggy and Apple CarPlay disconnects frequently, though the exterior styling looks sharp."
  },
  {
    title: "Affordable Price & Cabin Noise",
    text: "The price tag is very affordable and value for money, but the cabin road noise is loud and suspension feels stiff."
  }
];

export default function ReviewAnalyzer({ onAnalyze, loading, error }) {
  const [reviewText, setReviewText] = useState(PRESET_REVIEWS[0].text);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!reviewText.trim()) {
      setValidationError('Please enter review text before analyzing.');
      return;
    }
    setValidationError('');
    onAnalyze(reviewText.trim());
  };

  const handleSelectPreset = (text) => {
    setReviewText(text);
    setValidationError('');
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const charCount = reviewText.length;
  const wordCount = reviewText.trim() ? reviewText.trim().split(/\s+/).length : 0;

  return (
    <div className="mono-card p-6 mb-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-mono-300">
            ANALYZE CUSTOMER REVIEW
          </h2>
        </div>

        {/* Minimal Presets Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-mono-400">Presets:</span>
          <select
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              if (PRESET_REVIEWS[idx]) handleSelectPreset(PRESET_REVIEWS[idx].text);
            }}
            className="bg-mono-950 border border-mono-700 text-xs text-mono-200 rounded px-2.5 py-1 font-mono focus:outline-none focus:border-mono-400"
          >
            {PRESET_REVIEWS.map((preset, idx) => (
              <option key={idx} value={idx}>
                {preset.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Large Black Textarea */}
        <div className="relative">
          <textarea
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
              if (validationError) setValidationError('');
            }}
            onKeyDown={handleKeyDown}
            rows={5}
            placeholder="Enter an automotive customer review..."
            className="w-full bg-mono-950 border border-mono-700 rounded p-4 text-sm text-mono-white placeholder-mono-500 focus:outline-none focus:border-mono-400 transition-colors font-sans leading-relaxed resize-y"
          />
        </div>

        {/* Character / Word count & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-3 text-mono-400 font-mono text-[11px]">
            <span>{charCount} characters · {wordCount} words</span>
            <span className="text-mono-600">|</span>
            <button
              type="button"
              onClick={() => {
                setReviewText('');
                setValidationError('');
              }}
              className="text-mono-400 hover:text-mono-white underline transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Minimal Inverted Button */}
          <button
            type="submit"
            disabled={loading || !reviewText.trim()}
            className={`px-6 py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase transition-all duration-150 border ${
              loading || !reviewText.trim()
                ? 'bg-mono-900 text-mono-600 border-mono-700 cursor-not-allowed'
                : 'mono-btn hover:bg-mono-white hover:text-mono-950 hover:border-mono-white'
            }`}
          >
            {loading ? 'ANALYZING...' : '[ ANALYZE REVIEW ]'}
          </button>
        </div>

        {/* Error Alert */}
        {(validationError || error) && (
          <div className="p-3 border border-mono-700 bg-mono-950 text-xs font-mono text-mono-200 rounded">
            Error: {validationError || error}
          </div>
        )}

      </form>

    </div>
  );
}
