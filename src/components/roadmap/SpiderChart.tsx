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

export const SpiderChart: React.FC<SpiderChartProps> = ({ categories, milestoneTitle }) => {
  const [selectedMarketId, setSelectedMarketId] = useState<string>('market-vn');

  const countryMarkets: CountryMarket[] = [
    {
      id: 'market-vn',
      name: 'Việt Nam',
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
      name: 'Mỹ',
      flag: '🇺🇸',
      color: '#f59e0b',
      benchmarks: [90, 92, 90, 85, 90],
    },
    {
      id: 'market-jp',
      name: 'Nhật Bản',
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

  // Standardize display skills to exactly 5 axes with short & concise names
  const displaySkills = [...skillsList];
  const standardLabels = [
    'Tư Duy UX',
    'Layout & CSS',
    'React & Tailwind',
    'Animation & Micro',
    'Tối Ưu & A11y',
  ];

  while (displaySkills.length < 5) {
    const idx = displaySkills.length;
    displaySkills.push({
      id: `sk-std-${idx}`,
      name: standardLabels[idx] || `Kỹ năng ${idx + 1}`,
      value: 0,
    });
  }

  const finalSkills = displaySkills.slice(0, 5);

  const numAxes = 5;
  const center = 185;
  const radius = 92; // Enlarged radar chart grid area with generous padding
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, valPercent: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const currentRadius = (radius * Math.max(valPercent, 5)) / 100;
    const x = center + currentRadius * Math.cos(angle);
    const y = center + currentRadius * Math.sin(angle);
    return { x, y, angle };
  };

  // Helper to map long skill names into short & concise titles
  const formatLabelLines = (name: string): string[] => {
    const shortNameMap: Record<string, string> = {
      'Nguyên Tắc UX & Trực Quan': 'Tư Duy UX',
      'Visual Hierarchy & Layout Balance': 'Layout & CSS',
      'Flexbox, CSS Grid & SASS': 'CSS Grid & Flex',
      'Tailwind CSS & React Components': 'React & Tailwind',
      'Micro-interactions & Fonts/WebP': 'Animation & Micro',
      'Mobile-First & Performance Tuning': 'Tối Ưu & Mobile',
      'Cross-Browser & Web Accessibility': 'Tối Ưu & A11y',
      'Module Federation & GraphQL': 'GraphQL & Federation',
    };

    const cleaned = shortNameMap[name] || name;
    if (cleaned.length <= 13) return [cleaned];
    const words = cleaned.split(' ');
    if (words.length >= 2) {
      const mid = Math.ceil(words.length / 2);
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    }
    return [cleaned];
  };

  const userPolygonPoints = finalSkills
    .map((sk, i) => {
      const { x, y } = getCoordinates(i, sk.value);
      return `${x},${y}`;
    })
    .join(' ');

  const marketPolygonPoints = finalSkills
    .map((_, i) => {
      const benchVal = currentMarket.benchmarks[i] || 75;
      const { x, y } = getCoordinates(i, benchVal);
      return `${x},${y}`;
    })
    .join(' ');

  const avgUserScore = Math.round(
    finalSkills.reduce((acc, s) => acc + s.value, 0) / finalSkills.length
  );
  const avgMarketBench = Math.round(
    currentMarket.benchmarks.reduce((acc, b) => acc + b, 0) / currentMarket.benchmarks.length
  );
  const marketMatchPercent = Math.min(100, Math.round((avgUserScore / avgMarketBench) * 100));

  return (
    <div className="spider-chart-card glass-panel flex-card-full-height compact-view">
      {/* Chart Header */}
      <div className="chart-header compact-header">
        <div className="chart-header-top-row">
          <div className="chart-title-group">
            <h3>Biểu Đồ Mạng Nhện Năng Lực</h3>
          </div>

          <div className="country-market-selector-wrap">
            <Globe size={13} className="selector-globe-icon" />
            <select
              className="country-market-select"
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(e.target.value)}
              title="Chọn thị trường quốc gia"
            >
              {countryMarkets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.flag} {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="chart-subtitle compact-sub">
          So sánh kỹ năng thuộc {milestoneTitle} với tiêu chuẩn <strong>{currentMarket.name}</strong>
        </p>

        <div className="radar-legend-bar compact-legend">
          <div className="legend-item user-legend">
            <span className="legend-dot user-dot" />
            <span className="legend-text">Bạn ({avgUserScore}%)</span>
          </div>
          <div className="legend-item market-legend">
            <span className="legend-dot market-dot" style={{ background: currentMarket.color }} />
            <span className="legend-text">Thị Trường {currentMarket.flag} ({avgMarketBench}%)</span>
          </div>
        </div>
      </div>

      {/* SVG Radar Chart (Enlarged canvas 370x370 for spacious label padding) */}
      <div className="chart-container-flex compact-flex">
        <svg viewBox="0 0 370 370" className="spider-svg compact-svg">
          <defs>
            <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(2, 132, 199, 0.45)" />
              <stop offset="70%" stopColor="rgba(37, 99, 235, 0.25)" />
              <stop offset="100%" stopColor="rgba(2, 132, 199, 0.05)" />
            </radialGradient>
            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Polygons */}
          {levels.map((level, lvlIdx) => {
            const gridPoints = finalSkills
              .map((_, i) => {
                const { x, y } = getCoordinates(i, level * 100);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={`level-${lvlIdx}`}
                points={gridPoints}
                className="radar-grid-poly"
              />
            );
          })}

          {/* Axes lines */}
          {finalSkills.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={`axis-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                className="radar-axis-line"
              />
            );
          })}

          {/* LAYER 1: Market Country Benchmark */}
          <polygon
            points={marketPolygonPoints}
            fill={`${currentMarket.color}15`}
            stroke={currentMarket.color}
            strokeWidth="1.8"
            strokeDasharray="4,4"
            className="radar-market-poly"
          />

          {/* Market Vertices */}
          {finalSkills.map((_, i) => {
            const benchVal = currentMarket.benchmarks[i] || 75;
            const { x, y } = getCoordinates(i, benchVal);
            return (
              <circle
                key={`m-vertex-${i}`}
                cx={x}
                cy={y}
                r="3.5"
                fill={currentMarket.color}
                stroke="#ffffff"
                strokeWidth="1"
              />
            );
          })}

          {/* LAYER 2: User Actual Skill Polygon */}
          <polygon
            points={userPolygonPoints}
            fill="url(#radarGrad)"
            stroke="url(#strokeGrad)"
            strokeWidth="2.5"
            filter="url(#glow)"
            className="radar-data-poly"
          />

          {/* User Vertices */}
          {finalSkills.map((sk, i) => {
            const { x, y } = getCoordinates(i, sk.value);
            return (
              <g key={`vertex-${i}`} className="radar-vertex-group">
                <circle cx={x} cy={y} r="4.5" className="radar-vertex-dot" />
                <circle cx={x} cy={y} r="8" className="radar-vertex-halo" />
              </g>
            );
          })}

          {/* Sleek Skill Labels with ample padding */}
          {finalSkills.map((sk, i) => {
            const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
            const labelRadius = radius + 22;
            const lx = Math.round(center + labelRadius * Math.cos(angle));
            const ly = Math.round(center + labelRadius * Math.sin(angle));
            const textAnchor = Math.abs(lx - center) < 15 ? 'middle' : lx > center ? 'start' : 'end';
            const lines = formatLabelLines(sk.name);

            return (
              <g key={`label-${i}`}>
                <text
                  x={lx}
                  y={ly}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  className="radar-label-text"
                >
                  {lines.map((line, lIdx) => (
                    <tspan key={lIdx} x={lx} dy={lIdx === 0 ? 0 : 11}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Compact Footer Stats - Text & Numbers on 1 Single Row */}
      <div className="chart-footer-stats compact-footer">
        <div className="stat-pill">
          <span className="stat-label">TB Bạn:</span>
          <span className="stat-val highlight">{avgUserScore}%</span>
        </div>
        <div className="stat-pill">
          <span className="stat-label">Thị Trường:</span>
          <span className="stat-val" style={{ color: currentMarket.color, fontWeight: 800 }}>
            {avgMarketBench}%
          </span>
        </div>
        <div className="stat-pill match-pill">
          <span className="stat-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ShieldCheck size={11} color="#059669" /> Khớp:
          </span>
          <span className="stat-val match-val">{marketMatchPercent}%</span>
        </div>
      </div>
    </div>
  );
};
