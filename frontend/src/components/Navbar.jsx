import React from 'react';
import { 
  Car, 
  BarChart3, 
  BrainCircuit, 
  Database, 
  Activity, 
  Sparkles,
  Gauge
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Live Sentiment Analyzer', icon: Gauge },
    { id: 'aspects', label: 'Aspect Breakdown & Analytics', icon: BarChart3 },
    { id: 'evaluation', label: 'Academic Model Evaluation', icon: BrainCircuit },
    { id: 'dataset', label: 'Benchmark Dataset', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-blue flex items-center justify-center">
              <div className="w-full h-full bg-carbon-900 rounded-[10px] flex items-center justify-center">
                <Car className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  AutoSent<span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">NLP</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">
                  <Sparkles className="w-3 h-3 mr-1" /> BERT / RoBERTa ABSA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                AI-Based Automotive Review & Customer Sentiment Analytics
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-carbon-800 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Telemetry Status */}
          <div className="hidden lg:flex items-center space-x-3 text-xs border-l border-slate-800 pl-4">
            <div className="flex items-center space-x-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono font-medium">Pipeline Ready</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
