import React, { useState, useEffect } from 'react';
import type { Milestone } from '../../types/roadmap';

interface AIRoadmapRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (newMilestones: any[]) => void;
}

export const AIRoadmapRecommendModal: React.FC<AIRoadmapRecommendModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      // Simulate AI loading
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mockSuggestedMilestones = [
    {
      title: "Advanced React & Next.js",
      description: "Master server-side rendering, routing, and full-stack capabilities with Next.js.",
      categoriesCount: 3
    },
    {
      title: "AI & Tools Integration",
      description: "Learn to integrate generative AI models and utilize Cursor/Copilot effectively.",
      categoriesCount: 2
    },
    {
      title: "System Architecture & Scaling",
      description: "Design scalable front-end architectures and micro-frontends.",
      categoriesCount: 4
    }
  ];

  const handleApply = () => {
    onApply(mockSuggestedMilestones);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">SkillPath AI Đề Xuất</h2>
              <p className="text-xs text-slate-500 font-medium">Tối ưu hóa lộ trình tương lai của bạn</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {isAnalyzing ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                <i className="fa-solid fa-robot absolute inset-0 flex items-center justify-center text-indigo-500 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-700 mb-2">AI đang phân tích tiến độ...</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Chúng tôi đang đánh giá kỹ năng hiện tại và xu hướng thị trường để thiết kế các chặng tiếp theo phù hợp nhất cho bạn.
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl mb-6 text-sm border border-emerald-100 flex gap-3">
                <i className="fa-solid fa-circle-check mt-0.5 text-emerald-500"></i>
                <p>
                  <strong>AI Đã tìm thấy hướng đi tối ưu!</strong> Dựa trên việc bạn đã nắm vững nền tảng, AI đề xuất thay thế các chặng tương lai bằng các kỹ năng chuyên sâu và tích hợp AI dưới đây để tăng sức cạnh tranh trên thị trường.
                </p>
              </div>

              <h4 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-xs">Lộ trình đề xuất</h4>
              
              <div className="space-y-4">
                {mockSuggestedMilestones.map((ms, idx) => (
                  <div key={idx} className="border border-indigo-100 rounded-xl p-4 bg-white shadow-sm flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm mb-1">{ms.title}</h5>
                      <p className="text-xs text-slate-500 mb-2">{ms.description}</p>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        Khoảng {ms.categoriesCount * 2} tuần
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            type="button" 
            onClick={handleApply}
            disabled={isAnalyzing}
            className="px-5 py-2 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isAnalyzing ? 'Đang phân tích...' : (
              <>
                <i className="fa-solid fa-check"></i> Áp dụng Lộ trình Mới
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
