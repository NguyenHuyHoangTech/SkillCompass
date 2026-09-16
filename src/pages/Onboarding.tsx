import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    generateAssessmentQuestions, 
    evaluateAssessmentAnswers, 
    generateDynamicRIASECCardsV2,
    generateCareerGoals,
    refineCareerGoals
} from '../services/ai';
import type { 
    SkillQuestion,
    SkillFeedback,
    RiasecCard, 
    CareerGoalResponse 
} from '../services/ai';
import { initialMockRoadmap } from '../data/mockRoadmapData';

interface OnboardingProps {
    onFinish?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    
    // Step 1 Data
    const [step1Data, setStep1Data] = useState({
        skills: "", hobbies: "", income: "", extra: ""
    });

    // Step 2 Data
    const [isGeneratingTest, setIsGeneratingTest] = useState(false);
    const [skillQuestions, setSkillQuestions] = useState<SkillQuestion[]>([]);
    const [skillAnswers, setSkillAnswers] = useState<Record<string, string>>({});
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [testResults, setTestResults] = useState<SkillFeedback[]>([]);

    // Step 3 Data
    const [isGeneratingCards, setIsGeneratingCards] = useState(false);
    const [dynamicCards, setDynamicCards] = useState<RiasecCard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [riasecScores, setRiasecScores] = useState<Record<string, number>>({
        R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
    });
    const [showContextTriangle, setShowContextTriangle] = useState(false);
    const [contextTriangle, setContextTriangle] = useState({
        time: "", academic: "", budget: ""
    });

    // Step 4 Data
    const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);
    const [careerGoals, setCareerGoals] = useState<CareerGoalResponse[]>([]);
    const [feedbackText, setFeedbackText] = useState("");
    const [isRefining, setIsRefining] = useState(false);

    const goToStep2 = () => {
        if (!step1Data.skills.trim()) return;
        setIsGeneratingTest(true);
        setTimeout(async () => {
            setStep(2);
            const questions = await generateAssessmentQuestions(step1Data.skills);
            setSkillQuestions(questions);
            setIsGeneratingTest(false);
        }, 100);
    };

    const submitAllAnswers = async () => {
        const answersArray = skillQuestions.map(q => ({
            skill: q.skill,
            answer: skillAnswers[q.skill] || ""
        }));
        setIsEvaluating(true);
        const results = await evaluateAssessmentAnswers(answersArray);
        setTestResults(results);
        setIsEvaluating(false);
    };

    const goToStep3 = () => {
        setIsGeneratingCards(true);
        setTimeout(async () => {
            setStep(3);
            setCurrentCardIndex(0);
            setShowContextTriangle(false);
            const cards = await generateDynamicRIASECCardsV2({
                ...step1Data,
                testResults
            });
            setDynamicCards(cards);
            setIsGeneratingCards(false);
        }, 100);
    };

    const selectRiasecCard = (id: string, value: number) => {
        setRiasecScores(prev => ({ ...prev, [id]: prev[id] + value }));
        if (currentCardIndex < dynamicCards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
        } else {
            setTimeout(() => setShowContextTriangle(true), 300);
        }
    };

    const goToStep4 = () => {
        if (!contextTriangle.time || !contextTriangle.academic || !contextTriangle.budget) {
            alert("Please complete the Context Triangle information.");
            return;
        }
        setIsGeneratingGoals(true);
        setTimeout(async () => {
            setStep(4);
            const goals = await generateCareerGoals({
                step1Data,
                step2Data: testResults,
                step3Data: { riasecScores, ...contextTriangle }
            });
            setCareerGoals(goals);
            setIsGeneratingGoals(false);
        }, 100);
    };

    const handleRefine = async () => {
        if (!feedbackText.trim() || careerGoals.length === 0) return;
        setIsRefining(true);
        
        // Artificial delay for loading effect
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newGoals = await refineCareerGoals(careerGoals, feedbackText);
        if (newGoals) {
            setCareerGoals(newGoals);
            setFeedbackText("");
        }
        setIsRefining(false);
    };

    const selectGoal = (goal: CareerGoalResponse) => {
        initialMockRoadmap.targetRole = goal.title;
        initialMockRoadmap.milestones = goal.milestones.map((m: any, i: number) => ({
            id: m.id,
            title: m.title,
            roleName: goal.title,
            description: m.goal,
            badge: `Stage ${i+1}`,
            overallProgress: 0,
            overallAiEvaluation: undefined,
            categories: [
                {
                    id: `cat-${i}`,
                    name: 'Core Skills',
                    description: 'Required skills for this stage',
                    skills: m.skills.map((s: any, j: number) => ({
                        id: `sk-${i}-${j}`,
                        name: s.title,
                        icon: 'Book',
                        levelPercentage: 0,
                        subTopics: (s.sub_tasks || []).map((st: any, k: number) => ({
                            id: `sub-${i}-${j}-${k}`,
                            title: st.text || 'Subtopic',
                            description: st.completion_note || 'Study content',
                            isCompleted: false,
                            assessmentScore: 0
                        }))
                    }))
                }
            ]
        })) as any;
        initialMockRoadmap.currentMilestoneId = goal.milestones[0]?.id || "";
        localStorage.setItem('skill_compass_roadmap', JSON.stringify(initialMockRoadmap));
        if (onFinish) {
            onFinish();
        } else {
            navigate('/roadmap');
        }
    };


    return (
        <div className="relative min-h-screen bg-slate-50 overflow-y-auto font-sans">
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-200 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

            <header className="sticky top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-white/50 backdrop-blur-sm border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                        <i className="fa-regular fa-compass text-white text-xl"></i>
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-slate-900">Skill Compass AI</span>
                </div>
                <div className="text-sm font-bold text-slate-500 bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    Step {step} of 4
                </div>
            </header>

            <main className="relative z-10 w-full max-w-4xl mx-auto p-4 sm:p-6 pb-24">
                
                {/* STEP 1: INITIAL DATA COLLECTION */}
                {step === 1 && (
                    <div className="animate-fade-in-up mt-8">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 drop-shadow-sm">
                                Let's build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Profile</span>
                            </h1>
                            <p className="text-slate-500 text-lg max-w-xl mx-auto">
                                The more you share, the more personalized the AI's career roadmap will be.
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">1. Current Skills <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="e.g. React, Python, Excel, Content Writing..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" value={step1Data.skills} onChange={e => setStep1Data({...step1Data, skills: e.target.value})} />
                                <p className="text-xs text-slate-400 mt-1">If you have more than 5, AI will pick the top 5 to test.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">2. Hobbies / Interests</label>
                                <input type="text" placeholder="e.g. Video games, Drawing, Traveling..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" value={step1Data.hobbies} onChange={e => setStep1Data({...step1Data, hobbies: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">3. Desired Income</label>
                                <input type="text" placeholder="e.g. $50,000/year, enough to travel..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" value={step1Data.income} onChange={e => setStep1Data({...step1Data, income: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">4. Extra Information</label>
                                <textarea placeholder="Anything else you want to share? Personality, goals, struggles..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all min-h-[100px]" value={step1Data.extra} onChange={e => setStep1Data({...step1Data, extra: e.target.value})}></textarea>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <button onClick={goToStep2} disabled={!step1Data.skills.trim() || isGeneratingTest} className="bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg">
                                    {isGeneratingTest ? <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</> : <>Start Skill Test <i className="fa-solid fa-arrow-right"></i></>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: SKILL ASSESSMENT */}
                {step === 2 && (
                    <div className="animate-fade-in-up mt-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Skill Verification</h2>
                            <p className="text-slate-500">AI has generated 1 practical question for each of your skills.</p>
                        </div>
                        
                        {isGeneratingTest ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <i className="fa-solid fa-robot fa-spin text-5xl text-indigo-500"></i>
                                <p className="text-slate-600 font-medium">Generating personalized skill questions...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {skillQuestions.map((q, idx) => {
                                    const feedback = testResults.find(r => r.skill === q.skill)?.feedback;
                                    return (
                                        <div key={idx} className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                                            <h3 className="font-bold text-indigo-600 mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                                                <i className="fa-solid fa-code"></i> Skill: {q.skill}
                                            </h3>
                                            <p className="text-slate-800 font-medium text-lg mb-4">{q.question}</p>
                                            
                                            {!feedback ? (
                                                <textarea 
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all min-h-[100px]"
                                                    placeholder="Your practical answer here..."
                                                    value={skillAnswers[q.skill] || ""}
                                                    onChange={e => setSkillAnswers(prev => ({...prev, [q.skill]: e.target.value}))}
                                                    disabled={isEvaluating}
                                                />
                                            ) : (
                                                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3">
                                                    <i className="fa-solid fa-check-circle text-emerald-500 mt-1"></i>
                                                    <div>
                                                        <span className="font-bold text-emerald-800 block mb-1">AI Evaluation</span>
                                                        <p className="text-emerald-700 text-sm">{feedback}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                                {!testResults.length ? (
                                    <div className="flex justify-center pt-6">
                                        <button onClick={submitAllAnswers} disabled={isEvaluating} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl transition-colors shadow-lg flex items-center gap-2">
                                            {isEvaluating ? <><i className="fa-solid fa-spinner fa-spin"></i> Evaluating...</> : "Submit Answers"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-center pt-6">
                                        <button onClick={goToStep3} disabled={isGeneratingCards} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg flex items-center gap-2">
                                            {isGeneratingCards ? <><i className="fa-solid fa-spinner fa-spin"></i> Preparing Cards...</> : <>Next Step <i className="fa-solid fa-arrow-right ml-2"></i></>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: RIASEC & CONTEXT TRIANGLE */}
                {step === 3 && (
                    <div className="animate-fade-in-up mt-8 h-full flex flex-col justify-center">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                                {!showContextTriangle ? "RIASEC Personality Test" : "The Context Triangle"}
                            </h2>
                            <p className="text-slate-500">
                                {!showContextTriangle 
                                    ? "Swipe Right if you enjoy the scenario, Swipe Left if you don't."
                                    : "Help AI understand your current reality to generate a realistic roadmap."}
                            </p>
                        </div>

                        {!showContextTriangle ? (
                            <div className="relative flex flex-col justify-center items-center">
                                <div className="relative flex justify-center items-center h-80 w-full max-w-sm mx-auto">
                                    {isGeneratingCards ? (
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <i className="fa-solid fa-layer-group fa-spin text-4xl text-indigo-500"></i>
                                            <p className="text-slate-600 font-medium text-center">Generating personalized personality cards...</p>
                                        </div>
                                    ) : (
                                        <AnimatePresence>
                                            {dynamicCards.map((card, idx) => {
                                                if (idx < currentCardIndex) return null;
                                                const isTop = idx === currentCardIndex;
                                                return (
                                                    <motion.div
                                                        key={card.id}
                                                        className="absolute w-full h-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 flex flex-col justify-center items-center text-center cursor-grab active:cursor-grabbing"
                                                        style={{ zIndex: dynamicCards.length - idx }}
                                                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                                        animate={{ 
                                                            scale: isTop ? 1 : 0.95, 
                                                            opacity: isTop ? 1 : 0.5,
                                                            y: isTop ? 0 : 20,
                                                            rotate: isTop ? 0 : (idx % 2 === 0 ? 2 : -2)
                                                        }}
                                                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                                        drag={isTop ? "x" : false}
                                                        dragConstraints={{ left: 0, right: 0 }}
                                                        onDragEnd={(_e, info) => {
                                                            if (info.offset.x > 100) selectRiasecCard(card.id, 5);
                                                            else if (info.offset.x < -100) selectRiasecCard(card.id, 1);
                                                        }}
                                                        whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                                                    >
                                                        <p className="text-slate-700 font-medium text-lg leading-relaxed">{card.text}</p>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    )}
                                </div>
                                {!isGeneratingCards && dynamicCards.length > 0 && currentCardIndex < dynamicCards.length && (
                                    <div className="flex justify-center gap-6 mt-8">
                                        <button onClick={() => selectRiasecCard(dynamicCards[currentCardIndex].id, 1)} className="w-16 h-16 rounded-full bg-white border-2 border-rose-100 text-rose-500 shadow-md hover:bg-rose-50 hover:scale-110 transition-all flex justify-center items-center text-2xl">
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                        <button onClick={() => selectRiasecCard(dynamicCards[currentCardIndex].id, 5)} className="w-16 h-16 rounded-full bg-white border-2 border-emerald-100 text-emerald-500 shadow-md hover:bg-emerald-50 hover:scale-110 transition-all flex justify-center items-center text-2xl">
                                            <i className="fa-solid fa-heart"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in-up">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Time Available</label>
                                    <input type="text" placeholder="e.g. 2 hours a day, weekends only..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={contextTriangle.time} onChange={e => setContextTriangle({...contextTriangle, time: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Academic Status</label>
                                    <input type="text" placeholder="e.g. 2nd year CS student, self-taught..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={contextTriangle.academic} onChange={e => setContextTriangle({...contextTriangle, academic: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Budget / Resources</label>
                                    <input type="text" placeholder="e.g. $0, only free resources..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={contextTriangle.budget} onChange={e => setContextTriangle({...contextTriangle, budget: e.target.value})} />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={goToStep4} disabled={isGeneratingGoals} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50">
                                        {isGeneratingGoals ? <><i className="fa-solid fa-spinner fa-spin"></i> Generating...</> : <>Generate Career Goals <i className="fa-solid fa-wand-magic-sparkles"></i></>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 4: CAREER GOALS & ROADMAPS */}
                {step === 4 && (
                    <div className="animate-fade-in-up mt-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Your AI Career Blueprint</h2>
                            <p className="text-slate-500">Based on your skills, tests, personality, and context.</p>
                        </div>

                        {isGeneratingGoals ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <i className="fa-solid fa-brain fa-spin text-5xl text-emerald-500"></i>
                                <p className="text-slate-600 font-medium">Synthesizing data and building roadmaps... (10-15s)</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {careerGoals.map((goal, idx) => (
                                    <div key={idx} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                                        <div className="bg-slate-900 p-6 text-white">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="bg-indigo-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Option {idx + 1}</span>
                                                    <h3 className="text-2xl font-extrabold">{goal.title}</h3>
                                                </div>
                                                <button onClick={() => selectGoal(goal)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
                                                    Select Path
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 sm:p-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><i className="fa-solid fa-bullseye text-indigo-500"></i> Why it fits you</h4>
                                                    <p className="text-slate-600 text-sm leading-relaxed">{goal.suitabilityReason}</p>
                                                </div>
                                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><i className="fa-solid fa-briefcase text-orange-500"></i> Job Example</h4>
                                                    <p className="text-slate-600 text-sm leading-relaxed">{goal.jobExample}</p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-slate-800 text-lg">Roadmap Milestones</h4>
                                                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg"><i className="fa-regular fa-clock"></i> {goal.estimatedTime}</span>
                                                </div>
                                                <div className="flex overflow-x-auto pb-4 gap-4 snap-x">
                                                    {goal.milestones.map((m, mIdx) => (
                                                        <div key={mIdx} className="min-w-[250px] bg-white border-2 border-slate-100 rounded-2xl p-4 snap-center shrink-0 hover:border-indigo-300 transition-colors">
                                                            <div className="text-xs font-bold text-indigo-400 mb-1">Stage {mIdx + 1}</div>
                                                            <h5 className="font-bold text-slate-800 mb-2">{m.title}</h5>
                                                            <p className="text-xs text-slate-500 line-clamp-2">{m.goal}</p>
                                                            <div className="mt-3 flex flex-wrap gap-1">
                                                                {m.skills.slice(0,3).map((s, sIdx) => (
                                                                    <span key={sIdx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">{s.title}</span>
                                                                ))}
                                                                {m.skills.length > 3 && <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">+{m.skills.length - 3}</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Refinement Section */}
                                <div className="bg-indigo-50 rounded-3xl border border-indigo-100 p-6 sm:p-8">
                                    <h4 className="font-bold text-indigo-900 mb-2">Want to tweak something?</h4>
                                    <p className="text-indigo-700 text-sm mb-4">You can ask AI to change the roadmap, focus more on a specific skill, or adapt the timeline.</p>
                                    
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Make Option 1 shorter and focus heavily on React..." 
                                            className="flex-1 bg-white border border-indigo-200 rounded-xl p-4 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm"
                                            value={feedbackText}
                                            onChange={e => setFeedbackText(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleRefine()}
                                            disabled={isRefining}
                                        />
                                        <button 
                                            onClick={handleRefine}
                                            disabled={isRefining || !feedbackText.trim()}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl transition-colors disabled:opacity-50 shadow-md whitespace-nowrap"
                                        >
                                            {isRefining ? <i className="fa-solid fa-spinner fa-spin"></i> : "Refine"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
