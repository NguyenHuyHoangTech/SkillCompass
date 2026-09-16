import React, { useState } from 'react';
import {
  Compass,
  Map,
  Sparkles,
  Wand2,
  X,
  Layers,
  BookOpenCheck,
  UserCheck,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
  PieChart
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface SidebarNavProps {
  userName: string;
  activePage: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (page: string) => void;
  onOpenCareerChat: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  userName,
  activePage,
  isOpen,
  onClose,
  onSelectPage,
  onOpenCareerChat,
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const { t } = useAppContext();

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <div
        className={`sidebar-backdrop-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => {
          setIsAccountMenuOpen(false);
          onClose();
        }}
      />

      {/* 2. Drawer */}
      <aside className={`app-sidebar-nav-drawer ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-drawer-header">
          <div className="drawer-title-group">
            <div className="drawer-logo-badge glowing-brand-logo">
              <Compass size={20} />
            </div>
            <div className="drawer-title-wrap">
              <span className="drawer-menu-title brand-title-glowing">{t('brandName')}</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose} title={t('closeMenu')}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-menu-list">
          <button
            className={`sidebar-menu-btn ${activePage === 'page-onboarding' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-onboarding');
              onClose();
            }}
          >
            <Wand2 size={20} className="menu-btn-icon" style={{ color: 'var(--primary)' }} />
            <span className="menu-btn-label">Tạo Lộ Trình AI</span>
            <span className="menu-btn-badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>New</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activePage === 'page-roadmap' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-roadmap');
              onClose();
            }}
          >
            <Map size={20} className="menu-btn-icon" />
            <span className="menu-btn-label">{t('roadmap')}</span>
            <span className="menu-btn-badge">{t('mainTab')}</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activePage === 'page-all-skills' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-all-skills');
              onClose();
            }}
          >
            <Layers size={20} className="menu-btn-icon" />
            <span className="menu-btn-label">{t('allSkills')}</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activePage === 'page-quiz-lib' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-quiz-lib');
              onClose();
            }}
          >
            <BookOpenCheck size={20} className="menu-btn-icon" />
            <span className="menu-btn-label">{t('exerciseLib')}</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activePage === 'page-analytics' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-analytics');
              onClose();
            }}
          >
            <PieChart size={20} className="menu-btn-icon" />
            <span className="menu-btn-label">{t('analytics')}</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activePage === 'page-settings' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-settings');
              onClose();
            }}
          >
            <Settings size={20} className="menu-btn-icon" />
            <span className="menu-btn-label">{t('settings')}</span>
          </button>
        </nav>

        {/* Lower Section */}
        <div className="sidebar-footer-container">
          <button
            className="sidebar-menu-btn career-ai-btn sidebar-lower-ai-btn featured-ai-btn"
            onClick={() => {
              onOpenCareerChat();
              onClose();
            }}
          >
            <Sparkles size={20} className="menu-btn-icon spark" />
            <span className="menu-btn-label">{t('aiAdvisor')}</span>
          </button>

          {isAccountMenuOpen && (
            <div className="sidebar-account-dropdown glass-panel">
              <div className="acc-dropdown-header">
                <span className="acc-user-name">{userName}</span>
                <span className="acc-user-status">{t('activeStatus')}</span>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-menu-item"
                onClick={() => {
                  onSelectPage('page-settings');
                  setIsAccountMenuOpen(false);
                  onClose();
                }}
              >
                <UserPlus size={16} />
                <span>{t('profile')}</span>
              </button>
              <button
                className="dropdown-menu-item"
                onClick={() => setIsAccountMenuOpen(false)}
              >
                <LogIn size={16} />
                <span>{t('subAccountLogin')}</span>
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-menu-item logout"
                onClick={() => setIsAccountMenuOpen(false)}
              >
                <LogOut size={16} />
                <span>{t('logout')}</span>
              </button>
            </div>
          )}

          <div className="sidebar-user-card">
            <div className="user-card-left">
              <div className="sidebar-user-avatar">
                <UserCheck size={18} />
              </div>
              <span className="sidebar-user-name">{userName}</span>
            </div>

            <button
              className={`sidebar-settings-btn ${isAccountMenuOpen ? 'active' : ''}`}
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              title={t('settings')}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
