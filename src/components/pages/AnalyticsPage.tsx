import React from 'react';
import type { Milestone } from '../../types/roadmap';
import { SpiderChart } from '../roadmap/SpiderChart';
import { BarChart3, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

interface AnalyticsPageProps {
  milestone: Milestone;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ milestone }) => {
  return (
    <div className="page-view-container">
      <div className="page-header-banner glass-panel">
        <div className="page-title-group">
          <BarChart3 size={28} className="page-title-icon" />
          <div>
            <h2>Trang Thống Kê & Phân Tích Năng Lực Chuyên Sâu</h2>
            <p>Báo cáo chỉ số thành thạo chi tiết cho mốc: {milestone.title}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid" style={{ marginTop: '24px' }}>
        <aside className="dashboard-sidebar">
          <SpiderChart categories={milestone.categories} milestoneTitle={milestone.title} />
        </aside>

        <main className="dashboard-content">
          <div className="category-card glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#0284c7" /> Phân Tích Xu Hướng Năng Lực
            </h3>
            <div className="eval-grid-columns">
              <div className="eval-col strengths">
                <div className="eval-col-title"><Award size={16} /> Nhóm Kỹ Năng Xuất Sắc</div>
                <ul>
                  <li>UI/UX Mindset & Don't Make Me Think (Score: 90%)</li>
                  <li>Chuyên Sâu Flexbox & CSS Grid (Score: 90%)</li>
                </ul>
              </div>
              <div className="eval-col actions">
                <div className="eval-col-title"><CheckCircle2 size={16} /> Mục Tiêu Tiếp Theo</div>
                <ul>
                  <li>Tối ưu hóa hình ảnh WebP & CDN</li>
                  <li>Chuẩn hóa Accessibility (A11y / WCAG)</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
