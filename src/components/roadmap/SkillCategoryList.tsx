import React from 'react';
import type { SkillCategory, SubTopic, Skill } from '../../types/roadmap';
import { CheckCircle, Circle, Bot, Sparkles, Code, FileCode, GitBranch, Atom, Server, Zap, Database, Cpu, ExternalLink, BookOpen } from 'lucide-react';

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
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Code': return <Code size={20} className="skill-icon" />;
      case 'FileCode': return <FileCode size={20} className="skill-icon" />;
      case 'GitBranch': return <GitBranch size={20} className="skill-icon" />;
      case 'Atom': return <Atom size={20} className="skill-icon" />;
      case 'Server': return <Server size={20} className="skill-icon" />;
      case 'Zap': return <Zap size={20} className="skill-icon" />;
      case 'Database': return <Database size={20} className="skill-icon" />;
      case 'Cpu': return <Cpu size={20} className="skill-icon" />;
      default: return <Sparkles size={20} className="skill-icon" />;
    }
  };

  return (
    <div className="skill-category-list">
      {categories.map((cat) => (
        <div key={cat.id} className="category-card glass-panel">
          <div className="category-header">
            <div className="cat-title-badge">
              <span className="cat-dot"></span>
              <h3>{cat.name}</h3>
            </div>
            {cat.description && <p className="cat-desc">{cat.description}</p>}
          </div>

          <div className="skills-grid">
            {cat.skills.map((skill) => (
              <div key={skill.id} className="skill-item-card">
                <div className="skill-card-top">
                  <div className="skill-title-wrap">
                    {renderIcon(skill.icon)}
                    <span className="skill-name">{skill.name}</span>
                  </div>
                  <div className="skill-level-badge">
                    <span className="skill-level-num">{skill.levelPercentage}%</span>
                  </div>
                </div>

                <div className="skill-progress-bar">
                  <div
                    className="skill-progress-fill"
                    style={{ width: `${skill.levelPercentage}%` }}
                  />
                </div>

                <div className="subtopic-list">
                  <div className="subtopic-header-label">Topics to learn ({skill.subTopics.filter(st => st.isCompleted).length}/{skill.subTopics.length}):</div>
                  {skill.subTopics.map((subTopic) => {
                    const courseraUrl = subTopic.courseraUrl || `https://www.coursera.org/search?query=${encodeURIComponent(subTopic.title + ' ' + skill.name)}`;
                    return (
                      <div
                        key={subTopic.id}
                        className={`subtopic-item ${subTopic.isCompleted ? 'completed' : ''}`}
                      >
                        <div className="subtopic-left">
                          <button
                            className="check-toggle-btn"
                            onClick={() => onToggleCheck(skill, subTopic, !subTopic.isCompleted)}
                            title={subTopic.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {subTopic.isCompleted ? (
                              <CheckCircle size={18} className="check-icon-active" />
                            ) : (
                              <Circle size={18} className="check-icon-inactive" />
                            )}
                          </button>
                          <div className="subtopic-info">
                            <span className="subtopic-title">{subTopic.title}</span>
                            {subTopic.description && (
                              <span className="subtopic-desc">{subTopic.description}</span>
                            )}
                          </div>
                        </div>

                        <div className="subtopic-actions flex items-center gap-2">
                          {subTopic.assessmentScore !== undefined && subTopic.assessmentScore > 0 && (
                            <span className={`score-badge ${subTopic.assessmentScore >= 70 ? 'pass' : 'review'}`}>
                              {subTopic.assessmentScore}% AI Score
                            </span>
                          )}

                          <a
                            href={courseraUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="coursera-link-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 font-bold text-xs transition-all shadow-xs no-underline"
                            title={`Learn "${subTopic.title}" on Coursera`}
                          >
                            <BookOpen size={13} />
                            <span>Coursera</span>
                            <ExternalLink size={11} className="opacity-80" />
                          </a>

                          <button
                            className="ai-quiz-trigger-btn"
                            onClick={() => onOpenQuiz(skill, subTopic)}
                            title="Open AI Coach guidance & quiz test"
                          >
                            <Bot size={15} />
                            <span>🤖 Take AI Quiz</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
