import React, { useRef } from 'react';
import type { Milestone } from '../../types/roadmap';

interface RoadmapHeaderProps {
  milestones: Milestone[];
  activeMilestoneId: string;
  onSelectMilestone: (id: string) => void;
  onEditMilestone?: (milestone: Milestone) => void;
  onDeleteMilestone?: (id: string) => void;
  onAddMilestone?: () => void;
  onForceCompleteMilestone?: (id: string) => void;
}

export const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({
  milestones,
  activeMilestoneId,
  onSelectMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onAddMilestone,
  onForceCompleteMilestone
}) => {
  const getMockDateRange = (idx: number, categoriesCount: number) => {
    const start = new Date(2026, 8, 1); // 1st Sep 2026 base
    start.setDate(start.getDate() + idx * 30);
    const end = new Date(start);
    end.setDate(start.getDate() + Math.max(1, categoriesCount) * 14);
    
    const format = (d: Date) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${format(start)} - ${format(end)}`;
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-6 px-6 md:pt-8 md:px-8 bg-white pb-2 relative group">
        
        {/* Left Scroll Button */}
        <button 
            onClick={scrollLeft}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 shadow-md rounded-full items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 z-10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            title="Scroll Left"
        >
            <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>

        {/* Right Scroll Button */}
        <button 
            onClick={scrollRight}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 shadow-md rounded-full items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 z-10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            title="Scroll Right"
        >
            <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>

        <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 custom-scrollbar relative"
        >
            <div className="flex items-stretch gap-4 min-w-max px-2 py-2">
                {milestones.map((ms, idx) => {
                    const firstUncompletedIndex = milestones.findIndex(m => m.overallProgress < 100 && !m.isForceCompleted);
                    const isSelected = ms.id === activeMilestoneId;
                    const isCompleted = ms.overallProgress === 100 || ms.isForceCompleted;
                    const isRunning = idx === (firstUncompletedIndex === -1 ? milestones.length - 1 : firstUncompletedIndex);
                    const progress = ms.overallProgress || 0;
                    
                    let statusColors = '';
                    let iconClass = '';
                    let statusText = '';
                    
                    if(isCompleted) {
                        statusColors = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                        iconClass = 'fa-solid fa-circle-check text-emerald-500';
                        statusText = `Complete (${progress}%)`;
                    } else if(isRunning) {
                        statusColors = 'bg-blue-50 text-slate-800 border-blue-200 shadow-md shadow-blue-100';
                        iconClass = 'fa-solid fa-person-running text-blue-500 animate-pulse';
                        statusText = `${progress}%`;
                    } else {
                        statusColors = 'bg-white border-slate-200 text-slate-400 opacity-80';
                        iconClass = 'fa-regular fa-calendar-check text-slate-300';
                        statusText = `${progress}%`;
                    }

                    const ringClass = isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : '';
                    
                    // Clean title from existing Stage/Milestone prefixes if any
                    const cleanTitle = ms.title.replace(/^(Stage|Stage|Milestone|Milestone)\s*\d+[:\-]?\s*/i, '');
                    
                    return (
                        <div 
                            key={ms.id}
                            onClick={() => onSelectMilestone(ms.id)}
                            className={`shrink-0 w-64 rounded-xl border p-4 cursor-pointer transition-all hover:-translate-y-1 relative group flex flex-col ${statusColors} ${ringClass}`}
                        >
                            {/* Action Buttons Overlay */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                {(!isCompleted && onForceCompleteMilestone) && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onForceCompleteMilestone(ms.id); }}
                                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-emerald-600 border border-emerald-100 transition-colors"
                                      title="Mark this milestone complete"
                                    >
                                      <i className="fa-solid fa-check-double text-[10px]"></i>
                                    </button>
                                )}
                                {(!isCompleted && onEditMilestone) && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onEditMilestone(ms); }}
                                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-blue-600 border border-blue-100 transition-colors"
                                      title="Edit Milestone"
                                    >
                                      <i className="fa-solid fa-pen text-[10px]"></i>
                                    </button>
                                )}
                                {(!isCompleted && !isRunning && onDeleteMilestone) && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onDeleteMilestone(ms.id); }}
                                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-red-500 border border-red-100 transition-colors"
                                      title="Delete Milestone"
                                    >
                                      <i className="fa-solid fa-trash text-[10px]"></i>
                                    </button>
                                )}
                            </div>

                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm bg-white shadow-sm`}>
                                    <i className={iconClass}></i>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white shadow-sm ${isCompleted ? 'text-emerald-600' : 'text-slate-600'}`}>
                                    {statusText}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-sm mb-1 line-clamp-2 leading-snug pr-8" title={ms.title}>
                                Stage {idx + 1}: {cleanTitle}
                            </h3>
                            
                            <p className={`text-[11px] mb-3 line-clamp-2 ${isCompleted || isRunning ? 'opacity-90' : 'text-slate-400'}`} title={ms.description}>
                                {ms.description}
                            </p>
                            
                            <div className={`mt-auto text-[10px] font-medium pt-3 border-t ${statusColors.includes('bg-white') ? 'border-slate-100' : 'border-slate-200'}`}>
                                <i className="fa-regular fa-calendar mr-1"></i> 
                                {(ms.startDate && ms.endDate) 
                                    ? `${new Date(ms.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${new Date(ms.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}` 
                                    : getMockDateRange(idx, ms.categories.length)}
                            </div>
                            
                            {/* Connect line to next card */}
                            {idx < milestones.length - 1 && (
                                <div className={`absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-[2px] ${isCompleted ? 'bg-emerald-300' : isRunning ? 'bg-blue-300' : 'bg-slate-200'}`}></div>
                            )}
                        </div>
                    );
                })}

                {/* Manual Add Button */}
                {onAddMilestone && (
                    <div className="relative h-full flex">
                        {(milestones.length > 0) && (
                             <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-slate-200"></div>
                        )}
                        <div 
                            onClick={onAddMilestone}
                            className="shrink-0 w-32 flex-1 rounded-xl border border-dashed border-slate-300 bg-white p-4 cursor-pointer transition-all hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50/30 flex flex-col justify-center items-center group min-h-[140px]"
                            title="Add a Milestone Manually"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-500 text-slate-400 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                                <i className="fa-solid fa-plus"></i>
                            </div>
                            <h3 className="font-bold text-[11px] text-slate-500 group-hover:text-blue-600">Add Manually</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
