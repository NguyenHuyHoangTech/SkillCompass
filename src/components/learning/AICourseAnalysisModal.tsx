import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import type { Skill } from '../../types/roadmap';

interface AICourseAnalysisModalProps {
  isOpen: boolean;
  skill: Skill | null;
  onAnalysisComplete: () => void;
}

export const AICourseAnalysisModal: React.FC<AICourseAnalysisModalProps> = ({
  isOpen,
  skill,
  onAnalysisComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(onAnalysisComplete, 400); // Short delay before closing
            return 100;
          }
          return p + Math.floor(Math.random() * 15) + 5;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen, onAnalysisComplete]);

  if (!isOpen || !skill) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 shadow-2xl shadow-blue-900/20 rounded-2xl w-full max-w-md p-8 text-center relative overflow-hidden">
        {/* Glowing Background Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-blue-900/50 rounded-full flex items-center justify-center mb-6 relative">
            <BrainCircuit className="text-blue-400 w-10 h-10 animate-pulse" />
            <div className="absolute inset-0 border-2 border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-amber-400 w-5 h-5" />
            AI đang phân tích
          </h3>
          
          <p className="text-slate-300 text-sm mb-8">
            Đang tìm kiếm các khóa học tốt nhất cho kỹ năng <br/>
            <strong className="text-blue-400 text-base">{skill.name}</strong>...
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-slate-500 text-xs text-right w-full">{progress}%</p>
        </div>
      </div>
    </div>
  );
};
