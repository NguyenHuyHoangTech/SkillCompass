import React, { useState, useRef, useEffect } from 'react';
import { updateAIConfig, getAvailableModels } from '../../services/ai';

export const AiConfigMenu: React.FC = () => {
    const [showApiConfig, setShowApiConfig] = useState(false);
    const [tempApiKey, setTempApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [tempModel, setTempModel] = useState(localStorage.getItem('gemini_model_name') || 'gemini-flash-latest');
    
    const [isKeyValid, setIsKeyValid] = useState(!!localStorage.getItem('gemini_api_key'));
    const [keyTestResult, setKeyTestResult] = useState<{success: boolean, message: string} | null>(null);
    const [isTestingKey, setIsTestingKey] = useState(false);
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowApiConfig(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleVerifyKey = async () => {
        setIsTestingKey(true);
        setKeyTestResult(null);
        const res = await getAvailableModels(tempApiKey);
        setKeyTestResult({ success: res.success, message: res.success ? `Kết nối thành công! Đã tải ${res.models.length} models.` : res.message });
        setIsKeyValid(res.success);
        if (res.success && res.models.length > 0) {
            setAvailableModels(res.models);
            
            let nextModel = tempModel;
            if (!res.models.includes(tempModel)) {
                nextModel = res.models.includes('gemini-2.5-flash') ? 'gemini-2.5-flash' : res.models[0];
            }
            
            setTempModel(nextModel);
            updateAIConfig(tempApiKey, nextModel);
        }
        setIsTestingKey(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setShowApiConfig(!showApiConfig)}
                className="top-header-ai-featured-btn"
                style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-glass)' }}
                title="Cấu hình AI"
            >
                <i className="fa-solid fa-gear"></i>
                <span>AI Config</span>
            </button>

            {showApiConfig && (
                <div 
                    className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl p-4 z-50 glass-panel"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', top: '100%' }}
                >
                    <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-main)' }}>Cấu hình Gemini API</h3>
                    
                    <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>API Key</label>
                            <div className="flex gap-2" style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                    type="password" 
                                    value={tempApiKey}
                                    onChange={(e) => {
                                        setTempApiKey(e.target.value);
                                        setIsKeyValid(false);
                                        setKeyTestResult(null);
                                    }}
                                    placeholder="AIzaSy..." 
                                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                                />
                                <button 
                                    onClick={handleVerifyKey}
                                    disabled={isTestingKey || !tempApiKey}
                                    style={{ padding: '0 12px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: (isTestingKey || !tempApiKey) ? 'not-allowed' : 'pointer', opacity: (isTestingKey || !tempApiKey) ? 0.6 : 1 }}
                                >
                                    {isTestingKey ? "..." : "Test Key"}
                                </button>
                            </div>
                            {keyTestResult && (
                                <div style={{ marginTop: '8px', fontSize: '0.75rem', padding: '8px', borderRadius: '6px', backgroundColor: keyTestResult.success ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)', color: keyTestResult.success ? '#059669' : '#dc2626' }}>
                                    {keyTestResult.message}
                                </div>
                            )}
                        </div>
                        
                        {isKeyValid && (
                            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Chọn Model</label>
                                <select 
                                    value={tempModel}
                                    onChange={(e) => {
                                        setTempModel(e.target.value);
                                        updateAIConfig(tempApiKey, e.target.value);
                                    }}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                                >
                                    {availableModels.length > 0 ? (
                                        availableModels.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))
                                    ) : (
                                        <option value={tempModel}>{tempModel}</option>
                                    )}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
