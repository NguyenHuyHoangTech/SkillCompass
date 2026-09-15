import React from 'react';
import type { Milestone, Skill, SubTopic } from '../../types/roadmap';
import { BookOpenCheck, Bot, Sparkles, HelpCircle } from 'lucide-react';

interface QuizLibraryPageProps {
  milestones: Milestone[];
  onOpenQuiz: (skill: Skill, subTopic: SubTopic) => void;
}

export const QuizLibraryPage: React.FC<QuizLibraryPageProps> = ({ milestones, onOpenQuiz }) => {
  return (
    <div className="page-view-container">
      <div className="page-header-banner glass-panel">
        <div className="page-title-group">
          <BookOpenCheck size={28} className="page-title-icon" />
          <div>
            <h2>Trang Thư Viện Bài Test AI Quiz</h2>
            <p>Tổng hợp tất cả câu hỏi phỏng vấn & bài test kiểm tra năng lực kỹ năng theo chuẩn 3 Giai Đoạn</p>
          </div>
        </div>
      </div>

      <div className="quiz-library-grid" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {milestones.map((ms) => (
          <div key={ms.id} className="category-card glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7' }}>
              <Sparkles size={20} /> {ms.title}
            </h3>

            <div className="skills-grid">
              {ms.categories.flatMap((c) => c.skills).map((sk) => (
                <div key={sk.id} className="skill-item-card">
                  <div className="skill-card-top">
                    <span className="skill-name" style={{ fontWeight: 700 }}>{sk.name}</span>
                    <span className="skill-level-num">{sk.levelPercentage}%</span>
                  </div>

                  <div className="subtopic-list" style={{ marginTop: '12px' }}>
                    {sk.subTopics.map((sub) => (
                      <div key={sub.id} className="subtopic-item">
                        <div className="subtopic-left">
                          <HelpCircle size={18} color="#0284c7" />
                          <span className="subtopic-title">{sub.title}</span>
                        </div>
                        <button
                          className="ai-quiz-trigger-btn"
                          onClick={() => onOpenQuiz(sk, sub)}
                        >
                          <Bot size={15} />
                          <span>Làm Bài Test AI</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
