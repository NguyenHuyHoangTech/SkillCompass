import React, { useState } from 'react';
import type { Milestone, Skill, SubTopic } from '../../types/roadmap';
import { Layers, Search, CheckCircle, Circle, Bot, Sparkles, Filter } from 'lucide-react';
import { IndustryRadarSection } from '../roadmap/IndustryRadarSection';

interface AllSkillsPageProps {
  milestones: Milestone[];
  onOpenQuiz: (skill: Skill, subTopic: SubTopic) => void;
  onToggleCheck: (skill: Skill, subTopic: SubTopic, completed: boolean) => void;
}

export const AllSkillsPage: React.FC<AllSkillsPageProps> = ({
  milestones,
  onOpenQuiz,
  onToggleCheck,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  // Calculate total stats
  const allSkills = milestones.flatMap((m) => m.categories.flatMap((c) => c.skills));
  const allSubTopics = allSkills.flatMap((s) => s.subTopics);
  const completedSubTopics = allSubTopics.filter((st) => st.isCompleted);
  const overallPercentage = allSubTopics.length > 0
    ? Math.round((completedSubTopics.length / allSubTopics.length) * 100)
    : 0;

  return (
    <div className="page-view-container">
      {/* 1. Header Banner */}
      <div className="page-header-banner glass-panel">
        <div className="page-title-group">
          <Layers size={28} className="page-title-icon" style={{ color: '#0284c7' }} />
          <div>
            <h2>Tất Cả Kỹ Năng Trong Lộ Trình</h2>
            <p>Tổng hợp toàn bộ {allSkills.length} kỹ năng và {allSubTopics.length} mục bài học cần làm chủ trên toàn bộ lộ trình của bạn.</p>
          </div>
        </div>

        <div className="all-skills-stats-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
          <div className="stat-pill" style={{ padding: '8px 14px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
            <span style={{ fontSize: '0.76rem', color: '#0369a1', fontWeight: 700 }}>Tổng Tiến Độ Kho Kỹ Năng:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7', marginLeft: '8px' }}>{overallPercentage}%</span>
          </div>
          <div className="stat-pill" style={{ padding: '8px 14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
            <span style={{ fontSize: '0.76rem', color: '#047857', fontWeight: 700 }}>Đã Hoàn Thành:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669', marginLeft: '8px' }}>{completedSubTopics.length}/{allSubTopics.length} Bài</span>
          </div>
        </div>
      </div>

      {/* 2. Sơ Đồ Mạng Nhện Năng Lực Theo Ngành Nghề */}
      <IndustryRadarSection milestones={milestones} />

      {/* 3. Controls Bar (Search & Filter) */}
      <div className="skills-controls-bar glass-panel" style={{ padding: '14px 20px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
        <div className="search-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Tìm kiếm kỹ năng hoặc bài học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', color: '#0f172a', width: '100%' }}
          />
        </div>

        <div className="filter-buttons-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748b" />
          <button
            className={`eval-action-btn ${filterStatus === 'all' ? 'btn-ai-re-evaluate' : 'btn-ai-propose'}`}
            onClick={() => setFilterStatus('all')}
          >
            Tất Cả ({allSubTopics.length})
          </button>

          <button
            className={`eval-action-btn ${filterStatus === 'completed' ? 'btn-ai-re-evaluate' : 'btn-ai-propose'}`}
            onClick={() => setFilterStatus('completed')}
          >
            Đã Học ({completedSubTopics.length})
          </button>

          <button
            className={`eval-action-btn ${filterStatus === 'pending' ? 'btn-ai-re-evaluate' : 'btn-ai-propose'}`}
            onClick={() => setFilterStatus('pending')}
          >
            Chưa Học ({allSubTopics.length - completedSubTopics.length})
          </button>
        </div>
      </div>

      {/* 3. Milestones & Skills Grid */}
      <div className="all-skills-list-wrapper" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {milestones.map((ms) => {
          const milestoneSkills = ms.categories.flatMap((c) => c.skills);

          // Filter by search query and status
          const filteredSkills = milestoneSkills.map((sk) => {
            const filteredSubs = sk.subTopics.filter((sub) => {
              const matchesSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sk.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesFilter = filterStatus === 'all' ? true :
                filterStatus === 'completed' ? sub.isCompleted : !sub.isCompleted;
              return matchesSearch && matchesFilter;
            });
            return { ...sk, subTopics: filteredSubs };
          }).filter((sk) => sk.subTopics.length > 0);

          if (filteredSkills.length === 0) return null;

          return (
            <div key={ms.id} className="category-card glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#0284c7" /> {ms.title}
                </h3>
                <span className="page-indicator-small-badge">{ms.badge}</span>
              </div>

              <div className="skills-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredSkills.map((skill) => (
                  <div key={skill.id} className="skill-item-card">
                    <div className="skill-card-top">
                      <span className="skill-title-wrap">{skill.name}</span>
                      <span className="skill-level-num">{skill.levelPercentage}%</span>
                    </div>

                    <div className="subtopic-list" style={{ marginTop: '12px' }}>
                      {skill.subTopics.map((subTopic) => (
                        <div key={subTopic.id} className={`subtopic-item ${subTopic.isCompleted ? 'completed' : ''}`}>
                          <div className="subtopic-left">
                            <button
                              className="check-toggle-btn"
                              onClick={() => onToggleCheck(skill, subTopic, !subTopic.isCompleted)}
                              title={subTopic.isCompleted ? 'Chưa học' : 'Đã học'}
                            >
                              {subTopic.isCompleted ? (
                                <CheckCircle size={18} className="check-icon-active" />
                              ) : (
                                <Circle size={18} className="check-icon-inactive" />
                              )}
                            </button>
                            <div className="subtopic-info">
                              <span className="subtopic-title">{subTopic.title}</span>
                              {subTopic.description && <span className="subtopic-desc">{subTopic.description}</span>}
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
                              title="Mở AI Coach hướng dẫn & kiểm tra bài tập"
                            >
                              <Bot size={15} />
                              <span>🤖 Làm Bài Test AI</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
