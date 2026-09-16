import React from 'react';
import type { Milestone } from '../../types/roadmap';
import { SpiderChart } from '../roadmap/SpiderChart';
import { BarChart3, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface AnalyticsPageProps {
  milestone: Milestone;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ milestone }) => {
  const { t } = useAppContext();

  return (
    <div className="page-view-container">
      <div className="page-header-banner glass-panel">
        <div className="page-title-group">
          <BarChart3 size={28} className="page-title-icon" style={{ color: 'var(--primary)' }} />
          <div>
            <h2>{t('analyticsTitle')}</h2>
            <p>{t('analyticsSubtitle')} - {milestone.title}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid" style={{ marginTop: '24px' }}>
        <aside className="dashboard-sidebar">
          <SpiderChart categories={milestone.categories} milestoneTitle={milestone.title} />
        </aside>

        <main className="dashboard-content">
          <div className="category-card glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
              <TrendingUp size={20} color="var(--primary)" /> {t('overallProgress')}
            </h3>
            <div className="eval-grid-columns">
              <div className="eval-col strengths">
                <div className="eval-col-title" style={{ color: 'var(--text-primary)' }}><Award size={16} /> {t('completedSkills')}</div>
                <ul style={{ color: 'var(--text-secondary)' }}>
                  <li>UI/UX Mindset & Don't Make Me Think (Score: 90%)</li>
                  <li>Advanced Flexbox & CSS Grid (Score: 90%)</li>
                </ul>
              </div>
              <div className="eval-col actions">
                <div className="eval-col-title" style={{ color: 'var(--text-primary)' }}><CheckCircle2 size={16} /> {t('totalExercises')}</div>
                <ul style={{ color: 'var(--text-secondary)' }}>
                  <li>Optimize WebP Images & CDN</li>
                  <li>Standardize Accessibility (A11y / WCAG)</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
