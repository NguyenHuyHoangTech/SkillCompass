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
  GraduationCap,
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

      {/* 2. Overlay Drawer */}
      <aside className={`app-sidebar-nav-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header Drawer */}
        <div className="sidebar-drawer-header">
          <div className="drawer-title-group">
            <div className="drawer-logo-badge glowing-brand-logo">
              <Compass size={20} />
            </div>
            <div className="drawer-title-wrap">
              <span className="drawer-menu-title brand-title-glowing">{t('brandName')}</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose} title="Close menu">
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
            <span className="menu-btn-label">Career Roadmap</span>
            <span className="menu-btn-badge">Main</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activePage === 'page-all-skills' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-all-skills');
              onClose();
            }}
          >
            <Layers size={20} className="menu-btn-icon" />
            <span className="menu-btn-label">All Skills</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activePage === 'page-quiz-lib' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-quiz-lib');
              onClose();
            }}
          >
            <BookOpenCheck size={20} className="menu-btn-icon" />
            <span className="menu-btn-label">Exercises & AI Quizzes</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activePage === 'page-courses' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-courses');
              onClose();
            }}
          >
            <GraduationCap size={20} className="menu-btn-icon" />
            <span className="menu-btn-label">Course Library</span>
            <span className="menu-btn-badge" style={{ background: '#3b82f6', color: 'white' }}>New</span>
          </button>
        </nav>

        {/* Lower Section */}
        <div className="sidebar-footer-container">
          {/* AI Advisor Button */}
          <button
            className="sidebar-menu-btn career-ai-btn sidebar-lower-ai-btn featured-ai-btn"
            onClick={() => {
              onOpenCareerChat();
              onClose();
            }}
          >
            <Sparkles size={20} className="menu-btn-icon spark" />
            <span className="menu-btn-label">Future AI Advisor</span>
          </button>

          {/* Account Action Popup Menu */}
          {isAccountMenuOpen && (
            <div className="sidebar-account-dropdown glass-panel">
              <div className="acc-dropdown-header">
                <span className="acc-user-name">{userName}</span>
                <span className="acc-user-status">🟢 Online</span>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-menu-item"
                onClick={() => {
                  alert('Change account information feature');
                  setIsAccountMenuOpen(false);
                  onClose();
                }}
              >
                <UserPlus size={16} />
                <span>Change Account / Profile</span>
              </button>
              <button
                className="dropdown-menu-item"
                onClick={() => {
                  alert('Log in with another account');
                  setIsAccountMenuOpen(false);
                }}
              >
                <LogIn size={16} />
                <span>Log in with Another Account</span>
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-menu-item logout"
                onClick={() => {
                  alert('Logged out successfully');
                  setIsAccountMenuOpen(false);
                }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}

          {/* User Card */}
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
              title="Account Settings & Login / Logout"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
