import React from 'react';
import { Layers, CheckSquare, PieChart, Sparkles } from 'lucide-react';

interface HorizontalSubTabBarProps {
  activeSubTab: string;
  onSelectSubTab: (tab: string) => void;
}

export const HorizontalSubTabBar: React.FC<HorizontalSubTabBarProps> = ({
  activeSubTab,
  onSelectSubTab,
}) => {
  const tabs = [
    { id: 'view-all', label: 'Tổng Quan Đầy Đủ', icon: Layers },
    { id: 'view-checklist', label: 'Danh Sách Bài Học & Checklist', icon: CheckSquare },
    { id: 'view-radar', label: 'Biểu Đồ Mạng Nhện Năng Lực', icon: PieChart },
    { id: 'view-optimizer', label: 'AI Tối Ưu & Đánh Giá Giai Đoạn', icon: Sparkles },
  ];

  return (
    <div className="horizontal-sub-tab-bar glass-panel">
      <div className="horizontal-tabs-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`horizontal-sub-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSubTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
