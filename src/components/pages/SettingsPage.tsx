import React, { useState } from 'react';
import { Settings, User, Sliders, Globe } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Language, Theme } from '../../utils/i18n';

interface SettingsPageProps {
  userName: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ userName }) => {
  const { theme, setTheme, language, setLanguage, t } = useAppContext();
  const [saveStatus, setSaveStatus] = useState('');

  const handleSaveTheme = () => {
    setSaveStatus(t('savedSuccess'));
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="page-view-container">
      <div className="page-header-banner glass-panel">
        <div className="page-title-group">
          <Settings size={28} className="page-title-icon" />
          <div>
            <h2>Account Settings & System Configuration</h2>
            <p>Customize personal information, UI themes, and Backend AI API connections</p>
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
            <Sliders size={20} /> Backend API & Theme Config
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="input-label">VITE_API_BASE_URL (Backend URL):</label>
            <input type="text" className="chat-input-field" defaultValue="http://localhost:5000/api" style={{ borderRadius: '8px' }} />
            <label className="input-label">UI Theme:</label>
            <select className="answer-textarea" style={{ height: '42px', padding: '8px 12px' }}>
              <option value="light">Clean Light Glassmorphism</option>
              <option value="dark">Neon Dark Glassmorphism</option>
            </select>
            <button className="btn-primary" style={{ marginTop: '10px', width: 'max-content' }}>Save Configuration</button>
          </div>
        </div>
      </div>
    </div>
  );
};
