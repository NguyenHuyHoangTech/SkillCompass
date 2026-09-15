import React, { useState } from 'react';
import {
  Compass,
  Map,
  Sparkles,
  X,
  UserCheck,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react';

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

  return (
    <>
      {/* 1. Backdrop Overlay làm mờ & làm tối phần bên dưới khi menu đẩy ra */}
      <div
        className={`sidebar-backdrop-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => {
          setIsAccountMenuOpen(false);
          onClose();
        }}
      />

      {/* 2. Thanh Tab Dọc Đẩy Ra (Overlay Drawer) */}
      <aside className={`app-sidebar-nav-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header Drawer: Ghi tên trang web "Skill Compass AI" nổi bật */}
        <div className="sidebar-drawer-header">
          <div className="drawer-title-group">
            <div className="drawer-logo-badge glowing-brand-logo">
              <Compass size={20} />
            </div>
            <div className="drawer-title-wrap">
              <span className="drawer-menu-title brand-title-glowing">Skill Compass AI</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose} title="Đóng menu">
            <X size={20} />
          </button>
        </div>

        {/* Navigation List: Chỉ giữ lại mục Lộ Trình Career */}
        <nav className="sidebar-menu-list">
          <button
            className={`sidebar-menu-btn ${activePage === 'page-roadmap' ? 'active' : ''}`}
            onClick={() => {
              onSelectPage('page-roadmap');
              onClose();
            }}
          >
            <Map size={20} className="menu-btn-icon" />
            <span className="menu-btn-label">Lộ Trình Career</span>
            <span className="menu-btn-badge">Chính</span>
          </button>
        </nav>

        {/* Lower Section & Sidebar Footer User Card */}
        <div className="sidebar-footer-container">
          {/* Nút AI Advisor Tương Lai */}
          <button
            className="sidebar-menu-btn career-ai-btn sidebar-lower-ai-btn featured-ai-btn"
            onClick={() => {
              onOpenCareerChat();
              onClose();
            }}
          >
            <Sparkles size={20} className="menu-btn-icon spark" />
            <span className="menu-btn-label">AI Advisor Tương Lai</span>
          </button>

          {/* Account Action Popup Menu khi bấm vào icon Cài Đặt */}
          {isAccountMenuOpen && (
            <div className="sidebar-account-dropdown glass-panel">
              <div className="acc-dropdown-header">
                <span className="acc-user-name">{userName}</span>
                <span className="acc-user-status">🟢 Đang Hoạt Động</span>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-menu-item"
                onClick={() => {
                  alert('Chức năng thay đổi thông tin tài khoản');
                  setIsAccountMenuOpen(false);
                }}
              >
                <UserPlus size={16} />
                <span>Thay Đổi Tài Khoản / Hồ Sơ</span>
              </button>
              <button
                className="dropdown-menu-item"
                onClick={() => {
                  alert('Đăng nhập tài khoản mới');
                  setIsAccountMenuOpen(false);
                }}
              >
                <LogIn size={16} />
                <span>Đăng Nhập Tài Khoản Phụ</span>
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-menu-item logout"
                onClick={() => {
                  alert('Đã đăng xuất tài khoản');
                  setIsAccountMenuOpen(false);
                }}
              >
                <LogOut size={16} />
                <span>Đăng Xuất</span>
              </button>
            </div>
          )}

          {/* User Card ở dưới cùng với Icon Setting ⚙️ */}
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
              title="Cài đặt tài khoản & Đăng nhập / Đăng xuất"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
