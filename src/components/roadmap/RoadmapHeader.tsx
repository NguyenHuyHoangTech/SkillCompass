import React, { useState, useEffect } from 'react';
import type { Milestone } from '../../types/roadmap';
import { Award, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

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

  // Hàm ngắn gọn hóa tên mốc theo từ khóa và chỉ hiển thị 1 lần duy nhất
  const getAbbreviatedTitle = (fullTitle: string, index: number) => {
    let clean = fullTitle.replace(/^(Giai\s*Đoạn|Mốc|Stage|Phase)\s*\d+\s*[:\-]?\s*/i, '').trim();

    if (/nền\s*tảng/i.test(clean)) clean = 'Nền tảng';
    else if (/kỹ\s*thuật/i.test(clean)) clean = 'Kỹ thuật';
    else if (/tối\s*ưu/i.test(clean)) clean = 'Tối ưu';
    else if (/nâng\s*cao|kiến\s*trúc/i.test(clean)) clean = 'Nâng cao';
    else if (/chuyên\s*sâu/i.test(clean)) clean = 'Chuyên sâu';
    else if (/triển\s*khai/i.test(clean)) clean = 'Triển khai';
    else {
      const noBrackets = clean.replace(/\(.*?\)/g, '').trim();
      const words = noBrackets.split(/\s+/);
      clean = words.length > 2 ? words.slice(0, 2).join(' ') : noBrackets || clean;
    }

    return `Mốc ${index + 1}: ${clean}`;
  };

  return (
    <header className="roadmap-header-container glass-panel">
      {/* 1. Active Milestone Banner */}
      <div className="milestone-banner">
        <div className="banner-left">
          <div className="role-chip">
            <Award size={15} /> Mốc Hiện Tại: {currentMilestone.roleName}
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

      {/* 2. Milestone Navigation Row: Single clean milestone label per tab */}
      <div className="milestone-nav-row">
        {/* Nút Thêm Mốc Cố Định */}
        {onOpenCareerChat && (
          <button
            className="milestone-tab-btn add-future-milestone-btn fixed-add-btn"
            onClick={onOpenCareerChat}
            title="Tư vấn AI để đưa ra thêm mốc lộ trình tương lai"
          >
            <span className="tab-step-num add-icon-num">+</span>
            <div className="tab-text-content">
              <span className="tab-badge-title">🤖 AI Career</span>
              <span className="tab-title">+ Thêm Mốc</span>
            </div>
          </button>
        )}

        {/* Mũi tên TRÁI */}
        <button
          className={`milestone-nav-arrow-btn ${currentPage === 0 ? 'disabled' : ''}`}
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          title="Trang 4 mốc trước"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Khung 4 mốc thoáng đãng */}
        <div className="milestone-tabs-4col-wrapper">
          <div className="milestone-tabs-4col-grid">
            {visibleMilestones.map((ms, vIdx) => {
              const actualIndex = startIndex + vIdx;
              const isActive = ms.id === activeMilestoneId;
              const isCompleted = ms.overallProgress === 100;
              const shortTitle = getAbbreviatedTitle(ms.title, actualIndex);

              return (
                <div key={ms.id} className="milestone-tab-item-wrap">
                  <button
                    className={`milestone-tab-btn full-tab ${isActive ? 'active' : 'minimal-tab'}`}
                    onClick={() => onSelectMilestone(ms.id)}
                  >
                    <div className="tab-single-main-row">
                      <span className="tab-short-title">{shortTitle}</span>
                      <div className="tab-meta-right">
                        {isCompleted ? (
                          <CheckCircle2 size={13} className="ms-status-icon completed" />
                        ) : isActive ? (
                          <span className="ms-status-dot active" />
                        ) : (
                          <span className="ms-status-dot standard" />
                        )}
                        <span className="tab-percent-badge">{ms.overallProgress}%</span>
                      </div>
                    </div>

                    <div className="tab-progress-indicator">
                      <div
                        className="tab-progress-fill"
                        style={{ width: `${ms.overallProgress}%` }}
                      />
                    </div>
                  </button>

                  {/* Tooltip nổi đầy đủ thông tin khi Hover */}
                  <div className="milestone-hover-tooltip">
                    <div className="tooltip-title">{ms.title}</div>
                    <div className="tooltip-role">{ms.badge} • {ms.roleName}</div>
                    <div className="tooltip-desc">{ms.description}</div>
                    <div className="tooltip-progress">Tiến độ mốc: <strong>{ms.overallProgress}%</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mũi tên PHẢI */}
        <button
          className={`milestone-nav-arrow-btn ${currentPage >= maxPage ? 'disabled' : ''}`}
          onClick={handleNextPage}
          disabled={currentPage >= maxPage}
          title="Trang 4 mốc tiếp theo"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 3. Chỉ số trang */}
      <div className="milestone-sub-page-row">
        <span className="page-indicator-small-badge" title={`Trang ${currentPage + 1} / ${maxPage + 1}`}>
          Trang {currentPage + 1}/{maxPage + 1}
        </span>
      </div>
    </header>
  );
};

