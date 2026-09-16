import React, { useState } from 'react';
import type { SkillCategory, SubTopic, Skill } from '../../types/roadmap';

interface SkillCategoryListProps {
  categories: SkillCategory[];
  onOpenQuiz: (skill: Skill, subTopic: SubTopic) => void;
  onToggleCheck: (skill: Skill, subTopic: SubTopic, completed: boolean) => void;
}

export const SkillCategoryList: React.FC<SkillCategoryListProps> = ({
  categories,
  onOpenQuiz,
  onToggleCheck,
}) => {
  // Flatten skills with their category name attached
  const allSkills = categories.flatMap(cat => 
    cat.skills.map(skill => ({ ...skill, categoryName: cat.name }))
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">

      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-layer-group text-blue-500 dark:text-cyan-400"></i> Essential Skills
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {allSkills.map((skill) => {
          const isAI = skill.categoryName.includes('AI') || skill.categoryName.includes('AI-Era');
          const badgeClass = isAI 
            ? 'bg-purple-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/40' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            
          const isSkillCompleted = skill.levelPercentage === 100;
          const isSkillInProgress = skill.levelPercentage > 0 && skill.levelPercentage < 100;
          
          return (
            <div key={skill.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
                {isAI && <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500 opacity-5 rounded-bl-[100px]"></div>}
                
                <div className="flex justify-between items-start mb-2">
                    <span 
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider truncate max-w-[210px] ${badgeClass}`}
                      title={skill.categoryName}
                    >
                      {skill.categoryName.replace(/^[0-9.\s&]+/, '').trim() || skill.categoryName}
                    </span>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[11px] font-semibold ${isSkillCompleted ? 'text-emerald-500 dark:text-emerald-400' : (isSkillInProgress ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500')}`}>
                          {isSkillCompleted ? '100% Certified' : (skill.levelPercentage > 0 ? `Completed ${skill.levelPercentage}%` : '0%')}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isSkillCompleted ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-blue-500 dark:bg-cyan-500'}`}
                          style={{ width: `${skill.levelPercentage}%` }}
                        />
                      </div>
                    </div>
                </div>
                
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-3">{skill.name}</h4>
                
                <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-3 mb-4 border border-slate-100 dark:border-slate-800/80 flex-1 max-h-[280px] overflow-y-auto custom-scrollbar space-y-3">
                    {skill.subTopics.map(st => (
                      <div key={st.id} className="flex items-start gap-2.5 group/st">
                          <input 
                            type="checkbox" 
                            className="mt-1 rounded text-blue-600 cursor-pointer accent-blue-600 dark:accent-cyan-500 w-4 h-4 shrink-0" 
                            checked={st.isCompleted} 
                            onChange={() => onToggleCheck(skill, st, !st.isCompleted)}
                          />
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-sm font-medium ${st.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                  {st.title}
                                </span>
                                {st.assessmentScore !== undefined && st.assessmentScore > 0 && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${st.assessmentScore >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-200 dark:border-amber-800'}`}>
                                    🎯 {st.assessmentScore}% AI Score
                                  </span>
                                )}
                              </div>

                              {st.description && (
                                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed bg-white dark:bg-slate-900/90 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 shadow-xs">
                                  <span className="flex items-center gap-1.5">
                                    <i className="fa-solid fa-circle-info text-blue-500 dark:text-cyan-400 text-[11px] shrink-0"></i>
                                    <span>{st.description}</span>
                                  </span>
                                </div>
                              )}

                              <div className="mt-1.5 flex items-center gap-2">
                                {st.isCompleted ? (
                                  <button
                                    type="button"
                                    onClick={() => onOpenQuiz(skill, st)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/80 transition-all cursor-pointer shadow-xs"
                                    title="Bấm để luyện tập / ôn lại bài test AI này"
                                  >
                                    <i className="fa-solid fa-check-double text-emerald-500"></i>
                                    <span>Practiced</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => onOpenQuiz(skill, st)}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-cyan-400 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-750 px-2.5 py-1 rounded-lg border border-blue-200/80 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
                                    title="Bấm để bắt đầu luyện tập với AI"
                                  >
                                    <i className="fa-solid fa-robot text-blue-500 dark:text-cyan-400"></i>
                                    <span>Luyện tập AI</span>
                                  </button>
                                )}
                              </div>
                          </div>
                      </div>
                    ))}
                    {skill.subTopics.length === 0 && (
                      <span className="text-sm text-slate-400 dark:text-slate-500 italic">No specific tasks yet</span>
                    )}
                </div>

                {(() => {
                  const getFallbackCourseLink = (name: string): CourseLink => {
                    const lower = name.toLowerCase();
                    if (lower.includes('ux') || lower.includes('ui') || lower.includes('design')) {
                      return { title: 'Google UX Design Professional Certificate', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-ux-design' };
                    }
                    if (lower.includes('react') || lower.includes('frontend') || lower.includes('html') || lower.includes('javascript') || lower.includes('css')) {
                      return { title: 'Meta Front-End Developer Certificate', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' };
                    }
                    if (lower.includes('git') || lower.includes('github')) {
                      return { title: 'Version Control with Git', provider: 'Coursera', url: 'https://www.coursera.org/learn/version-control-with-git' };
                    }
                    if (lower.includes('ai') || lower.includes('prompt') || lower.includes('llm')) {
                      return { title: 'Generative AI for Everyone (Andrew Ng)', provider: 'Coursera', url: 'https://www.coursera.org/learn/generative-ai-for-everyone' };
                    }
                    return { title: `${name} Professional Certificate`, provider: 'Coursera', url: `https://www.coursera.org/search?query=${encodeURIComponent(name)}` };
                  };

                  const course = (skill.courseLinks && skill.courseLinks.length > 0)
                    ? skill.courseLinks[0]
                    : getFallbackCourseLink(skill.name);

                  return (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                        <i className="fa-solid fa-graduation-cap text-indigo-500 mr-1"></i> RECOMMENDED COURSE:
                      </span>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 transition-all font-semibold shadow-xs group/link max-w-full"
                        title={`Bấm để tới khóa học ${course.title} trên ${course.provider}`}
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0"></i>
                        <span className="truncate">{course.title}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-200/60 dark:bg-indigo-800/60 text-indigo-800 dark:text-indigo-200 font-bold shrink-0">
                          {course.provider}
                        </span>
                      </a>
                    </div>
                  );
                })()}
            </div>
          );
        })}
      </div>
    </div>
  );
};
