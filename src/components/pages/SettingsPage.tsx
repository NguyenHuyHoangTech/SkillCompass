import React from 'react';
import { Settings, User, Sliders } from 'lucide-react';

interface SettingsPageProps {
  userName: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ userName }) => {
  return (
    <div className="page-view-container">
      <div className="page-header-banner glass-panel">
        <div className="page-title-group">
          <Settings size={28} className="page-title-icon" />
          <div>
            <h2>Trang Cài Đặt Tài Khoản & Cấu Hình Hệ Thống</h2>
            <p>Tùy chỉnh thông tin cá nhân, theme giao diện và cấu hình kết nối AI API Backend</p>
          </div>
        </div>
      </div>

      <div className="settings-cards-grid" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="category-card glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7' }}>
            <User size={20} /> Thông Tin Hồ Sơ
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="input-label">Họ và tên người dùng:</label>
            <input type="text" className="chat-input-field" defaultValue={userName} style={{ borderRadius: '8px' }} />
            <label className="input-label">Mục tiêu sự nghiệp:</label>
            <input type="text" className="chat-input-field" defaultValue="Senior UI/UX & Frontend Specialist" style={{ borderRadius: '8px' }} />
            <button className="btn-primary" style={{ marginTop: '10px', width: 'max-content' }}>Lưu Thay Đổi</button>
          </div>
        </div>

        <div className="category-card glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7' }}>
            <Sliders size={20} /> Cấu Hình API Backend & Theme
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="input-label">VITE_API_BASE_URL (URL Backend):</label>
            <input type="text" className="chat-input-field" defaultValue="http://localhost:5000/api" style={{ borderRadius: '8px' }} />
            <label className="input-label">Chế độ giao diện (Theme):</label>
            <select className="answer-textarea" style={{ height: '42px', padding: '8px 12px' }}>
              <option value="light">Trắng Sáng Rực Rỡ (Clean Light Glassmorphism)</option>
              <option value="dark">Tối Hiện Đại (Neon Dark Glassmorphism)</option>
            </select>
            <button className="btn-primary" style={{ marginTop: '10px', width: 'max-content' }}>Lưu Cấu Hình</button>
          </div>
        </div>
      </div>
    </div>
  );
};
