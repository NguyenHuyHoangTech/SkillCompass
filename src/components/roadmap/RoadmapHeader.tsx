import React from 'react';
import type { Milestone } from '../../types/roadmap';

interface RoadmapHeaderProps {
  milestones: Milestone[];
  activeMilestoneId: string;
  onSelectMilestone: (id: string) => void;
  onOpenCareerChat?: () => void;
  onEditMilestone?: (milestone: Milestone) => void;
  onDeleteMilestone?: (id: string) => void;
  onAddMilestone?: () => void;
  onForceCompleteMilestone?: (id: string) => void;
}

export const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({
  milestones,
  activeMilestoneId,
  onSelectMilestone,
  onOpenCareerChat,
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
    
    const format = (d: Date) => d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${format(start)} - ${format(end)}`;
  };

  return (
    <div className="pt-6 px-6 md:pt-8 md:px-8 bg-white dark:bg-slate-900 pb-2">
        <div className="overflow-x-auto pb-4 custom-scrollbar relative">
            <div className="flex items-stretch gap-4 min-w-max px-2 py-2">
                {milestones.map((ms, idx) => {
                    const firstUncompletedIndex = milestones.findIndex(m => m.overallProgress < 100 && !m.isForceCompleted);
                    const isSelected = ms.id === activeMilestoneId;
                    const isCompleted = ms.overallProgress === 100 || ms.isForceCompleted;
                    const isRunning = idx === (firstUncompletedIndex === -1 ? milestones.length - 1 : firstUncompletedIndex);
                    const isFuture = !isCompleted && !isRunning;
                    const progress = isFuture ? 0 : ms.overallProgress;
                    
                    let statusColors = '';
                    let iconClass = '';
                    let statusText = '';
                    
                    if(isCompleted) {
                        statusColors = 'bg-emerald-50 dark:bg-slate-900/90 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40';
                        iconClass = 'fa-solid fa-circle-check text-emerald-500 dark:text-emerald-400';
                        statusText = `Complete (${progress}%)`;
                    } else if(isRunning) {
                        statusColors = 'bg-blue-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-blue-200 dark:border-cyan-500/50 shadow-md shadow-blue-100 dark:shadow-cyan-950/40';
                        iconClass = 'fa-solid fa-person-running text-blue-500 dark:text-cyan-400 animate-pulse';
                        statusText = `${progress}%`;
                    } else {
                        statusColors = 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 opacity-80';
                        iconClass = 'fa-regular fa-calendar-check text-slate-300 dark:text-slate-600';
                        statusText = '0%';
                    }

                    const selectedClass = isSelected 
                      ? 'border-2 border-blue-600 dark:border-cyan-400 ring-4 ring-blue-500/25 dark:ring-cyan-400/30 shadow-lg scale-[1.02] z-20 !opacity-100' 
                      : 'border-slate-200 dark:border-slate-800 opacity-90 hover:opacity-100';
                    
                    // Clean title from existing Stage/Milestone prefixes if any
                    const cleanTitle = ms.title.replace(/^(Stage|Giai đoạn|Mốc|Milestone)\s*\d+[:\-]?\s*/i, '');
                    
                    return (
                        <div 
                            key={ms.id}
                            onClick={() => onSelectMilestone(ms.id)}
                            className={`shrink-0 w-64 rounded-xl border p-3.5 cursor-pointer transition-all hover:-translate-y-1 relative group flex flex-col ${statusColors} ${selectedClass}`}
                        >
                            {/* Selected Badge */}
                            {isSelected && (
                              <div className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950 text-[9px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1 z-20">
                                <i className="fa-solid fa-eye text-[8px]"></i> Viewing Stage
                              </div>
                            )}

                            {/* Action Buttons Overlay */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                {(isRunning && onForceCompleteMilestone) && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onForceCompleteMilestone(ms.id); }}
                                      className="w-6 h-6 rounded-full bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 shadow flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-slate-700 transition-colors"
                                      title="Mark stage as completed"
                                    >
                                      <i className="fa-solid fa-check-double text-[9px]"></i>
                                    </button>
                                )}
                                {(!isCompleted && onEditMilestone) && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onEditMilestone(ms); }}
                                      className="w-6 h-6 rounded-full bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 shadow flex items-center justify-center text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                                      title="Edit stage"
                                    >
                                      <i className="fa-solid fa-pen text-[9px] text-slate-900 dark:text-slate-200"></i>
                                    </button>
                                )}
                                {(isFuture && onDeleteMilestone) && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onDeleteMilestone(ms.id); }}
                                      className="w-6 h-6 rounded-full bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 shadow flex items-center justify-center text-red-500 dark:text-red-400 border border-red-100 dark:border-slate-700 transition-colors"
                                      title="Delete stage"
                                    >
                                      <i className="fa-solid fa-trash text-[9px]"></i>
                                    </button>
                                )}
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm`}>
                                    <i className={iconClass}></i>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {statusText}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-xs mb-1 line-clamp-1 leading-snug pr-6 text-slate-900 dark:text-slate-100" title={ms.title}>
                                Stage {idx + 1}: {cleanTitle}
                            </h3>
                            
                            <p className={`text-[10px] mb-2 line-clamp-1 ${isCompleted || isRunning ? 'opacity-90 text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`} title={ms.description}>
                                {ms.description}
                            </p>
                            
                            <div className={`mt-auto text-[10px] font-medium pt-2 border-t ${statusColors.includes('bg-white') ? 'border-slate-100 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800'}`}>
                                <i className="fa-regular fa-calendar mr-1"></i> 
                                {(ms.startDate && ms.endDate) 
                                    ? `${new Date(ms.startDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${new Date(ms.endDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}` 
                                    : getMockDateRange(idx, ms.categories.length)}
                            </div>
                            
                            {/* Connect line to next card */}
                            {idx < milestones.length - 1 && (
                                <div className={`absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-[2px] ${isCompleted ? 'bg-emerald-300 dark:bg-emerald-600' : isRunning ? 'bg-blue-300 dark:bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                            )}
                        </div>
                    );
                })}

                {/* AI Add Milestone Button */}
                {onOpenCareerChat && (
                    <div className="relative flex">
                        {milestones.length > 0 && (
                             <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-slate-200 dark:bg-slate-700"></div>
                        )}
                        <div 
                            onClick={onOpenCareerChat}
                            className="shrink-0 w-64 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/40 bg-indigo-50/50 dark:bg-slate-800/80 p-3.5 cursor-pointer transition-all hover:-translate-y-1 hover:border-indigo-400 flex flex-col justify-center items-center group"
                            title="Consult AI to propose future roadmap milestones"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 flex items-center justify-center text-sm mb-1.5 transition-transform group-hover:scale-110">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <h3 className="font-bold text-xs text-indigo-700 dark:text-cyan-300 mb-0.5">AI Suggestion</h3>
                            <p className="text-[10px] text-indigo-500/80 dark:text-slate-400 text-center px-2">Evaluate & optimize future roadmap</p>
                        </div>
                    </div>
                )}
                
                {/* Manual Add Button */}
                {onAddMilestone && (
                    <div className="relative flex">
                        {(milestones.length > 0 || onOpenCareerChat) && (
                             <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-slate-200 dark:bg-slate-700"></div>
                        )}
                        <div 
                            onClick={onAddMilestone}
                            className="shrink-0 w-32 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 cursor-pointer transition-all hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50/30 flex flex-col justify-center items-center group"
                            title="Add stage manually"
                        >
                            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-slate-600 group-hover:text-blue-500 dark:group-hover:text-cyan-400 text-slate-400 dark:text-slate-300 flex items-center justify-center text-xs mb-1.5 transition-transform group-hover:scale-110">
                                <i className="fa-solid fa-plus"></i>
                            </div>
                            <h3 className="font-bold text-[10px] text-slate-500 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400">Add Manually</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
