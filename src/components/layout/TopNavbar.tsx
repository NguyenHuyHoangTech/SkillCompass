import React, { useState, useRef, useEffect } from 'react';
import { Compass, User, LogIn, UserPlus, LogOut, ChevronDown, Sparkles, Layers, CheckSquare, PieChart } from 'lucide-react';

interface TopNavbarProps {
  userName: string;
  activePage: string;
  activeSubTab?: string;
  onSelectSubTab?: (tabId: string) => void;
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

  const roadmapSubTabs = [
    { id: 'view-all', label: 'Tổng Quan Đầy Đủ', icon: Layers },
    { id: 'view-checklist', label: 'Checklist Kỹ Năng', icon: CheckSquare },
    { id: 'view-radar', label: 'Biểu Đồ Radar Năng Lực', icon: PieChart },
    { id: 'view-optimizer', label: 'AI Đánh Giá Giai Đoạn', icon: Sparkles },
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
            title="Mở menu quản lý & điều hướng"
          >
            <div className="top-nav-logo-unified glowing-brand-logo">
              <Compass size={24} className="logo-compass-icon" />
            </div>
            <div className="top-nav-title-wrap">
              <span className="top-brand-name brand-title-glowing">Skill Compass AI</span>
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
                  title={`Nhảy đến mục: ${tab.label}`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Featured AI Button & User Dropdown Menu */}
        <div className="top-nav-auth-actions" ref={dropdownRef}>
          {onOpenCareerChat && (
            <button
              className="top-header-ai-featured-btn"
              onClick={onOpenCareerChat}
              title="Mở AI Advisor Tư Vấn Tương Lai"
            >
              <Sparkles size={15} className="ai-btn-spark" />
              <span>AI Advisor</span>
            </button>
          )}

          {isLoggedIn ? (
            <div className="user-dropdown-wrapper">
              {/* Clickable Profile Badge */}
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

              {/* Sổ ra Dropdown Menu */}
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
                    <span>Đăng Nhập Tài Khoản Phụ</span>
                  </button>

                  <button
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <UserPlus size={16} />
                    <span>Đăng Ký Tài Khoản Mới</span>
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
                    <span>Đăng Xuất</span>
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
                <span>Đăng Nhập</span>
              </button>
              <button
                className="btn-auth-register"
                onClick={() => setIsLoggedIn(true)}
              >
                <UserPlus size={15} />
                <span>Đăng Ký</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
