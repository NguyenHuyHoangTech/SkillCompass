import React from 'react';
import type { SkillCategory, SubTopic, Skill } from '../../types/roadmap';
import { CheckCircle, Circle, Bot, Sparkles, Code, FileCode, GitBranch, Atom, Server, Zap, Database, Cpu } from 'lucide-react';

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
  // Helper icon renderer
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

                {/* Progress bar for skill */}
                <div className="skill-progress-bar">
                  <div
                    className="skill-progress-fill"
                    style={{ width: `${skill.levelPercentage}%` }}
                  />
                </div>

                {/* SubTopics Checklist */}
                <div className="subtopic-list">
                  <div className="subtopic-header-label">Các mục cần học ({skill.subTopics.filter(st => st.isCompleted).length}/{skill.subTopics.length}):</div>
                  {skill.subTopics.map((subTopic) => (
                    <div
                      key={subTopic.id}
                      className={`subtopic-item ${subTopic.isCompleted ? 'completed' : ''}`}
                    >
                      <div className="subtopic-left">
                        <button
                          className="check-toggle-btn"
                          onClick={() => onToggleCheck(skill, subTopic, !subTopic.isCompleted)}
                          title={subTopic.isCompleted ? 'Đánh dấu chưa học' : 'Đã học (Tự tích)'}
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

                      <div className="subtopic-actions">
                        {subTopic.assessmentScore !== undefined && subTopic.assessmentScore > 0 && (
                          <span className={`score-badge ${subTopic.assessmentScore >= 70 ? 'pass' : 'review'}`}>
                            {subTopic.assessmentScore}% AI Score
                          </span>
                        )}
                        <button
                          className="ai-quiz-trigger-btn"
                          onClick={() => onOpenQuiz(skill, subTopic)}
                        >
                          <Bot size={15} />
                          <span>AI Check & Test</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
