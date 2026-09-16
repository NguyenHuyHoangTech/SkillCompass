import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FormattedMarkdownText } from '../components/common/FormattedMarkdownText';
import { 
    analyzeUserSkillsOverview, 
    evaluateAssessmentAnswer,
    generateDynamicRIASECCards,
    suggestIkigaiCareers,
    generateDualRoadmaps,
    extractSkillsFromText,
    type IkigaiCareerSuggestion,
    type RiasecCard,
    type DualRoadmapsResponse
} from '../services/ai';
import { convertToUserRoadmap } from '../utils/roadmapAdapter';

interface OnboardingProps {
    onFinish?: () => void;
}

export default function Onboarding({ onFinish }: OnboardingProps) {
    const navigate = useNavigate();
    const { state, setSkills, setCareer, setMilestones } = useAppContext();
    const [step, setStep] = useState(1);
    const [localSkills, setLocalSkills] = useState<string[]>(state.skills || []);
    const [chatText, setChatText] = useState('');
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isExtractingSkills, setIsExtractingSkills] = useState(false);
    
    // Assessment state (Step 2)
    const [marketEvaluation, setMarketEvaluation] = useState('');
    const [assessQuestion, setAssessQuestion] = useState('Analyzing your skills...');
    const [assessAnswer, setAssessAnswer] = useState('');
    const [assessFeedback, setAssessFeedback] = useState('');
    const [isAssessing, setIsAssessing] = useState(false);
    
    // Ikigai Questions State
    const [ikigaiQuestions, setIkigaiQuestions] = useState({ love: '', money: '' });
    const [ikigaiAnswers] = useState({ love: '', money: '' });

    // RIASEC State (Step 4)
    const [riasecChoices, setRiasecChoices] = useState<Record<string, boolean | null>>({});
    const [riasecScores, setRiasecScores] = useState<Record<string, number>>({ R:0, I:0, A:0, S:0, E:0, C:0 });
    const [dynamicRiasecCards, setDynamicRiasecCards] = useState<RiasecCard[]>([]);
    const [isGeneratingCards, setIsGeneratingCards] = useState(false);

    // Free Text State (Step 5)
    const [ikigaiText, setIkigaiText] = useState('');
    
    // Career Suggestions (Step 6)
    const [careerSuggestions, setCareerSuggestions] = useState<IkigaiCareerSuggestion[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [localCareer, setLocalCareer] = useState(state.career || '');
    const [suggestionFeedback, setSuggestionFeedback] = useState('');

    // Context Triangle (Step 5)
    const [contextTriangle, setContextTriangle] = useState({ time: '', academic: '', budget: '' });

    const toggleSkill = (skill: string) => {
        if (localSkills.includes(skill)) {
            setLocalSkills(localSkills.filter(s => s !== skill));
        } else {
            setLocalSkills([...localSkills, skill]);
        }
    };

    const handleChatSubmit = async () => {
        if (!chatText.trim() && !cvFile && localSkills.length === 0) return;
        setIsExtractingSkills(true);
        try {
            let extractedSkills: string[] = [];
            if (chatText.trim() || cvFile) {
                extractedSkills = await extractSkillsFromText(chatText, cvFile ? cvFile.name : null);
            }
            
            const finalSkills = Array.from(new Set([...localSkills, ...extractedSkills]));
            
            setLocalSkills(finalSkills);
            setSkills(finalSkills);
            
            setIsAssessing(true);
            setStep(2);
            
            const overview = await analyzeUserSkillsOverview(finalSkills.length > 0 ? finalSkills : localSkills);
            setMarketEvaluation(overview.market_level_evaluation);
            setAssessQuestion(overview.technical_assessment_question);
            setIkigaiQuestions(overview.ikigai_questions);
            setIsAssessing(false);
        } catch (error) {
            console.error(error);
            setIsExtractingSkills(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const submitAssessmentAnswer = async () => {
        if (!assessAnswer.trim()) return;
        setIsAssessing(true);
        const feedback = await evaluateAssessmentAnswer(assessAnswer, assessQuestion);
        setAssessFeedback(feedback);
        setIsAssessing(false);
    };

    const nextAssessment = async () => {
        setStep(4);
        setIsGeneratingCards(true);
        generateDynamicRIASECCards(localSkills, ikigaiAnswers.love || '', ikigaiAnswers.money || '').then(cards => {
            setDynamicRiasecCards(cards);
            setIsGeneratingCards(false);
        });
    };

    const submitRiasecList = () => {
        const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        Object.entries(riasecChoices).forEach(([id, val]) => {
            if (val === true) {
                scores[id] = 1;
            }
        });
        setRiasecScores(scores);
        setStep(5);
    };

    const goToSuggestions = async () => {
        if (!contextTriangle.time || !contextTriangle.academic || !contextTriangle.budget) {
            alert('Please select all 3 context fields (Time, Background, Budget) for accurate AI guidance.');
            return;
        }
        setStep(6);
        setIsSuggesting(true);
        const combinedIkigaiText = `Time availability: ${contextTriangle.time}. Background: ${contextTriangle.academic}. Budget: ${contextTriangle.budget}. Additional details: ${ikigaiText}`;
        const suggestions = await suggestIkigaiCareers(localSkills, riasecScores, combinedIkigaiText);
        setCareerSuggestions(suggestions);
        setIsSuggesting(false);
    };

    const refineSuggestions = async () => {
        setIsSuggesting(true);
        const userPrompt = suggestionFeedback.trim() 
            ? `User adjustment requirement: ${suggestionFeedback.trim()}` 
            : `Provide 3 fresh alternative/different IT career roadmap options distinct from previous recommendations.`;
        const combinedIkigaiText = `Time availability: ${contextTriangle.time}. Background: ${contextTriangle.academic}. Budget: ${contextTriangle.budget}. Additional details: ${ikigaiText}. ${userPrompt}`;
        const suggestions = await suggestIkigaiCareers(localSkills, riasecScores, combinedIkigaiText);
        if (suggestions && suggestions.length > 0) {
            setCareerSuggestions(suggestions);
        }
        setSuggestionFeedback('');
        setIsSuggesting(false);
    };

    const selectCareerAndFinish = async (careerTitle: string, miniRoadmap?: string[]) => {
        if (!careerTitle.trim()) {
            alert('Please select or enter a career roadmap title');
            return;
        }
        setLocalCareer(careerTitle);
        setCareer(careerTitle);
        setIsSuggesting(true);
        
        try {
            const combinedIkigaiText = `Time availability: ${contextTriangle.time}. Background: ${contextTriangle.academic}. Budget: ${contextTriangle.budget}. Additional details: ${ikigaiText}`;
            const roadmaps: DualRoadmapsResponse = await generateDualRoadmaps(careerTitle, localSkills, riasecScores, combinedIkigaiText, contextTriangle, miniRoadmap);
            
            if (roadmaps && roadmaps.option1) {
                const finalMilestones = roadmaps.option1.milestones;
                const fullRoadmap = convertToUserRoadmap(finalMilestones, careerTitle, assessFeedback, localSkills);
                localStorage.setItem('skill_compass_roadmap', JSON.stringify(fullRoadmap));
                setMilestones(finalMilestones);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSuggesting(false);
            if (onFinish) {
                await onFinish();
            }
            navigate('/roadmap');
        }
    };

    const handleBack = () => {
        if (step === 6) setStep(5);
        else if (step === 5) setStep(4);
        else if (step === 4) setStep(2);
        else if (step === 2) setStep(1);
        else if (step > 1) setStep(prev => prev - 1);
    };

    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPortalTarget(document.getElementById('onboarding-step-portal-target'));
    }, []);

    return (
        <div className="flex flex-col relative overflow-hidden bg-transparent min-h-full">
            {/* Steps Progress Portal to TopNavbar */}
            {portalTarget && createPortal(
                <div className="flex items-center gap-1 whitespace-nowrap">
                    {step > 1 && (
                        <button 
                            onClick={handleBack} 
                            className="mr-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-white text-slate-500 hover:text-[#0284c7] hover:bg-sky-50 transition-colors shadow-sm border border-slate-200"
                            title="Back to previous step"
                        >
                            <i className="fa-solid fa-arrow-left text-[10px]"></i>
                        </button>
                    )}
                    <span className={`top-header-subtab-btn ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>1. Skills</span>
                    <i className="fa-solid fa-chevron-right text-[8px] text-slate-300 mx-0.5"></i>
                    <span className={`top-header-subtab-btn ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>2. Assessment</span>
                    <i className="fa-solid fa-chevron-right text-[8px] text-slate-300 mx-0.5"></i>
                    <span className={`top-header-subtab-btn ${step === 4 ? 'active' : step > 4 ? 'completed' : ''}`}>3. RIASEC</span>
                    <i className="fa-solid fa-chevron-right text-[8px] text-slate-300 mx-0.5"></i>
                    <span className={`top-header-subtab-btn ${step === 5 ? 'active' : step > 5 ? 'completed' : ''}`}>4. Context</span>
                    <i className="fa-solid fa-chevron-right text-[8px] text-slate-300 mx-0.5"></i>
                    <span className={`top-header-subtab-btn ${step === 6 ? 'active' : ''}`}>5. Roadmap</span>
                </div>,
                portalTarget
            )}

            {/* STEP 1: SKILL SELECTION */}
            {step === 1 && (
                <div className="w-full max-w-3xl mx-auto px-6 py-8 sm:px-10 flex flex-col justify-center step-enter">
                    {isExtractingSkills ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4 py-12">
                            <i className="fa-solid fa-brain fa-fade text-5xl text-indigo-500 mb-4"></i>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">AI is reading your data...</h2>
                            <p className="text-slate-500">Analyzing career goals and extracting skills</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Skill Inventory</h2>
                                <p className="text-slate-500 text-sm sm:text-base">Select existing skills or let AI extract them from your text description or CV.</p>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col gap-4 max-h-[75vh] overflow-y-auto hide-scrollbar">
                                
                                <div className="mb-4">
                                    <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Select Skills</h3>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {['HTML/CSS', 'JavaScript', 'Python', 'Figma / UI Design', 'Data Analysis', 'ChatGPT Prompts', 'Presentations', 'Team Collaboration'].map(skill => (
                                            <button 
                                                key={skill}
                                                className={`px-4 py-2 rounded-xl border font-medium transition-all text-sm ${localSkills.includes(skill) ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                                                onClick={() => toggleSkill(skill)}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-3 text-sm text-indigo-900 mb-2 items-center">
                                    <i className="fa-solid fa-robot text-indigo-500 text-lg shrink-0"></i>
                                    <p className="text-xs sm:text-sm">Select skills above, describe your background below, or upload a CV for AI analysis.</p>
                                </div>

                                <div className="relative">
                                    <textarea 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[120px] text-sm focus:border-indigo-400 outline-none transition-all resize-none shadow-inner"
                                        placeholder="Describe your skills, experience, or career goals..."
                                        value={chatText}
                                        onChange={(e) => setChatText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleChatSubmit();
                                            }
                                        }}
                                    ></textarea>
                                    
                                    {cvFile && (
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white border border-indigo-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-indigo-700">
                                            <i className="fa-solid fa-file-pdf text-red-500"></i>
                                            <span className="truncate max-w-[150px]">{cvFile.name}</span>
                                            <button onClick={() => setCvFile(null)} className="ml-1 text-slate-400 hover:text-red-500"><i className="fa-solid fa-xmark"></i></button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <div className="relative">
                                        <input type="file" id="cv-upload" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                                        <label htmlFor="cv-upload" className="cursor-pointer flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100">
                                            <i className="fa-solid fa-paperclip text-lg"></i>
                                            <span className="hidden sm:inline">Attach CV</span>
                                        </label>
                                    </div>
                                    <button 
                                        onClick={handleChatSubmit} 
                                        disabled={!chatText.trim() && !cvFile && localSkills.length === 0}
                                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg"
                                    >
                                        Send to AI <i className="fa-regular fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* STEP 2: COMPETENCY ASSESSMENT */}
            {step === 2 && (
                <div className="w-full max-w-2xl mx-auto px-6 py-8 sm:px-10 flex flex-col justify-center step-enter">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Competency Assessment</h2>
                        <p className="text-slate-500 text-sm">Answer a practical scenario question to benchmark your skill level.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 relative overflow-y-auto hide-scrollbar max-h-[75vh]">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-lg text-indigo-700">Practical Assessment</h3>
                            <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold px-3 py-1.5 rounded-full">{localSkills.length} skills</span>
                        </div>

                        <div className="mb-5">
                            <p className="text-slate-700 font-medium leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-sm">
                                <i className="fa-solid fa-robot text-indigo-500 mr-2"></i> {assessQuestion}
                            </p>
                        </div>

                        <div className="mb-5">
                            <textarea rows={4} className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder-slate-400" placeholder="Enter your answer or real-world experience..."
                                value={assessAnswer} onChange={(e) => setAssessAnswer(e.target.value)} disabled={assessFeedback !== ''}></textarea>
                        </div>

                        {assessFeedback && (
                            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 items-start step-enter">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><i className="fa-solid fa-check"></i></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-emerald-800 text-sm mb-1">AI Feedback:</h4>
                                    <FormattedMarkdownText content={assessFeedback} className="text-emerald-800 text-xs sm:text-sm" />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                            {!assessFeedback ? (
                                <button onClick={submitAssessmentAnswer} disabled={isAssessing} className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                                    {isAssessing ? 'Analyzing...' : 'Submit for AI Assessment'} <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            ) : (
                                <button onClick={nextAssessment} className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md animate-bounce">
                                    Complete & Continue <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: RIASEC PERSONALITY DISCOVERY */}
            {step === 4 && (
                <div className="w-full max-w-4xl mx-auto px-6 py-8 sm:px-10 flex flex-col justify-center step-enter">
                    {isGeneratingCards ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4 py-12">
                            <i className="fa-solid fa-brain text-5xl text-indigo-500 mb-4 animate-bounce"></i>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">AI is generating RIASEC scenarios...</h2>
                            <p className="text-slate-500">Evaluating work personality based on Holland Codes</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col max-h-[82vh]">
                            <div className="text-center mb-5 pb-4 border-b border-slate-100 shrink-0">
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Discover Personality (RIASEC)</h2>
                                <p className="text-slate-500 text-sm">Evaluate the scenarios below so AI can tailor recommendations to your style.</p>
                            </div>

                            <div className="overflow-y-auto hide-scrollbar space-y-4 pr-1 mb-5 flex-1">
                                {dynamicRiasecCards.map((card, idx) => {
                                    const metaMap: Record<string, { label: string; icon: string; badgeBg: string }> = {
                                        R: { label: 'Realistic - Hands-on', icon: 'fa-solid fa-wrench', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
                                        I: { label: 'Investigative - Research', icon: 'fa-solid fa-microscope', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
                                        A: { label: 'Artistic - Creative', icon: 'fa-solid fa-palette', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
                                        S: { label: 'Social - People & Mentoring', icon: 'fa-solid fa-users', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' },
                                        E: { label: 'Enterprising - Leadership', icon: 'fa-solid fa-chart-line', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                                        C: { label: 'Conventional - Structured', icon: 'fa-solid fa-clipboard-check', badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' },
                                    };
                                    const meta = metaMap[card.id] || { label: card.id, icon: 'fa-solid fa-star', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
                                    const isSelectedYes = riasecChoices[card.id] === true;
                                    const isSelectedNo = riasecChoices[card.id] === false;

                                    return (
                                        <div key={card.id || idx} className={`p-4 sm:p-5 rounded-2xl border transition-all ${isSelectedYes ? 'bg-indigo-50/50 border-indigo-300 shadow-sm' : isSelectedNo ? 'bg-slate-50/70 border-slate-200 opacity-75' : 'bg-white border-slate-200 hover:border-indigo-200'}`}>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeBg}`}>
                                                            <i className={meta.icon}></i>
                                                            {meta.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                                                        {card.text}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRiasecChoices(prev => ({ ...prev, [card.id]: false }))}
                                                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 ${isSelectedNo ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'}`}
                                                    >
                                                        <i className="fa-solid fa-xmark"></i> Not a fit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setRiasecChoices(prev => ({ ...prev, [card.id]: true }))}
                                                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 ${isSelectedYes ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'}`}
                                                    >
                                                        <i className="fa-solid fa-check"></i> Fits me
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center shrink-0">
                                <span className="text-xs font-semibold text-slate-500">
                                    Selected: <b className="text-indigo-600">{Object.values(riasecChoices).filter(v => v === true).length}</b> / {dynamicRiasecCards.length} matching
                                </span>
                                <button
                                    onClick={submitRiasecList}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 text-sm"
                                >
                                    Complete & Continue <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 5: CONTEXT FORM */}
            {step === 5 && (
                <div className="w-full max-w-2xl mx-auto px-6 py-8 sm:px-10 flex flex-col justify-center step-enter">
                    <div className="text-center mb-6 relative">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Provide Context</h2>
                        <p className="text-slate-500 text-sm">Select 3 key factors so AI can tailor the roadmap to your situation.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 relative space-y-6 max-h-[78vh] overflow-y-auto hide-scrollbar">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3"><i className="fa-regular fa-clock text-indigo-500 mr-2"></i>Time Availability</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {['Full-time (40h/week)', 'Evenings & Weekends (15-20h/w)', 'Busy Schedule (5-10h/week)'].map(opt => (
                                    <button key={opt} type="button" onClick={() => setContextTriangle({...contextTriangle, time: opt})}
                                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left ${contextTriangle.time === opt ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400 hover:bg-white'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3"><i className="fa-solid fa-graduation-cap text-indigo-500 mr-2"></i>Background & Education</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {['1st-2nd Year IT Student', '3rd-4th Year Internship Prep', 'Non-tech Career Transition', 'Working Professional Up-skilling'].map(opt => (
                                    <button key={opt} type="button" onClick={() => setContextTriangle({...contextTriangle, academic: opt})}
                                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left ${contextTriangle.academic === opt ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400 hover:bg-white'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3"><i className="fa-solid fa-wallet text-indigo-500 mr-2"></i>Learning Budget</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {['Completely Free (Self-study)', 'Affordable Online Courses', 'High Investment Fast Track'].map(opt => (
                                    <button key={opt} type="button" onClick={() => setContextTriangle({...contextTriangle, budget: opt})}
                                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left ${contextTriangle.budget === opt ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400 hover:bg-white'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2"><i className="fa-solid fa-pen-to-square text-indigo-500 mr-2"></i>Additional Notes (Optional)</label>
                            <textarea rows={3} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder-slate-400 resize-none" 
                                placeholder="Enter any extra preferences, special requests, or details..."
                                value={ikigaiText} onChange={(e) => setIkigaiText(e.target.value)}></textarea>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                            <button onClick={goToSuggestions} className="w-full bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-lg text-base sm:text-lg">
                                Analyze & Recommend Roadmap <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 6: CAREER SUGGESTIONS & ROADMAP SELECTION */}
            {step === 6 && (
                <div className="w-full max-w-4xl mx-auto px-6 py-8 sm:px-10 flex flex-col justify-center step-enter items-center">
                    {isSuggesting ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4 py-12">
                            <i className="fa-solid fa-circle-notch fa-spin text-5xl text-indigo-500 mb-4"></i>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">AI is designing your Roadmap...</h2>
                            <p className="text-slate-500">Synthesizing your skills, personality, and context parameters</p>
                        </div>
                    ) : (
                        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 step-enter max-h-[85vh] overflow-y-auto hide-scrollbar">
                            <h3 className="font-bold text-2xl text-center text-slate-800 mb-2">Recommended Roadmaps</h3>
                            <p className="text-slate-500 text-sm text-center mb-8">Select the roadmap that best fits your goals to begin.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {careerSuggestions.map((s, idx) => (
                                    <div key={idx} className="p-5 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all bg-white flex flex-col h-full relative group">
                                        <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            {idx + 1}
                                        </div>
                                        <h4 className="font-bold text-lg text-indigo-700 mb-2">{s.title}</h4>
                                        <p className="text-sm text-slate-600 mb-4 flex-1 italic">"{s.reason}"</p>
                                        
                                        <div className="mb-4">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Outline Steps</span>
                                            <ul className="space-y-1">
                                                {s.mini_roadmap.map((stepItem, i) => (
                                                    <li key={i} className="text-xs text-slate-700 flex gap-2">
                                                        <i className="fa-solid fa-arrow-right text-indigo-400 mt-0.5 text-[10px]"></i> {stepItem}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="bg-indigo-50 p-3 rounded-xl mb-5">
                                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">Real-world Example</span>
                                            <p className="text-xs text-indigo-800 font-medium">{s.real_world_example}</p>
                                        </div>

                                        <button onClick={() => selectCareerAndFinish(s.title, s.mini_roadmap)} className="mt-auto w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors text-sm shadow-md flex items-center justify-center gap-1.5">
                                            Select This Roadmap <i className="fa-solid fa-arrow-right text-xs"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="pt-6 mt-6 border-t border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-3 text-sm"><i className="fa-solid fa-wand-magic-sparkles text-indigo-500 mr-2"></i>Or enter custom roadmap name:</h4>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="text" placeholder="Enter custom roadmap (e.g. Data Analyst, Mobile Dev)..." className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-inner" value={suggestionFeedback} onChange={(e) => { setSuggestionFeedback(e.target.value); setLocalCareer(e.target.value); }} onKeyDown={(e) => e.key === 'Enter' && refineSuggestions()} />
                                    <div className="flex gap-2">
                                        <button onClick={refineSuggestions} className="flex-1 sm:flex-none bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-colors shadow-sm text-sm whitespace-nowrap"><i className="fa-solid fa-arrows-rotate mr-2"></i>AI Re-suggest</button>
                                        <button onClick={() => selectCareerAndFinish(localCareer)} className="flex-1 sm:flex-none bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-md text-sm whitespace-nowrap">Confirm & Start</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
