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
            <h2>Account Settings & System Configuration</h2>
            <p>Customize personal information and Backend API connections</p>
          </div>
        </div>
      </div>

      <div className="settings-cards-grid" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="category-card glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7' }}>
            <User size={20} /> Profile Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="input-label">Full Name:</label>
            <input type="text" className="chat-input-field" defaultValue={userName} style={{ borderRadius: '8px' }} />
            <label className="input-label">Career Goal:</label>
            <input type="text" className="chat-input-field" defaultValue="Senior UI/UX & Frontend Specialist" style={{ borderRadius: '8px' }} />
            <button className="btn-primary" style={{ marginTop: '10px', width: 'max-content' }}>Save Changes</button>
          </div>
        </div>

        <div className="category-card glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7' }}>
            <Sliders size={20} /> Backend API Config
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="input-label">VITE_API_BASE_URL (Backend URL):</label>
            <input type="text" className="chat-input-field" defaultValue="http://localhost:5000/api" style={{ borderRadius: '8px' }} />
            <button className="btn-primary" style={{ marginTop: '10px', width: 'max-content' }}>Save Configuration</button>
          </div>
        </div>
      </div>
    </div>
  );
};
