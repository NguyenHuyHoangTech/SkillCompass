import React, { useState, useRef, useEffect } from 'react';
import { Compass, User, LogIn, UserPlus, LogOut, ChevronDown, Sparkles, Layers, CheckSquare, PieChart, Moon, Sun, Globe } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { AiConfigMenu } from '../ai/AiConfigMenu';

interface TopNavbarProps {
  userName: string;
  activePage: string;
  activeSubTab?: string;
  onSelectSubTab?: (tabId: string) => void;
  onSelectPage?: (pageId: string) => void;
  onToggleSidebar?: () => void;
  onOpenCareerChat?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  userName,
  activePage,
  activeSubTab = 'view-all',
  onSelectSubTab,
  onToggleSidebar,
  onOpenCareerChat,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { theme, setTheme, language, setLanguage, t } = useAppContext();

  const roadmapSubTabs = [
    { id: 'view-all', label: 'Full Overview', icon: Layers },
    { id: 'view-checklist', label: 'Skill Checklist', icon: CheckSquare },
    { id: 'view-radar', label: 'Radar Chart', icon: PieChart },
    { id: 'view-optimizer', label: 'AI Phase Evaluation', icon: Sparkles },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-navbar-fixed">
      <div className="top-nav-container">
        {/* Left: Brand Logo & Highlighted Web Name */}
        <div className="top-nav-brand">
          <button
            className="top-brand-unified-btn"
            onClick={onToggleSidebar}
            title="Open management & navigation menu"
          >
            <div className="top-nav-logo-unified glowing-brand-logo">
              <Compass size={24} className="logo-compass-icon" />
            </div>
            <div className="top-nav-title-wrap">
              <span className="top-brand-name brand-title-glowing">{t('brandName')}</span>
            </div>
          </button>
        </div>

        {/* Center: Horizontal Sub-Tabs inside Header for Section Navigation within Page */}
        {activePage === 'page-roadmap' && onSelectSubTab && (
          <nav className="top-nav-center-subtabs">
            {roadmapSubTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`top-header-subtab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectSubTab(tab.id)}
                  title={`Jump to: ${tab.label}`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Onboarding Steps Portal Target */}
        {activePage === 'page-onboarding' && (
          <div id="onboarding-step-portal-target" className="top-nav-center-subtabs" style={{ display: 'flex', alignItems: 'center' }}></div>
        )}

        {/* Right: Featured AI Button & User Dropdown Menu */}
        <div className="top-nav-auth-actions" ref={dropdownRef}>
          {/* Quick Language Toggle */}
          <button 
            className="top-icon-btn"
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            title={t('language')}
          >
            <Globe size={18} />
            <span style={{ marginLeft: 4, fontSize: 12, fontWeight: 'bold' }}>{language.toUpperCase()}</span>
          </button>

          {/* Quick Theme Toggle */}
          <button 
            className="top-icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={t('theme')}
            style={{ marginRight: 8 }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {onOpenCareerChat && (
            <button
              className="top-header-ai-featured-btn"
              onClick={onOpenCareerChat}
              title="Open Future Career AI Advisor"
            >
              <Sparkles size={15} className="ai-btn-spark" />
              <span>{t('aiAdvisor')}</span>
            </button>
          )}

          <AiConfigMenu />

          {isLoggedIn ? (
            <div className="user-dropdown-wrapper">
              <button
                className="top-nav-user-profile-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="top-user-avatar">
                  <User size={18} />
                </div>
                <div className="top-user-meta">
                  <span className="top-user-name">{userName}</span>
                </div>
                <ChevronDown
                  size={15}
                  className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="user-profile-dropdown-menu glass-panel">
                  <div className="dropdown-user-header">
                    <span className="dd-user-name">{userName}</span>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogIn size={16} />
                    <span>Log in with Another Account</span>
                  </button>

                  <button
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <UserPlus size={16} />
                    <span>Register New Account</span>
                  </button>

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-menu-item logout"
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-group">
              <button
                className="btn-auth-login"
                onClick={() => setIsLoggedIn(true)}
              >
                <LogIn size={15} />
                <span>Log In</span>
              </button>
              <button
                className="btn-auth-register"
                onClick={() => setIsLoggedIn(true)}
              >
                <UserPlus size={15} />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
