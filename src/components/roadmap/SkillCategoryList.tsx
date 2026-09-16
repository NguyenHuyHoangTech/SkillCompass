import React from 'react';
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

      <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-layer-group text-blue-500"></i> Các Kỹ năng Cần thiết
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {allSkills.map((skill) => {
          const isAI = skill.categoryName.includes('AI') || skill.categoryName.includes('AI-Era');
          const badgeClass = isAI 
            ? 'bg-purple-100 text-purple-700 border-purple-200' 
            : 'bg-slate-100 text-slate-600 border-slate-200';
            
          const isSkillCompleted = skill.levelPercentage === 100;
          const isSkillInProgress = skill.levelPercentage > 0 && skill.levelPercentage < 100;
          
          return (
            <div key={skill.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
                {isAI && <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500 opacity-5 rounded-bl-[100px]"></div>}
                
                <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider ${badgeClass}`}>
                      {skill.categoryName}
                    </span>
                    <div className="flex flex-col items-end gap-1.5 mt-1">
                      <span className={`text-[11px] font-semibold ${isSkillCompleted ? 'text-emerald-500' : (isSkillInProgress ? 'text-blue-600' : 'text-slate-400')}`}>
                          {isSkillCompleted ? 'Chứng chỉ 100%' : (skill.levelPercentage > 0 ? `Hoàn thành ${skill.levelPercentage}%` : '0%')}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isSkillCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${skill.levelPercentage}%` }}
                        />
                      </div>
                    </div>
                </div>
                
                <h4 className="font-bold text-slate-800 text-lg mb-1">{skill.name}</h4>
                {skill.requirements && skill.requirements.length > 0 && (
                  <ul className="text-[11px] text-slate-500 mb-3 list-disc list-inside space-y-0.5">
                    {skill.requirements.map((req, idx) => (
                      <li key={idx} className="line-clamp-1" title={req}>{req}</li>
                    ))}
                  </ul>
                )}
                
                <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 flex-1 max-h-[160px] overflow-y-auto hide-scrollbar">
                    {skill.subTopics.map(st => (
                      <div key={st.id} className="flex items-start gap-2 mb-2 group">
                          <input 
                            type="checkbox" 
                            className="mt-1 rounded text-blue-600 cursor-pointer" 
                            checked={st.isCompleted} 
                            onChange={() => onToggleCheck(skill, st, !st.isCompleted)}
                          />
                          <div className="flex-1">
                              <span className={`text-sm font-medium ${st.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {st.title}
                              </span>
                              {st.isCompleted && (
                                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                                  <i className="fa-solid fa-check-double mr-1"></i>Đã thực hành
                                </p>
                              )}
                          </div>
                      </div>
                    ))}
                    {skill.subTopics.length === 0 && (
                      <span className="text-sm text-slate-400 italic">Chưa có nhiệm vụ cụ thể</span>
                    )}
                </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
