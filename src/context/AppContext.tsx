import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Milestone } from '../services/ai';
import { translations } from '../utils/i18n';
import type { Language, Theme } from '../utils/i18n';

interface AppState {
    skills: string[];
    career: string;
    sandboxFeedback: string;
    milestones: Milestone[];
}

interface AppContextType {
    state: AppState;
    setSkills: (skills: string[]) => void;
    setCareer: (career: string) => void;
    setSandboxFeedback: (feedback: string) => void;
    setMilestones: (milestones: Milestone[]) => void;
    
    // i18n & Theme
    language: Language;
    setLanguage: (lang: Language) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    t: (key: keyof typeof translations['vi']) => string;
}

const defaultState: AppState = {
    skills: [],
    career: '',
    sandboxFeedback: '',
    milestones: []
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AppState>(() => {
        const saved = localStorage.getItem('skillpath_state');
        return saved ? JSON.parse(saved) : defaultState;
    });

    // Language state
    const [language, setLanguageState] = useState<Language>(() => {
        const savedLang = localStorage.getItem('skill_compass_lang');
        return (savedLang === 'en' || savedLang === 'vi') ? savedLang : 'vi';
    });

    // Theme state
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('skill_compass_theme');
        return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'light';
    });

    useEffect(() => {
        localStorage.setItem('skillpath_state', JSON.stringify(state));
    }, [state]);

    // Apply data-theme attribute on document root whenever theme changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('skill_compass_theme', theme);
    }, [theme]);

    const setSkills = (skills: string[]) => setState(prev => ({ ...prev, skills }));
    const setCareer = (career: string) => setState(prev => ({ ...prev, career }));
    const setSandboxFeedback = (sandboxFeedback: string) => setState(prev => ({ ...prev, sandboxFeedback }));
    const setMilestones = (milestones: Milestone[]) => setState(prev => ({ ...prev, milestones }));

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('skill_compass_lang', lang);
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const t = (key: keyof typeof translations['vi']): string => {
        const langDict = translations[language] || translations.vi;
        return langDict[key] || translations.vi[key] || String(key);
    };

    return (
        <AppContext.Provider value={{ 
            state, setSkills, setCareer, setSandboxFeedback, setMilestones,
            language, setLanguage, theme, setTheme, t
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
