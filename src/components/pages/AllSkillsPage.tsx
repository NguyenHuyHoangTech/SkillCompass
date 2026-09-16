import React, { useState } from 'react';
import type { Milestone, Skill, SubTopic } from '../../types/roadmap';
import { Search, Layers, X, Sparkles, Filter } from 'lucide-react';
import { StarSphereCanvas } from '../roadmap/StarSphereCanvas';
import { StarSkillModal } from '../roadmap/StarSkillModal';

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
          <Search size={16} color="#38bdf8" className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm ngôi sao kỹ năng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cosmic-search-input"
          />
          {searchQuery && (
            <button className="cosmic-clear-btn" onClick={() => setSearchQuery('')} title="Xóa tìm kiếm">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Industry/Category Selector at BOTTOM-RIGHT EDGE (Mép dưới bên phải) - Pops up when clicked */}
      <div className="cosmic-bottom-right-industry-wrap">
        {/* Expandable Industry Category Popover Menu */}
        {isCategoryMenuOpen && (
          <div className="cosmic-bottom-industry-menu glass-panel">
            <div className="cosmic-menu-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={14} color="#38bdf8" />
                <span>CHỌN NGÀNH KỸ NĂNG</span>
              </div>
              <button
                className="cosmic-menu-close-btn"
                onClick={() => setIsCategoryMenuOpen(false)}
                title="Đóng menu"
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
                <span>Tất Cả Ngành</span>
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
                    title={`Thắp sáng tất cả kỹ năng thuộc ${catName}`}
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
          title="Nhấn để chọn & thắp sáng ngành kỹ năng"
        >
          <Filter size={15} />
          <span>
            {selectedCategoryName === 'all' ? 'Chọn Ngành Kỹ Năng' : `Ngành: ${selectedCategoryName}`}
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

      {/* Star Skill Detail Modal (Triggered on Double-Clicking any star) */}
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
