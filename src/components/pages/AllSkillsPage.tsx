import React, { useState } from 'react';
import type { Milestone, Skill, SubTopic } from '../../types/roadmap';
import { Search, Layers, X, Sparkles, Filter } from 'lucide-react';
import { StarSphereCanvas } from '../roadmap/StarSphereCanvas';
import { StarSkillModal } from '../roadmap/StarSkillModal';
import { useAppContext } from '../../context/AppContext';

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
  const { t } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('all');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Modal State for Double-Clicked Star
  const [selectedStarData, setSelectedStarData] = useState<{
    skill: Skill;
    categoryName: string;
    milestoneTitle: string;
  } | null>(null);

  // Extract unique category/industry names across milestones
  const allSkills = milestones.flatMap((m) => m.categories.flatMap((c) => c.skills));
  const uniqueCategories = Array.from(
    new Set(milestones.flatMap((m) => m.categories.map((c) => c.name)))
  );

  // Sync latest skill data when modal is open
  const currentModalSkill = selectedStarData
    ? allSkills.find((s) => s.id === selectedStarData.skill.id) || selectedStarData.skill
    : null;

  // Skills filtered by selected industry category
  const categorySkills = selectedCategoryName === 'all' 
    ? [] 
    : milestones.flatMap(m => 
        m.categories
          .filter(c => c.name === selectedCategoryName)
          .flatMap(c => c.skills.map(s => ({ skill: s, milestoneTitle: m.title, categoryName: c.name })))
      );

  const totalCategorySkills = categorySkills.length;
  const completedCategorySkills = categorySkills.filter(item => {
    const comp = item.skill.subTopics.filter(st => st.isCompleted).length;
    return item.skill.subTopics.length > 0 && comp === item.skill.subTopics.length;
  }).length;

  return (
    <div className="all-skills-pure-space-page">
      {/* 1. Floating Search Bar (Top-Left) */}
      <div className="cosmic-top-left-search">
        <div className="cosmic-search-box glass-panel">
          <Search size={16} color="var(--primary)" className="search-icon" />
          <input
            type="text"
            placeholder={t('searchSkills')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cosmic-search-input"
          />
          {searchQuery && (
            <button className="cosmic-clear-btn" onClick={() => setSearchQuery('')} title="Clear">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 1.5. Floating Industry Learned Skills Drawer (When Category Filter Active) */}
      {selectedCategoryName !== 'all' && (
        <div className="cosmic-industry-skills-panel glass-panel">
          <div className="industry-panel-header">
            <div className="industry-title-wrap">
              <span className="industry-badge">🎯 {t('industry')}</span>
              <h3 className="industry-name-title">{selectedCategoryName}</h3>
            </div>
            <button 
              className="industry-panel-close"
              onClick={() => setSelectedCategoryName('all')}
              title="Show all categories"
            >
              <X size={16} />
            </button>
          </div>

          <div className="industry-panel-stats">
            <div className="industry-stat-bar-track">
              <div 
                className="industry-stat-bar-fill" 
                style={{ width: `${totalCategorySkills > 0 ? (completedCategorySkills / totalCategorySkills) * 100 : 0}%` }}
              />
            </div>
            <span className="industry-stat-text">
              Learned <strong>{completedCategorySkills}/{totalCategorySkills}</strong> skills ({totalCategorySkills > 0 ? Math.round((completedCategorySkills / totalCategorySkills) * 100) : 0}% Mastery)
            </span>
          </div>

          <div className="industry-skills-list custom-scrollbar">
            {categorySkills.map(({ skill, milestoneTitle, categoryName }) => {
              const completedCount = skill.subTopics.filter(st => st.isCompleted).length;
              const totalCount = skill.subTopics.length;
              const isMastered = totalCount > 0 && completedCount === totalCount;
              const inProgress = completedCount > 0 && !isMastered;

              return (
                <div 
                  key={skill.id} 
                  className={`industry-skill-item-card ${isMastered ? 'mastered' : inProgress ? 'in-progress' : ''}`}
                  onClick={() => setSelectedStarData({ skill, categoryName, milestoneTitle })}
                  title="Click to view details & exercises"
                >
                  <div className="ind-skill-info">
                    <span className="ind-skill-name">{skill.name}</span>
                    <span className="ind-skill-meta">
                      {milestoneTitle} • {completedCount}/{totalCount} exercises
                    </span>
                  </div>
                  
                  <div className="ind-skill-status">
                    {isMastered ? (
                      <span className="status-pill mastered">✅ Mastered</span>
                    ) : inProgress ? (
                      <span className="status-pill in-progress">⚡ {skill.levelPercentage}%</span>
                    ) : (
                      <span className="status-pill pending">⏳ 0%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Industry/Category Selector at BOTTOM-RIGHT EDGE */}
      <div className="cosmic-bottom-right-industry-wrap">
        {/* Expandable Industry Category Popover Menu */}
        {isCategoryMenuOpen && (
          <div className="cosmic-bottom-industry-menu glass-panel">
            <div className="cosmic-menu-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={14} color="var(--primary)" />
                <span>{t('selectCategory')}</span>
              </div>
              <button
                className="cosmic-menu-close-btn"
                onClick={() => setIsCategoryMenuOpen(false)}
                title={t('closeMenu')}
              >
                ×
              </button>
            </div>

            <div className="cosmic-menu-industry-list">
              <button
                className={`cosmic-right-industry-btn ${selectedCategoryName === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategoryName('all');
                  setIsCategoryMenuOpen(false);
                }}
              >
                <Layers size={14} style={{ marginRight: 6 }} />
                <span>{t('allCategories')}</span>
                <span className="cosmic-count-badge">{allSkills.length}</span>
              </button>

              {uniqueCategories.map((catName) => {
                const count = allSkills.filter((s) =>
                  milestones.some((m) =>
                    m.categories.some((c) => c.name === catName && c.skills.some((sk) => sk.id === s.id))
                  )
                ).length;

                return (
                  <button
                    key={catName}
                    className={`cosmic-right-industry-btn ${selectedCategoryName === catName ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategoryName(catName);
                      setIsCategoryMenuOpen(false);
                    }}
                    title={catName}
                  >
                    <Sparkles size={13} style={{ marginRight: 6, color: '#fbbf24' }} />
                    <span>{catName}</span>
                    {count > 0 && <span className="cosmic-count-badge">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom-Right Trigger Button */}
        <button
          className={`cosmic-industry-toggle-trigger-btn ${isCategoryMenuOpen || selectedCategoryName !== 'all' ? 'active' : ''}`}
          onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
          title="Select Industry"
        >
          <Filter size={15} />
          <span>
            {selectedCategoryName === 'all' ? t('allCategories') : `${t('industry')}: ${selectedCategoryName}`}
          </span>
          <span className="toggle-arrow-icon">{isCategoryMenuOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* 3D Sphere of Stars Canvas Viewport */}
      <div className="pure-space-canvas-wrapper">
        <StarSphereCanvas
          milestones={milestones}
          searchQuery={searchQuery}
          selectedCategoryName={selectedCategoryName}
          isAutoRotate={isAutoRotate}
          onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
          onStarDoubleClick={(starData) => {
            setSelectedStarData(starData);
          }}
        />
      </div>

      {/* Star Skill Detail Modal */}
      {selectedStarData && currentModalSkill && (
        <StarSkillModal
          skill={currentModalSkill}
          categoryName={selectedStarData.categoryName}
          milestoneTitle={selectedStarData.milestoneTitle}
          onClose={() => setSelectedStarData(null)}
          onOpenQuiz={onOpenQuiz}
          onToggleCheck={onToggleCheck}
        />
      )}
    </div>
  );
};
