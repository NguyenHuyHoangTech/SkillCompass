import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Milestone } from '../services/ai';

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

    useEffect(() => {
        localStorage.setItem('skillpath_state', JSON.stringify(state));
    }, [state]);

    const setSkills = (skills: string[]) => setState(prev => ({ ...prev, skills }));
    const setCareer = (career: string) => setState(prev => ({ ...prev, career }));
    const setSandboxFeedback = (sandboxFeedback: string) => setState(prev => ({ ...prev, sandboxFeedback }));
    const setMilestones = (milestones: Milestone[]) => setState(prev => ({ ...prev, milestones }));

    return (
        <AppContext.Provider value={{ state, setSkills, setCareer, setSandboxFeedback, setMilestones }}>
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
