import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import ReviewAnalyzer from './components/ReviewAnalyzer';
import ResultSection from './components/ResultSection';
import AnalyticsSection from './components/AnalyticsSection';
import HistorySection from './components/HistorySection';
import { analyzeReview, checkBackendHealth } from './services/api';

const INITIAL_DEMO_REVIEWS = [
  {
    original_text: "The battery range is excellent, but the charging time is too long. The infotainment system is easy to use.",
    overall_sentiment: "positive",
    overall_confidence: 0.92,
    aspects: [
      { aspect: "battery range", sentiment: "positive", confidence: 0.96, category: "Battery", context_clause: "The battery range is excellent" },
      { aspect: "charging time", sentiment: "negative", confidence: 0.88, category: "Battery", context_clause: "the charging time is too long." },
      { aspect: "infotainment system", sentiment: "positive", confidence: 0.91, category: "Infotainment", context_clause: "The infotainment system is easy to use." }
    ],
    processing_time_ms: 222.17
  },
  {
    original_text: "The V8 engine power and acceleration are absolutely thrilling, but the gas mileage is terrible.",
    overall_sentiment: "negative",
    overall_confidence: 0.78,
    aspects: [
      { aspect: "engine power", sentiment: "positive", confidence: 0.94, category: "Engine", context_clause: "The V8 engine power is thrilling" },
      { aspect: "gas mileage", sentiment: "negative", confidence: 0.94, category: "Mileage", context_clause: "the gas mileage is terrible." }
    ],
    processing_time_ms: 144.87
  },
  {
    original_text: "The customer service was terrible, the dealership was rude, and repairs were overpriced.",
    overall_sentiment: "negative",
    overall_confidence: 0.98,
    aspects: [
      { aspect: "customer service", sentiment: "negative", confidence: 0.97, category: "Service", context_clause: "The customer service was terrible" },
      { aspect: "dealership", sentiment: "negative", confidence: 0.98, category: "Service", context_clause: "the dealership was rude" },
      { aspect: "repairs", sentiment: "negative", confidence: 0.97, category: "Service", context_clause: "and repairs were overpriced." }
    ],
    processing_time_ms: 172.4
  }
];

export default function App() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('auto_sentiment_history');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_REVIEWS;
    } catch {
      return INITIAL_DEMO_REVIEWS;
    }
  });

  const [currentResult, setCurrentResult] = useState(INITIAL_DEMO_REVIEWS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check health on mount
  useEffect(() => {
    const verifyHealth = async () => {
      try {
        const res = await checkBackendHealth();
        setBackendStatus(res.status === 'healthy' ? 'healthy' : 'initializing');
      } catch (err) {
        setBackendStatus('unreachable');
      }
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('auto_sentiment_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Handle Review Analysis
  const handleAnalyzeReview = async (reviewText) => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeReview(reviewText);
      setCurrentResult(result);
      setHistory((prev) => [result, ...prev.slice(0, 49)]);
    } catch (err) {
      setError(err.message || 'Failed to connect to FastAPI backend.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Review Selection from History
  const handleSelectHistoryReview = (record) => {
    setCurrentResult(record);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Clear History
  const handleClearHistory = () => {
    if (window.confirm('Clear analyzed review history?')) {
      setHistory([]);
      localStorage.removeItem('auto_sentiment_history');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-mono-white selection:bg-mono-white selection:text-mono-950 font-sans">
      
      {/* 1. Header */}
      <Header backendStatus={backendStatus} />

      {/* Main Spacious Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* 2. Summary Cards */}
        <SummaryCards history={history} />

        {/* 3. Review Analyzer */}
        <ReviewAnalyzer 
          onAnalyze={handleAnalyzeReview} 
          loading={loading} 
          error={error} 
        />

        {/* 4. Result Section */}
        {currentResult && (
          <ResultSection result={currentResult} />
        )}

        {/* 5. Analytics (Monochrome Recharts) */}
        <AnalyticsSection history={history} />

        {/* 6. History Section */}
        <HistorySection 
          history={history} 
          onSelectReview={handleSelectHistoryReview}
          onClearHistory={handleClearHistory}
        />

      </main>

      {/* 7. Minimal Monochrome Footer */}
      <footer className="border-t border-mono-700 bg-mono-950 py-8 text-xs font-mono text-mono-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-bold text-mono-white block">
              AI-BASED AUTOMOTIVE REVIEW & CUSTOMER SENTIMENT ANALYTICS
            </span>
            <span className="text-[11px] text-mono-500">
              Academic Project
            </span>
          </div>
          <div className="text-[11px] text-mono-400 space-x-2">
            <span>FastAPI</span>
            <span className="text-mono-600">·</span>
            <span>PyTorch</span>
            <span className="text-mono-600">·</span>
            <span>RoBERTa</span>
            <span className="text-mono-600">·</span>
            <span>React</span>
            <span className="text-mono-600">·</span>
            <span>Vite</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
