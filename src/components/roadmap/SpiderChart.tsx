import React, { useState } from 'react';
import type { SkillCategory } from '../../types/roadmap';
import { Globe, ShieldCheck } from 'lucide-react';

interface SpiderChartProps {
  categories: SkillCategory[];
  milestoneTitle: string;
}

interface CountryMarket {
  id: string;
  name: string;
  flag: string;
  color: string;
  benchmarks: number[];
}

export const SpiderChart: React.FC<SpiderChartProps> = ({ categories }) => {
  const [selectedMarketId, setSelectedMarketId] = useState<string>('market-vn');

  const countryMarkets: CountryMarket[] = [
    {
      id: 'market-vn',
      name: 'Vietnam',
      flag: '🇻🇳',
      color: '#10b981',
      benchmarks: [75, 85, 80, 70, 65],
    },
    {
      id: 'market-sg',
      name: 'Singapore',
      flag: '🇸🇬',
      color: '#06b6d4',
      benchmarks: [85, 90, 88, 80, 85],
    },
    {
      id: 'market-us',
      name: 'USA',
      flag: '🇺🇸',
      color: '#f59e0b',
      benchmarks: [90, 92, 90, 85, 90],
    },
    {
      id: 'market-jp',
      name: 'Japan',
      flag: '🇯🇵',
      color: '#ec4899',
      benchmarks: [75, 85, 80, 75, 90],
    },
  ];

  const currentMarket = countryMarkets.find((m) => m.id === selectedMarketId) || countryMarkets[0];

  // Extract all skills from categories to form axes
  const skillsList = categories.flatMap((cat) =>
    cat.skills.map((s) => ({
      id: s.id,
      name: s.name,
      value: s.levelPercentage,
    }))
  );

  // Map all skills directly from the milestone
  const displaySkills = skillsList.map((skill) => {
     let cleaned = skill.name;
     if (cleaned.length > 20) {
        const parts = cleaned.split('&');
        if (parts.length > 1) {
           cleaned = parts[0].trim() + '\n& ' + parts[1].trim();
        } else {
           const words = cleaned.split(' ');
           const mid = Math.ceil(words.length / 2);
           cleaned = words.slice(0, mid).join(' ') + '\n' + words.slice(mid).join(' ');
        }
     }
     return {
        id: skill.id,
        name: cleaned,
        value: skill.value
     };
  });

  const chartSkills = displaySkills.length > 0 
    ? displaySkills 
    : [{ id: 'empty', name: 'No skills', value: 0 }];

  const numAxes = chartSkills.length;
  const center = 185;
  const radius = 92;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, valPercent: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const currentRadius = (radius * Math.max(valPercent, 5)) / 100;
    const x = center + currentRadius * Math.cos(angle);
    const y = center + currentRadius * Math.sin(angle);
    return { x, y, angle };
  };

  const formatLabelLines = (name: string): string[] => {
    return name ? name.split('\n') : [];
  };

  const userPolygonPoints = chartSkills
    .map((sk, i) => {
      const { x, y } = getCoordinates(i, sk.value);
      return `${x},${y}`;
    })
    .join(' ');

  const marketPolygonPoints = chartSkills
    .map((_, i) => {
      const benchVal = currentMarket.benchmarks[i % currentMarket.benchmarks.length] || 80;
      const { x, y } = getCoordinates(i, benchVal);
      return `${x},${y}`;
    })
    .join(' ');

  const avgUserScore = Math.round(
    displaySkills.length > 0 ? displaySkills.reduce((acc, s) => acc + s.value, 0) / displaySkills.length : 0
  );
  const avgMarketBench = Math.round(
    displaySkills.length > 0 ? displaySkills.reduce((acc, _, i) => acc + (currentMarket.benchmarks[i % currentMarket.benchmarks.length] || 80), 0) / displaySkills.length : 100
  );
  const marketMatchPercent = avgMarketBench === 0 ? 0 : Math.min(100, Math.round((avgUserScore / avgMarketBench) * 100));

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
        {/* SVG Radar Chart Wrapper (Fixed Height) */}
        <div className="mb-6 h-64 shrink-0 relative w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 p-2">
           <svg viewBox="0 0 370 370" className="w-full h-full max-w-[280px]">
             <defs>
               <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stopColor="rgba(59, 130, 246, 0.45)" />
                 <stop offset="70%" stopColor="rgba(59, 130, 246, 0.25)" />
                 <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
               </radialGradient>
               <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                 <feGaussianBlur stdDeviation="2" result="blur" />
                 <feComposite in="SourceGraphic" in2="blur" operator="over" />
               </filter>
             </defs>

             {/* Grid Polygons */}
             {levels.map((level, lvlIdx) => {
               const gridPoints = chartSkills
                 .map((_, i) => {
                   const { x, y } = getCoordinates(i, level * 100);
                   return `${x},${y}`;
                 })
                 .join(' ');
               return (
                 <polygon
                   key={`grid-${lvlIdx}`}
                   points={gridPoints}
                   fill="none"
                   stroke="#e2e8f0"
                   strokeWidth="1.5"
                   strokeDasharray={lvlIdx === levels.length - 1 ? 'none' : '4,4'}
                 />
               );
             })}

             {/* Grid Axes Lines */}
             {chartSkills.map((_, i) => {
               const { x, y } = getCoordinates(i, 100);
               return (
                 <line
                   key={`axis-${i}`}
                   x1={center}
                   y1={center}
                   x2={x}
                   y2={y}
                   stroke="#e2e8f0"
                   strokeWidth="1.5"
                 />
               );
             })}

             {/* Market Target Polygon */}
             <polygon
               points={marketPolygonPoints}
               fill="none"
               stroke={currentMarket.color}
               strokeWidth="2"
               strokeDasharray="4,4"
             />

             {/* Market Vertices */}
             {chartSkills.map((_, idx) => {
               const benchVal = currentMarket.benchmarks[idx % currentMarket.benchmarks.length] || 80;
               const { x, y } = getCoordinates(idx, benchVal);
               return (
                 <circle
                   key={`market-point-${idx}`}
                   cx={x}
                   cy={y}
                   r={3.5}
                   fill={currentMarket.color}
                 />
               );
             })}

             {/* User Actual Skill Polygon */}
             <polygon
               points={userPolygonPoints}
               fill="url(#radarGrad)"
               stroke="#3b82f6"
               strokeWidth="2.5"
               filter="url(#glow)"
             />

             {/* User Vertices */}
             {chartSkills.map((sk, i) => {
               const { x, y } = getCoordinates(i, sk.value);
               return (
                 <circle key={`u-vertex-${i}`} cx={x} cy={y} r="4" fill="#3b82f6" />
               );
             })}

             {/* Sleek Skill Labels */}
             {chartSkills.map((sk, i) => {
               const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
               const labelRadius = radius + 22;
               const lx = Math.round(center + labelRadius * Math.cos(angle));
               const ly = Math.round(center + labelRadius * Math.sin(angle));
               const textAnchor = Math.abs(lx - center) < 15 ? 'middle' : lx > center ? 'start' : 'end';
               const lines = formatLabelLines(sk.name);

               return (
                 <text
                   key={`label-${i}`}
                   x={lx}
                   y={ly}
                   textAnchor={textAnchor}
                   dominantBaseline="central"
                   className="fill-slate-500 font-bold text-[11px]"
                   style={{ fontFamily: "'Inter', sans-serif" }}
                 >
                   {lines.map((line, lIdx) => (
                     <tspan key={lIdx} x={lx} dy={lIdx === 0 ? 0 : 12}>
                       {line}
                     </tspan>
                   ))}
                 </text>
               );
             })}
           </svg>
        </div>

        {/* Legend & Country Selector Row */}
        <div className="flex items-center justify-between gap-4 mb-6 relative shrink-0">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <span className="text-[11px] font-bold text-slate-600">You ({avgUserScore}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentMarket.color }}></div>
                    <span className="text-[11px] font-bold text-slate-600">Market ({avgMarketBench}%)</span>
                </div>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-100 transition-colors">
                <Globe size={12} className="text-slate-500" />
                <select
                  className="bg-transparent text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                >
                  {countryMarkets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.flag} {m.name}
                    </option>
                  ))}
                </select>
            </div>
        </div>

        {/* Data List */}
        <div className="space-y-3 mb-6 w-full pr-1 overflow-y-auto flex-1 hide-scrollbar">
            {displaySkills.map((sk, idx) => {
                const benchVal = currentMarket.benchmarks[idx % currentMarket.benchmarks.length] || 80;
                return (
                    <div key={sk.id} className="flex items-center justify-between group">
                        <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600 transition-colors w-[45%] truncate pr-2" title={sk.name}>
                            {sk.name}
                        </span>
                        <div className="w-[55%] h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-0 h-full opacity-30" style={{ width: `${benchVal}%`, backgroundColor: currentMarket.color }}></div>
                            <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: `${sk.value}%` }}></div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Market Match Overview */}
        <div className="bg-blue-50/50 rounded-xl p-4 flex items-center justify-between border border-blue-100 w-full mt-auto shrink-0">
            <div className="text-center flex-1">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Your Avg</span>
                <span className="text-[15px] font-black text-blue-700">{avgUserScore}%</span>
            </div>
            <div className="w-px h-8 bg-blue-200/60"></div>
            <div className="text-center flex-1">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Market</span>
                <span className="text-[15px] font-black" style={{ color: currentMarket.color }}>{avgMarketBench}%</span>
            </div>
            <div className="w-px h-8 bg-blue-200/60"></div>
            <div className="text-center flex-1">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Match</span>
                <span className="text-[15px] font-black text-emerald-600 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> {marketMatchPercent}%
                </span>
            </div>
        </div>
    </div>
  );
};
