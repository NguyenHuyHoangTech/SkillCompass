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
            <h2>{t('settingsTitle')}</h2>
            <p>{t('settingsSubtitle')}</p>
          </div>
        </div>
      </div>

      <div className="settings-cards-grid" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="category-card glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <User size={20} /> {t('profileInfo')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="input-label">{t('fullName')}</label>
            <input type="text" className="chat-input-field" defaultValue={userName} style={{ borderRadius: '8px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-glass)' }} />
            <label className="input-label">{t('careerGoal')}</label>
            <input type="text" className="chat-input-field" defaultValue="Senior UI/UX & Frontend Specialist" style={{ borderRadius: '8px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-glass)' }} />
            <button className="btn-primary" style={{ marginTop: '10px', width: 'max-content' }} onClick={handleSaveTheme}>{t('saveChanges')}</button>
          </div>
        </div>

        <div className="category-card glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <Sliders size={20} /> {t('configTheme')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Globe size={16}/> {t('selectLanguage')}</label>
            <select 
              className="answer-textarea" 
              style={{ height: '42px', padding: '8px 12px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-glass)' }}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="vi">{t('vietnamese')}</option>
              <option value="en">{t('english')}</option>
            </select>

            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Settings size={16}/> {t('selectTheme')}</label>
            <select 
              className="answer-textarea" 
              style={{ height: '42px', padding: '8px 12px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-glass)' }}
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              <option value="light">{t('themeLightOption')}</option>
              <option value="dark">{t('themeDarkOption')}</option>
            </select>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
              <button className="btn-primary" style={{ width: 'max-content' }} onClick={handleSaveTheme}>{t('saveChanges')}</button>
              {saveStatus && <span style={{ color: 'var(--emerald)', fontSize: '14px', fontWeight: '500' }}>{saveStatus}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
