import React from 'react';

export default function Header({ backendStatus }) {
  const isOnline = backendStatus === 'healthy';

  return (
    <header className="border-b border-mono-700 bg-mono-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Title & Subtitle */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-mono-white leading-tight">
              AI-Based Automotive Review &<br className="hidden sm:inline" /> Customer Sentiment Analytics
            </h1>
            <p className="text-xs text-mono-400 mt-1 font-mono tracking-wide uppercase">
              Academic NLP · Automotive Intelligence
            </p>
          </div>

          {/* Minimal Status Indicator */}
          <div className="flex items-center space-x-2 self-start sm:self-center">
            <div className="flex items-center space-x-2 px-3 py-1 rounded border border-mono-700 bg-mono-900 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-mono-white' : 'bg-mono-500'}`}></span>
              <span className="text-mono-200">
                {isOnline ? 'FastAPI Online' : 'Connecting...'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
