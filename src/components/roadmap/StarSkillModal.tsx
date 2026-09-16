import React, { useEffect } from 'react';
import type { Skill, SubTopic } from '../../types/roadmap';
import { Star, CheckCircle, Circle, Bot, X, Sparkles, Award, Layers } from 'lucide-react';

interface StarSkillModalProps {
  skill: Skill | null;
  categoryName: string;
  milestoneTitle: string;
  onClose: () => void;
  onOpenQuiz: (skill: Skill, subTopic: SubTopic) => void;
  onToggleCheck: (skill: Skill, subTopic: SubTopic, completed: boolean) => void;
}

export const StarSkillModal: React.FC<StarSkillModalProps> = ({
  skill,
  categoryName,
  milestoneTitle,
  onClose,
  onOpenQuiz,
  onToggleCheck,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!skill) return null;

  const completedCount = skill.subTopics.filter((st) => st.isCompleted).length;
  const totalCount = skill.subTopics.length;
  const isFullyMastered = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="star-modal-backdrop" onClick={onClose}>
      <div className="star-skill-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header decoration glow */}
        <div className="star-modal-glow-top" />

        {/* Close Button */}
        <button className="star-modal-close-btn" onClick={onClose} title="Close modal (Esc)">
          <X size={20} />
        </button>

        {/* Skill Title Section */}
        <div className="star-modal-header">
          <div className={`star-avatar-badge ${isFullyMastered ? 'mastered' : ''}`}>
            <Star size={32} className="star-avatar-icon" fill={isFullyMastered ? '#fbbf24' : '#38bdf8'} />
            <Sparkles size={16} className="star-sparkle-mini" />
          </div>

          <div className="star-modal-title-wrap">
            <div className="star-tags-row">
              <span className="star-milestone-tag">
                <Layers size={13} style={{ marginRight: 4 }} /> {milestoneTitle}
              </span>
              <span className="star-cat-tag">{categoryName}</span>
            </div>
            <h2 className="star-skill-name">{skill.name}</h2>
            <p className="star-skill-desc">
              Skill star belonging to your roadmap milestone. Below is the list of exercises and completion status.
            </p>
          </div>
        </div>

        {/* Skill Progress Bar */}
        <div className="star-progress-card">
          <div className="star-progress-header">
            <span className="star-progress-title">
              <Award size={16} color="#0284c7" /> Skill Proficiency Level
            </span>
            <span className="star-progress-percentage">{skill.levelPercentage}%</span>
          </div>
          <div className="star-progress-track">
            <div
              className="star-progress-fill"
              style={{ width: `${skill.levelPercentage}%` }}
            />
          </div>
          <div className="star-progress-meta">
            <span>
              Completed <strong>{completedCount}/{totalCount}</strong> exercises
            </span>
            <span>{isFullyMastered ? '✨ Fully Mastered!' : '🚀 Training in progress'}</span>
          </div>
        </div>

        {/* Subtopics / Exercises List */}
        <div className="star-subtopics-section">
          <h3 className="star-subtopics-title">
            📝 List of Exercises & Learning Topics ({completedCount}/{totalCount})
          </h3>

          <div className="star-subtopics-list">
            {skill.subTopics.map((subTopic) => (
              <div
                key={subTopic.id}
                className={`star-subtopic-card ${subTopic.isCompleted ? 'completed' : ''}`}
              >
                <div className="star-subtopic-main">
                  <button
                    className="star-check-btn"
                    onClick={() => onToggleCheck(skill, subTopic, !subTopic.isCompleted)}
                    title={subTopic.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {subTopic.isCompleted ? (
                      <CheckCircle size={22} className="check-icon-active" />
                    ) : (
                      <Circle size={22} className="check-icon-inactive" />
                    )}
                  </button>

                  <div className="star-subtopic-info">
                    <div className="star-subtopic-head">
                      <span className="star-subtopic-name">{subTopic.title}</span>
                      {subTopic.isCompleted && (
                        <span className="done-badge-mini">✓ Done</span>
                      )}
                    </div>

                    {subTopic.description && (
                      <p className="star-subtopic-desc">{subTopic.description}</p>
                    )}

                    {subTopic.aiFeedback && (
                      <div className="star-ai-feedback-box">
                        <strong>🤖 AI Review:</strong> {subTopic.aiFeedback}
                      </div>
                    )}
                  </div>
                </div>

                <div className="star-subtopic-actions">
                  {subTopic.assessmentScore !== undefined && subTopic.assessmentScore > 0 && (
                    <span className={`star-score-badge ${subTopic.assessmentScore >= 70 ? 'pass' : 'review'}`}>
                      {subTopic.assessmentScore}% AI Score
                    </span>
                  )}

                  <button
                    className="star-quiz-btn"
                    onClick={() => {
                      onClose();
                      onOpenQuiz(skill, subTopic);
                    }}
                    title="Open AI Coach for testing & exercise guidance"
                  >
                    <Bot size={16} />
                    <span>🤖 Take AI Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="star-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
