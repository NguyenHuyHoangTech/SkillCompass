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
  onClose?: () => void;
  onLearnSkill?: (skill: Skill) => void;
}

export const AllSkillsPage: React.FC<AllSkillsPageProps> = ({
  milestones,
  onOpenQuiz,
  onToggleCheck,
  onClose,
  onLearnSkill,
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
          onClose={onClose}
          onStarClick={(starData) => {
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
          onLearnSkill={onLearnSkill}
        />
      )}
    </div>
  );
};
