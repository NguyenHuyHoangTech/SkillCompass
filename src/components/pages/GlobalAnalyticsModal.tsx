import React, { useMemo, useState } from 'react';
import { X, TrendingUp, Award, Target, BrainCircuit, Activity, ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import type { Milestone, SkillCategory } from '../../types/roadmap';
import { SpiderChart } from '../roadmap/SpiderChart';

interface GlobalAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: Milestone[];
}

export const GlobalAnalyticsModal: React.FC<GlobalAnalyticsModalProps> = ({
  isOpen,
  onClose,
  milestones,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const globalCategories = useMemo(() => {
    // 1. Extract all categories with their skills
    const categoryMap = new Map<string, { totalScore: number; count: number }>();

    milestones.forEach(ms => {
      ms.categories.forEach(cat => {
        cat.skills.forEach(skill => {
          const current = categoryMap.get(cat.name) || { totalScore: 0, count: 0 };
          current.totalScore += skill.levelPercentage;
          current.count += 1;
          categoryMap.set(cat.name, current);
        });
      });
    });

    // 2. Convert to pseudo SkillCategory array for SpiderChart
    const pseudoCategories: SkillCategory[] = [];
    const avgCategoryList: { name: string, score: number }[] = [];

    categoryMap.forEach((stats, name) => {
      const avgScore = Math.round(stats.totalScore / stats.count);
      avgCategoryList.push({ name, score: avgScore });
    });

    // Sort to keep chart stable
    avgCategoryList.sort((a, b) => b.score - a.score);

    // Group into one pseudo category so SpiderChart treats each as an axis
    if (avgCategoryList.length > 0) {
      pseudoCategories.push({
        id: 'global-cat',
        name: 'Toàn cầu',
        skills: avgCategoryList.map((c, idx) => ({
          id: `global-skill-${idx}`,
          name: c.name,
          levelPercentage: c.score,
          subTopics: [],
          requirements: []
        }))
      });
    }

    return { pseudoCategories, avgCategoryList };
  }, [milestones]);

  const { pseudoCategories, avgCategoryList } = globalCategories;

  const totalSkills = useMemo(() => milestones.flatMap(m => m.categories.flatMap(c => c.skills)).length, [milestones]);
  const completedSkills = useMemo(() => milestones.flatMap(m => m.categories.flatMap(c => c.skills)).filter(s => s.levelPercentage === 100).length, [milestones]);
  const overallProgress = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

  const topSkills = avgCategoryList.slice(0, 3);
  const bottomSkills = avgCategoryList.slice().reverse().slice(0, 3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 bg-gradient-to-r from-blue-900 to-blue-700 text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Thống kê Tổng thể (Global Analytics)</h2>
              <p className="text-blue-100 font-medium">Bức tranh toàn cảnh về hành trình phát triển kỹ năng của bạn</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 bg-slate-50 flex flex-col gap-8">
          
          {/* Top Section: Chart */}
          <div className="w-full shrink-0 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6 z-10 relative">
                <Target className="text-blue-500" size={20} />
                <h3 className="font-bold text-lg text-slate-800">Biểu đồ Phân tích Năng lực (Theo Mảng)</h3>
            </div>
            
            <div className="w-full min-h-[400px] flex items-center justify-center relative z-10 py-8 overflow-hidden" id="global-spider-chart">
                
                {/* Zoom Controls */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-50 bg-white/80 p-2 rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm">
                    <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Phóng to">
                        <ZoomIn size={18} />
                    </button>
                    <button onClick={handleResetZoom} className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Đặt lại">
                        <RotateCcw size={18} />
                    </button>
                    <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors" title="Thu nhỏ">
                        <ZoomOut size={18} />
                    </button>
                </div>

                {pseudoCategories.length > 0 ? (
                    <div className="w-full max-w-2xl mx-auto flex justify-center">
                        <SpiderChart 
                            categories={pseudoCategories} 
                            milestoneTitle="Tất cả chặng đường"
                            zoomLevel={zoomLevel}
                            hideUI={true}
                        />
                    </div>
                ) : (
                    <div className="text-slate-400">Chưa có dữ liệu kỹ năng để vẽ biểu đồ.</div>
                )}
            </div>

            {/* Decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-50 to-transparent opacity-50 pointer-events-none rounded-full blur-3xl"></div>
          </div>

          {/* Bottom Section: Stats */}
          <div className="w-full shrink-0 flex flex-col gap-6">
            
            {/* Master Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full border-8 border-blue-50 flex items-center justify-center relative shrink-0">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle 
                            cx="50%" cy="50%" r="42%" 
                            fill="none" stroke="#3b82f6" strokeWidth="8%" 
                            strokeDasharray={`${overallProgress * 2.64} 300`} 
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="text-xl font-bold text-slate-800">{overallProgress}%</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">Tiến độ Toàn lộ trình</h3>
                    <p className="text-slate-500 text-sm mb-3">Bạn đã hoàn thành <strong>{completedSkills}</strong> trên tổng số <strong>{totalSkills}</strong> kỹ năng trong toàn bộ kế hoạch.</p>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">
                            {completedSkills} Mastered
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
                            {totalSkills - completedSkills} In Progress
                        </span>
                    </div>
                </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4 text-emerald-600">
                        <Award size={20} />
                        <h4 className="font-bold">Mảng mạnh nhất</h4>
                    </div>
                    <div className="space-y-4">
                        {topSkills.map((cat, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
                                    <span className="line-clamp-1">{cat.name}</span>
                                    <span>{cat.score}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${cat.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {topSkills.length === 0 && <p className="text-sm text-slate-400">Chưa có dữ liệu</p>}
                    </div>
                </div>

                {/* Weaknesses */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4 text-amber-500">
                        <TrendingUp size={20} />
                        <h4 className="font-bold">Cần tập trung thêm</h4>
                    </div>
                    <div className="space-y-4">
                        {bottomSkills.map((cat, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
                                    <span className="line-clamp-1">{cat.name}</span>
                                    <span>{cat.score}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${cat.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {bottomSkills.length === 0 && <p className="text-sm text-slate-400">Chưa có dữ liệu</p>}
                    </div>
                </div>
            </div>


            {/* All Skills/Categories Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4 text-blue-600">
                    <Layers size={20} />
                    <h4 className="font-bold">Tổng quan tất cả các mảng kỹ năng</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                    {avgCategoryList.map((cat, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
                                <span className="line-clamp-1" title={cat.name}>{cat.name}</span>
                                <span>{cat.score}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${cat.score}%` }}></div>
                            </div>
                        </div>
                    ))}
                    {avgCategoryList.length === 0 && <p className="text-sm text-slate-400 col-span-full">Chưa có dữ liệu</p>}
                </div>
            </div>

            {/* AI Insights Placeholder */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6 mt-auto">
                <div className="flex items-center gap-2 mb-2 text-purple-700">
                    <BrainCircuit size={20} />
                    <h4 className="font-bold">AI Nhận xét</h4>
                </div>
                <p className="text-sm text-purple-800 leading-relaxed">
                    "Dựa trên biểu đồ Radar, bạn đang có thiên hướng phát triển mạnh về <strong>{topSkills[0]?.name || 'N/A'}</strong>. 
                    Để cân bằng và trở thành một Full-stack hoàn thiện, hãy ưu tiên các khóa học liên quan đến <strong>{bottomSkills[0]?.name || 'N/A'}</strong> trong chặng tiếp theo nhé!"
                </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
