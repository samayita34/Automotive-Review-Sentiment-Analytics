import React from 'react';
import { 
  Car, 
  Flame, 
  BatteryCharging, 
  Fuel, 
  ShieldCheck, 
  Armchair, 
  Wrench, 
  Tv, 
  DollarSign,
  Info
} from 'lucide-react';

const ASPECT_ICONS = {
  Vehicle: Car,
  Engine: Flame,
  Battery: BatteryCharging,
  Mileage: Fuel,
  Safety: ShieldCheck,
  Comfort: Armchair,
  Service: Wrench,
  Infotainment: Tv,
  Price: DollarSign
};

const ASPECT_DESCRIPTIONS = {
  Vehicle: "Overall vehicle build, exterior styling, chassis, handling dynamics, and platform.",
  Engine: "Powertrain, horsepower, torque output, throttle response, and gearbox shifts.",
  Battery: "EV battery capacity, driving range, DC fast charging speed, and thermal health.",
  Mileage: "Fuel economy, MPG, KMPL, gas consumption, and energy efficiency.",
  Safety: "Crash ratings, ADAS driver assists, airbags, emergency braking, and blind spot monitoring.",
  Comfort: "Seating ergonomics, suspension compliance, cabin insulation, and climate control.",
  Service: "Dealership experience, maintenance costs, warranty claims, and customer support.",
  Infotainment: "Touchscreen responsiveness, Apple CarPlay, Android Auto, sound system, and UI.",
  Price: "MSRP pricing, value for money, depreciation, resale value, and ownership cost."
};

export default function AspectSentimentMatrix({ stats }) {
  if (!stats) return null;

  const aspectDist = stats.aspect_sentiment_distribution || {};
  const allAspects = Object.keys(ASPECT_DESCRIPTIONS);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card p-5 border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-carbon-800 to-indigo-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono">
              Aspect-Based Sentiment Intelligence
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              9-Aspect Automotive Taxonomy Scorecard
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Deep granular sentiment analytics mapping customer satisfaction, sentiment distribution, and pain points across all vehicle dimensions.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300 bg-carbon-900/80 px-3 py-2 rounded-lg border border-slate-700">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Extracted via clause-level dependency mapping</span>
          </div>
        </div>
      </div>

      {/* 9 Aspect Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAspects.map((aspectName) => {
          const Icon = ASPECT_ICONS[aspectName] || Car;
          const counts = aspectDist[aspectName] || { Positive: 0, Neutral: 0, Negative: 0, total: 0 };
          const total = counts.total || 0;
          const pos = counts.Positive || 0;
          const neg = counts.Negative || 0;
          const neu = counts.Neutral || 0;

          const posRate = total > 0 ? Math.round((pos / total) * 100) : 0;
          const negRate = total > 0 ? Math.round((neg / total) * 100) : 0;
          const neuRate = total > 0 ? Math.round((neu / total) * 100) : 0;

          const isHealthy = posRate >= negRate;

          return (
            <div 
              key={aspectName}
              className="glass-card p-4 flex flex-col justify-between hover:border-slate-600 transition-all group"
            >
              <div>
                {/* Title & Icon */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{aspectName}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">{total} Mentions</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
                    isHealthy
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                      : 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                  }`}>
                    {posRate}% Pos
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 my-2 leading-relaxed">
                  {ASPECT_DESCRIPTIONS[aspectName]}
                </p>
              </div>

              {/* Progress Proportions */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                  <span className="text-emerald-400">Pos: {pos} ({posRate}%)</span>
                  <span className="text-amber-400">Neu: {neu} ({neuRate}%)</span>
                  <span className="text-rose-400">Neg: {neg} ({negRate}%)</span>
                </div>

                <div className="h-2 w-full bg-carbon-900 rounded-full overflow-hidden flex">
                  <div style={{ width: `${posRate}%` }} className="bg-emerald-500"></div>
                  <div style={{ width: `${neuRate}%` }} className="bg-amber-500"></div>
                  <div style={{ width: `${negRate}%` }} className="bg-rose-500"></div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
