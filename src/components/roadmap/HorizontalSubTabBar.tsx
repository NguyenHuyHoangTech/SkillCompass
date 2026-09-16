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
    { id: 'view-all', label: 'Full Overview', icon: Layers },
    { id: 'view-checklist', label: 'Lesson List & Checklist', icon: CheckSquare },
    { id: 'view-radar', label: 'Capability Spider Chart', icon: PieChart },
    { id: 'view-optimizer', label: 'AI Optimization & Evaluation', icon: Sparkles },
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
