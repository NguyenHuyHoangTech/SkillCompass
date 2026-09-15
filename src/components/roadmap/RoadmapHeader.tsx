import React, { useState, useEffect } from 'react';
import type { Milestone } from '../../types/roadmap';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface RoadmapHeaderProps {
  milestones: Milestone[];
  activeMilestoneId: string;
  onSelectMilestone: (id: string) => void;
  onOpenCareerChat?: () => void;
}

export const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({
  milestones,
  activeMilestoneId,
  onSelectMilestone,
  onOpenCareerChat,
}) => {
  const currentMilestone = milestones.find((m) => m.id === activeMilestoneId) || milestones[0];

  // Mỗi trang hiển thị chính xác 4 mốc
  const ITEMS_PER_PAGE = 4;
  const maxPage = Math.max(0, Math.ceil(milestones.length / ITEMS_PER_PAGE) - 1);
  const [currentPage, setCurrentPage] = useState(0);

  // Tự động chuyển trang nếu mốc active đang nằm ở trang khác
  useEffect(() => {
    const activeIndex = milestones.findIndex((m) => m.id === activeMilestoneId);
    if (activeIndex !== -1) {
      const pageForActive = Math.floor(activeIndex / ITEMS_PER_PAGE);
      if (pageForActive !== currentPage) {
        setCurrentPage(pageForActive);
      }
    }
  }, [activeMilestoneId, milestones]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(maxPage, prev + 1));
  };

  // Cắt danh sách 4 mốc tương ứng cho trang hiện tại
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const visibleMilestones = milestones.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Hàm lọc bỏ tiền tố "Giai Đoạn X:" trùng lặp để tên mốc hiển thị gọn gàng, tinh tế
  const getShortTitle = (fullTitle: string) => {
    return fullTitle.replace(/^Giai\s*Đoạn\s*\d+:\s*/i, '').trim();
  };

  return (
    <header className="roadmap-header-container glass-panel">
      {/* 1. Active Milestone Banner (Mốc Đang Hiển Thị Ở NẰM TRÊN) */}
      <div className="milestone-banner">
        <div className="banner-left">
          <div className="role-chip">
            <Award size={16} /> Mốc Hiện Tại: {currentMilestone.roleName}
          </div>
          <h2 className="banner-heading">{currentMilestone.title}</h2>
          <p className="banner-desc">{currentMilestone.description}</p>
        </div>

        <div className="banner-right-progress">
          <div className="circular-progress-wrap">
            <div className="progress-value-text">
              <span className="percent-num">{currentMilestone.overallProgress}%</span>
              <span className="percent-label">Hoàn Thành</span>
            </div>
            <svg className="circular-svg" viewBox="0 0 100 100">
              <circle className="circle-bg" cx="50" cy="50" r="42" />
              <circle
                className="circle-fill"
                cx="50"
                cy="50"
                r="42"
                style={{
                  strokeDasharray: 264,
                  strokeDashoffset: 264 - (264 * currentMilestone.overallProgress) / 100,
                }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Milestone Navigation Row: Grid khít sát tuyệt đối không hở khoảng trắng thừa */}
      <div className="milestone-nav-row">
        {/* Nút Thêm Mốc Cố Định Ở Đầu */}
        {onOpenCareerChat && (
          <button
            className="milestone-tab-btn add-future-milestone-btn fixed-add-btn"
            onClick={onOpenCareerChat}
            title="Tư vấn AI để đưa ra thêm mốc lộ trình tương lai"
            data-tooltip="🤖 Tư vấn AI thêm mốc mới"
          >
            <span className="tab-step-num add-icon-num">+</span>
            <div className="tab-text-content">
              <span className="tab-badge-title">🤖 AI Career</span>
              <span className="tab-title">+ Thêm Mốc Mới</span>
            </div>
          </button>
        )}

        {/* Mũi tên TRÁI: Đặt sát bên phải nút Thêm Mốc */}
        <button
          className={`milestone-nav-arrow-btn ${currentPage === 0 ? 'disabled' : ''}`}
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          title="Trang 4 mốc trước"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Khung 4 mốc phủ kín 100% không để lại khoảng hở */}
        <div className="milestone-tabs-4col-wrapper">
          <div className="milestone-tabs-4col-grid">
            {visibleMilestones.map((ms, vIdx) => {
              const actualIndex = startIndex + vIdx;
              const isActive = ms.id === activeMilestoneId;
              return (
                <button
                  key={ms.id}
                  className={`milestone-tab-btn full-tab ${isActive ? 'active' : 'minimal-tab'}`}
                  onClick={() => onSelectMilestone(ms.id)}
                  title={ms.title}
                  data-tooltip={ms.title}
                >
                  <span className="tab-step-num">{actualIndex + 1}</span>
                  <div className="tab-text-content">
                    <span className="tab-badge-title">{ms.badge}</span>
                    <span className="tab-title">{getShortTitle(ms.title)}</span>
                  </div>
                  <div className="tab-progress-indicator">
                    <div
                      className="tab-progress-fill"
                      style={{ width: `${ms.overallProgress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mũi tên PHẢI: Đặt sát bên phải mốc thứ 4 */}
        <button
          className={`milestone-nav-arrow-btn ${currentPage >= maxPage ? 'disabled' : ''}`}
          onClick={handleNextPage}
          disabled={currentPage >= maxPage}
          title="Trang 4 mốc tiếp theo"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* 3. Chỉ số trang 1/4 nhỏ nằm sát bên dưới ở mép phải */}
      <div className="milestone-sub-page-row">
        <span className="page-indicator-small-badge" title={`Trang ${currentPage + 1} / ${maxPage + 1}`}>
          {currentPage + 1}/{maxPage + 1}
        </span>
      </div>
    </header>
  );
};
