import React, { useState } from 'react';
import type { Milestone } from '../../types/roadmap';
import { PieChart, ShieldCheck, Sparkles } from 'lucide-react';

interface IndustryRadarSectionProps {
  milestones: Milestone[];
}

interface IndustryCareerConfig {
  id: string;
  title: string;
  icon: string;
  categoryTag: string;
  description: string;
  themeColor: string;
  axes: { name: string; benchmark: number; calculatedScore?: number }[];
}

export const IndustryRadarSection: React.FC<IndustryRadarSectionProps> = ({ milestones }) => {
  // Calculate average user skill score across all skills in milestones
  const allSkills = milestones.flatMap((m) => m.categories.flatMap((c) => c.skills));
  const avgSkillScore = allSkills.length > 0
    ? Math.round(allSkills.reduce((acc, s) => acc + s.levelPercentage, 0) / allSkills.length)
    : 0;

  // Career Industry radar definitions
  const industryConfigs: IndustryCareerConfig[] = [
    {
      id: 'ind-frontend',
      title: 'Frontend Web Developer',
      icon: '💻',
      categoryTag: 'Lập Trình Web Giao Diện',
      description: 'Chuyên gia xây dựng giao diện ứng dụng Web mượt mà, tối ưu hiệu năng và trải nghiệm người dùng.',
      themeColor: '#0284c7',
      axes: [
        { name: 'Tư Duy UX/UI', benchmark: 80, calculatedScore: Math.min(100, Math.round(avgSkillScore * 1.1)) },
        { name: 'HTML5 & CSS3 Layout', benchmark: 90, calculatedScore: Math.min(100, Math.round(avgSkillScore * 1.2)) },
        { name: 'React & TypeScript', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.9)) },
        { name: 'Micro-Interactions', benchmark: 75, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.8)) },
        { name: 'Performance & A11y', benchmark: 80, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.85)) },
      ],
    },
    {
      id: 'ind-backend',
      title: 'Backend & Cloud Engineer',
      icon: '⚙️',
      categoryTag: 'Lập Trình Máy Chủ & Đám Mây',
      description: 'Kiến trúc sư hệ thống xử lý dữ liệu, API microservices và quản trị cơ sở dữ liệu quy mô lớn.',
      themeColor: '#059669',
      axes: [
        { name: 'Cơ Sở Dữ Liệu SQL/NoSQL', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.75)) },
        { name: 'REST & GraphQL APIs', benchmark: 90, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.8)) },
        { name: 'System Architecture', benchmark: 80, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.65)) },
        { name: 'Docker & DevOps CI/CD', benchmark: 75, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.6)) },
        { name: 'Security & Auth', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.7)) },
      ],
    },
    {
      id: 'ind-fullstack',
      title: 'Fullstack Software Engineer',
      icon: '🚀',
      categoryTag: 'Lập Trình Toàn Diện Fullstack',
      description: 'Kỹ sư công nghệ toàn năng làm chủ cả Frontend UI và Backend Architecture.',
      themeColor: '#7c3aed',
      axes: [
        { name: 'Frontend React/Vue', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 1.0)) },
        { name: 'Backend Node/Python', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.75)) },
        { name: 'Database Design', benchmark: 80, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.7)) },
        { name: 'Cloud Deployment', benchmark: 75, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.65)) },
        { name: 'Tối Ưu & Scale', benchmark: 80, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.8)) },
      ],
    },
    {
      id: 'ind-uiux',
      title: 'UI/UX Product Designer',
      icon: '🎨',
      categoryTag: 'Thiết Kế Trải Nghiệm Sản Phẩm',
      description: 'Nhà thiết kế nghiên cứu hành vi người dùng, Figma prototyping và xây dựng Design System.',
      themeColor: '#ec4899',
      axes: [
        { name: 'Nghiên Cứu User Research', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.95)) },
        { name: 'Figma & Wireframing', benchmark: 90, calculatedScore: Math.min(100, Math.round(avgSkillScore * 1.15)) },
        { name: 'Design System Tokens', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 1.05)) },
        { name: 'Visual Hierarchy', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 1.1)) },
        { name: 'Usability Testing', benchmark: 80, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.85)) },
      ],
    },
    {
      id: 'ind-aidata',
      title: 'AI & Data Science Engineer',
      icon: '🤖',
      categoryTag: 'Trí Tuệ Nhân Tạo & Dữ Liệu',
      description: 'Kỹ sư huấn luyện mô hình Machine Learning, phân tích dữ liệu lớn và ứng dụng LLM/GenAI.',
      themeColor: '#d97706',
      axes: [
        { name: 'Python & Data Processing', benchmark: 90, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.6)) },
        { name: 'Machine Learning Models', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.5)) },
        { name: 'LLM & Prompt Tuning', benchmark: 85, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.85)) },
        { name: 'SQL & Data Warehouse', benchmark: 80, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.7)) },
        { name: 'MLOps Deployment', benchmark: 75, calculatedScore: Math.min(100, Math.round(avgSkillScore * 0.55)) },
      ],
    },
  ];

  const [activeIndustryId, setActiveIndustryId] = useState<string>('ind-frontend');
  const activeIndustry = industryConfigs.find((ind) => ind.id === activeIndustryId) || industryConfigs[0];

  // SVG Geometry constants
  const numAxes = 5;
  const center = 185;
  const radius = 95;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, valPercent: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const currentRadius = (radius * Math.max(valPercent, 5)) / 100;
    const x = center + currentRadius * Math.cos(angle);
    const y = center + currentRadius * Math.sin(angle);
    return { x, y };
  };

  const userPoints = activeIndustry.axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.calculatedScore || 0);
      return `${x},${y}`;
    })
    .join(' ');

  const benchmarkPoints = activeIndustry.axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.benchmark);
      return `${x},${y}`;
    })
    .join(' ');

  const userAvg = Math.round(
    activeIndustry.axes.reduce((acc, a) => acc + (a.calculatedScore || 0), 0) / numAxes
  );
  const benchmarkAvg = Math.round(
    activeIndustry.axes.reduce((acc, a) => acc + a.benchmark, 0) / numAxes
  );
  const matchPercent = Math.min(100, Math.round((userAvg / benchmarkAvg) * 100));

  return (
    <div className="industry-radar-section glass-panel" style={{ padding: '24px', marginTop: '20px', borderRadius: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '10px', background: 'rgba(2, 132, 199, 0.1)', borderRadius: '12px', color: '#0284c7', display: 'flex', alignItems: 'center' }}>
            <PieChart size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Sơ Đồ Mạng Nhện Năng Lực Theo Ngành Nghề
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '2px 0 0 0' }}>
              So sánh năng lực hiện tại của bạn với tiêu chuẩn năng lực các vị trí công nghệ hàng đầu
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Sparkles size={16} color="#0284c7" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1' }}>
            {industryConfigs.length} Ngành Nghề Phân Tích
          </span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="industry-tabs-selector" style={{ display: 'flex', gap: '10px', marginTop: '18px', overflowX: 'auto', paddingBottom: '6px' }}>
        {industryConfigs.map((ind) => {
          const isActive = ind.id === activeIndustryId;
          return (
            <button
              key={ind.id}
              onClick={() => setActiveIndustryId(ind.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: isActive ? `2px solid ${ind.themeColor}` : '1px solid #e2e8f0',
                background: isActive ? `${ind.themeColor}12` : '#ffffff',
                color: isActive ? ind.themeColor : '#334155',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{ind.icon}</span>
              <span>{ind.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid: Left SVG Radar Chart, Right Industry Breakdown */}
      <div className="industry-radar-content-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '20px', alignItems: 'center' }}>
        {/* SVG Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
              🎯 Sơ Đồ Năng Lực {activeIndustry.icon} {activeIndustry.title}
            </span>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
              <span style={{ color: activeIndustry.themeColor }}>● Bạn ({userAvg}%)</span>
              <span style={{ color: '#94a3b8' }}>-- Tiêu chuẩn ({benchmarkAvg}%)</span>
            </div>
          </div>

          <svg viewBox="0 0 370 370" style={{ width: '100%', maxHeight: '310px' }}>
            <defs>
              <radialGradient id={`indGrad-${activeIndustry.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={activeIndustry.themeColor} stopOpacity="0.5" />
                <stop offset="100%" stopColor={activeIndustry.themeColor} stopOpacity="0.1" />
              </radialGradient>
            </defs>

            {/* Grid levels */}
            {levels.map((lvl, lIdx) => {
              const pts = activeIndustry.axes
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, lvl * 100);
                  return `${x},${y}`;
                })
                .join(' ');
              return <polygon key={lIdx} points={pts} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />;
            })}

            {/* Axis lines */}
            {activeIndustry.axes.map((_, i) => {
              const { x, y } = getCoordinates(i, 100);
              return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#cbd5e1" strokeWidth="1" />;
            })}

            {/* Benchmark Polygon */}
            <polygon points={benchmarkPoints} fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="4,4" />

            {/* User Polygon */}
            <polygon points={userPoints} fill={`url(#indGrad-${activeIndustry.id})`} stroke={activeIndustry.themeColor} strokeWidth="2.5" />

            {/* User Dots */}
            {activeIndustry.axes.map((axis, i) => {
              const { x, y } = getCoordinates(i, axis.calculatedScore || 0);
              return <circle key={i} cx={x} cy={y} r="4.5" fill={activeIndustry.themeColor} stroke="#ffffff" strokeWidth="1.5" />;
            })}

            {/* Labels */}
            {activeIndustry.axes.map((axis, i) => {
              const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
              const labelR = radius + 22;
              const lx = Math.round(center + labelR * Math.cos(angle));
              const ly = Math.round(center + labelR * Math.sin(angle));
              const anchor = Math.abs(lx - center) < 15 ? 'middle' : lx > center ? 'start' : 'end';

              return (
                <text key={i} x={lx} y={ly} textAnchor={anchor} dominantBaseline="central" style={{ fontSize: '10.5px', fontWeight: 700, fill: '#334155' }}>
                  {axis.name}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Right Info Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: activeIndustry.themeColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {activeIndustry.categoryTag}
            </span>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 8px 0' }}>
              {activeIndustry.icon} {activeIndustry.title}
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              {activeIndustry.description}
            </p>
          </div>

          {/* Match Score Card */}
          <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '14px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#0284c7" /> Độ Khớp Với Tiêu Chuẩn Ngành:
              </div>
              <div style={{ fontSize: '0.82rem', color: '#0369a1', marginTop: '4px' }}>
                {matchPercent >= 80 ? '🎉 Sẵn sàng ứng tuyển thực tế' : '⚡ Đang trên đà hoàn thiện kỹ năng'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: activeIndustry.themeColor }}>{matchPercent}%</span>
            </div>
          </div>

          {/* Axes Benchmark List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>Chi Tiết 5 Trục Năng Lực Nổi Bật:</span>
            {activeIndustry.axes.map((axis, idx) => {
              const uScore = axis.calculatedScore || 0;
              const isPassed = uScore >= axis.benchmark;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>{axis.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: isPassed ? '#059669' : '#d97706' }}>
                      {uScore}%
                    </span>
                    <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>/ {axis.benchmark}% benchmark</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
