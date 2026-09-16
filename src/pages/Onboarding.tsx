import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { 
    generateAssessmentQuestion, 
    evaluateAssessmentAnswer,
    generateSandboxScenario,
    evaluateSandboxChoice,
    generateRoadmap,
    suggestCareers,
    generateDynamicRIASECCards,
    type CareerSuggestion,
    type RiasecCard
} from '../services/ai';

export default function Onboarding() {
    const navigate = useNavigate();
    const { state, setSkills, setCareer, setSandboxFeedback, setMilestones } = useAppContext();
    const [step, setStep] = useState(1);
    const [localSkills, setLocalSkills] = useState<string[]>(state.skills || []);
    const [customSkill, setCustomSkill] = useState('');
    
    // Assessment state
    const [currentTestIndex, setCurrentTestIndex] = useState(0);
    const [assessQuestion, setAssessQuestion] = useState('Đang tải câu hỏi...');
    const [assessAnswer, setAssessAnswer] = useState('');
    const [assessFeedback, setAssessFeedback] = useState('');
    const [isAssessing, setIsAssessing] = useState(false);
    
    // Career & Sandbox state
    const [localCareer, setLocalCareer] = useState(state.career || '');
    const [sandboxScenario, setSandboxScenario] = useState('');
    const [sandboxFeedbackLocal, setSandboxFeedbackLocal] = useState('');
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

    // RIASEC State
    const [swipeIndex, setSwipeIndex] = useState(0);
    const [riasecScores, setRiasecScores] = useState<Record<string, number>>({ R:0, I:0, A:0, S:0, E:0, C:0 });
    const [careerSuggestions, setCareerSuggestions] = useState<CareerSuggestion[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    
    // Dynamic Cards State
    const [dynamicRiasecCards, setDynamicRiasecCards] = useState<RiasecCard[]>([]);
    const [isGeneratingCards, setIsGeneratingCards] = useState(false);

    const toggleSkill = (skill: string) => {
        if (localSkills.includes(skill)) {
            setLocalSkills(localSkills.filter(s => s !== skill));
        } else {
            setLocalSkills([...localSkills, skill]);
        }
    };

    const addCustomSkill = () => {
        if (customSkill.trim() && !localSkills.includes(customSkill.trim())) {
            setLocalSkills([...localSkills, customSkill.trim()]);
            setCustomSkill('');
        }
    };

    const prepareAssessment = async () => {
        if (localSkills.length === 0) {
            alert('Vui lòng chọn ít nhất 1 kỹ năng');
            return;
        }
        setSkills(localSkills);
        setStep(2);
        loadAssessmentQuestion(0);
    };

    const loadAssessmentQuestion = async (index: number) => {
        setAssessQuestion('Đang tải câu hỏi...');
        setAssessAnswer('');
        setAssessFeedback('');
        const q = await generateAssessmentQuestion(localSkills[index]);
        setAssessQuestion(q);
    };

    const submitAssessmentAnswer = async () => {
        if (!assessAnswer.trim()) return;
        setIsAssessing(true);
        const fb = await evaluateAssessmentAnswer(localSkills[currentTestIndex], assessAnswer);
        setAssessFeedback(fb);
        setIsAssessing(false);
    };

    const nextAssessment = async () => {
        if (currentTestIndex < localSkills.length - 1) {
            setCurrentTestIndex(prev => prev + 1);
            loadAssessmentQuestion(currentTestIndex + 1);
        } else {
            setStep(3);
            setIsGeneratingCards(true);
            const cards = await generateDynamicRIASECCards(localSkills);
            setDynamicRiasecCards(cards);
            setIsGeneratingCards(false);
        }
    };

    const handleSwipe = async (direction: 'left' | 'right', id: string) => {
        let newScores = { ...riasecScores };
        if (direction === 'right') {
            newScores[id] = newScores[id] + 1;
            setRiasecScores(newScores);
        }
        
        if (swipeIndex < dynamicRiasecCards.length - 1) {
            setSwipeIndex(prev => prev + 1);
        } else {
            setSwipeIndex(prev => prev + 1); // Hide last card
            setIsSuggesting(true);
            const sortedTraits = Object.keys(newScores).sort((a, b) => newScores[b] - newScores[a]);
            const top2 = sortedTraits.slice(0, 2);
            const map: Record<string, string> = { 
                R: 'Thực tế (Realistic)', I: 'Nghiên cứu (Investigative)', A: 'Nghệ thuật (Artistic)', 
                S: 'Xã hội (Social)', E: 'Dám nghĩ dám làm (Enterprising)', C: 'Mẫu mực (Conventional)' 
            };
            const traits = top2.map(k => map[k]);
            const suggestions = await suggestCareers(localSkills, traits);
            setCareerSuggestions(suggestions);
            setIsSuggesting(false);
        }
    };

    const startSandbox = async (careerOverride?: string) => {
        const targetCareer = careerOverride || localCareer;
        if (!targetCareer.trim()) {
            alert('Vui lòng chọn hoặc nhập mục tiêu sự nghiệp');
            return;
        }
        setLocalCareer(targetCareer);
        setCareer(targetCareer);
        setStep(4);
        setSandboxScenario('Đang tạo tình huống...');
        const s = await generateSandboxScenario(targetCareer);
        setSandboxScenario(s);
    };

    const handleSandboxChoice = async (choice: string) => {
        setSandboxFeedbackLocal('Đang phân tích lựa chọn của bạn...');
        const fb = await evaluateSandboxChoice(localCareer, choice);
        setSandboxFeedbackLocal(fb);
        setSandboxFeedback(fb);
    };

    const generateAndGoToRoadmap = async () => {
        setIsGeneratingRoadmap(true);
        setStep(5);
        const milestones = await generateRoadmap(localSkills, localCareer, sandboxFeedbackLocal || 'Chưa thực hiện Sandbox');
        setMilestones(milestones);
        setIsGeneratingRoadmap(false);
    };

    return (
        <div className="h-screen flex flex-col relative overflow-hidden bg-[#f8fafc]">
            {/* Header / Nav */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex justify-between items-center z-10 relative shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                        <i className="fa-solid fa-map-location-dot"></i>
                    </div>
                    <h1 className="font-bold text-lg text-slate-800 tracking-tight">SkillPath <span className="text-indigo-600">AI</span></h1>
                </div>
                
                <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span className={step >= 1 ? "text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-bold" : "px-3 py-1"}><i className="fa-solid fa-1 mr-1"></i>Balo Kỹ năng</span>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    <span className={step >= 2 ? "text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-bold" : "px-3 py-1"}><i className="fa-solid fa-2 mr-1"></i>Kiểm tra</span>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    <span className={step >= 3 ? "text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-bold" : "px-3 py-1"}><i className="fa-solid fa-3 mr-1"></i>Định hướng</span>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    <span className={step >= 4 ? "text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-bold" : "px-3 py-1"}><i className="fa-solid fa-4 mr-1"></i>Sandbox</span>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    <span className={step >= 5 ? "text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-bold" : "px-3 py-1"}><i className="fa-solid fa-5 mr-1"></i>Lộ trình</span>
                </div>
            </header>

            {/* STEP 1: CHỌN KỸ NĂNG */}
            {step === 1 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-3xl mx-auto p-4 sm:p-6 flex flex-col justify-center step-enter">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">Bạn đang mang gì trong "Balo" của mình?</h2>
                        <p className="text-slate-500 text-sm sm:text-base">Hãy chọn hoặc nhập các kỹ năng bạn ĐÃ CÓ. AI sẽ dùng nó làm nền tảng kiểm tra.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 overflow-y-auto hide-scrollbar max-h-[65vh]">
                        <div className="mb-8">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Kỹ năng Chuyên môn & Mềm</h3>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {['HTML/CSS', 'JavaScript', 'Python', 'Figma / UI Design', 'Data Analysis (Excel)', 'ChatGPT Prompts', 'Thuyết trình', 'Làm việc nhóm'].map(skill => (
                                    <button 
                                        key={skill}
                                        className={`px-4 py-2 rounded-xl border font-medium transition-all text-sm ${localSkills.includes(skill) ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                                        onClick={() => toggleSkill(skill)}
                                    >
                                        {skill}
                                    </button>
                                ))}
                                {localSkills.filter(s => !['HTML/CSS', 'JavaScript', 'Python', 'Figma / UI Design', 'Data Analysis (Excel)', 'ChatGPT Prompts', 'Thuyết trình', 'Làm việc nhóm'].includes(s)).map(skill => (
                                    <button 
                                        key={skill}
                                        className="px-4 py-2 rounded-xl border border-indigo-400 bg-indigo-600 text-white font-medium transition-all text-sm shadow-md"
                                        onClick={() => toggleSkill(skill)}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-3 shadow-inner">
                            <i className="fa-solid fa-plus text-slate-400 hidden sm:block"></i>
                            <input type="text" placeholder="Hoặc nhập kỹ năng khác (VD: Java, C#)..." className="w-full flex-1 bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none text-slate-700 font-medium focus:border-indigo-400 transition-colors text-sm" 
                                value={customSkill}
                                onChange={(e) => setCustomSkill(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                            />
                            <button onClick={addCustomSkill} className="w-full sm:w-auto bg-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-700 px-6 py-2.5 rounded-xl font-bold transition-colors text-sm whitespace-nowrap">Thêm</button>
                        </div>

                        <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                            <button onClick={prepareAssessment} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-lg">
                                Xác nhận & Kiểm tra năng lực <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: ĐÁNH GIÁ NĂNG LỰC */}
            {step === 2 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-center step-enter">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Đánh giá Năng lực Nhanh</h2>
                        <p className="text-slate-500 text-sm">AI cần xác thực trình độ thực tế của bạn để xây dựng lộ trình chuẩn xác nhất.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 relative overflow-y-auto hide-scrollbar max-h-[75vh]">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-xl text-indigo-700">{localSkills[currentTestIndex]}</h3>
                            <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold px-3 py-1.5 rounded-full">Kỹ năng {currentTestIndex + 1}/{localSkills.length}</span>
                        </div>

                        <div className="mb-5">
                            <p className="text-slate-700 font-medium leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-sm">
                                <i className="fa-solid fa-robot text-indigo-500 mr-2"></i> {assessQuestion}
                            </p>
                        </div>

                        <div className="mb-5">
                            <textarea rows={4} className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder-slate-400" placeholder="Nhập câu trả lời hoặc kinh nghiệm thực tế của bạn..."
                                value={assessAnswer} onChange={(e) => setAssessAnswer(e.target.value)} disabled={assessFeedback !== ''}></textarea>
                        </div>

                        {assessFeedback && (
                            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 items-start step-enter">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><i className="fa-solid fa-check"></i></div>
                                <div>
                                    <h4 className="font-bold text-emerald-800 text-sm">Nhận xét từ AI:</h4>
                                    <p className="text-sm text-emerald-700 mt-1">{assessFeedback}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                            {!assessFeedback ? (
                                <button onClick={submitAssessmentAnswer} disabled={isAssessing} className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                                    {isAssessing ? 'Đang phân tích...' : 'Gửi AI Đánh giá'} <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            ) : (
                                <button onClick={nextAssessment} className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md animate-bounce">
                                    {currentTestIndex === localSkills.length - 1 ? 'Hoàn tất & Chuyển sang Bước 3' : 'Kỹ năng tiếp theo'} <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: MỤC TIÊU SỰ NGHIỆP - TINDER SWIPE */}
            {step === 3 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-3xl mx-auto p-4 sm:p-6 flex flex-col justify-center step-enter items-center">
                    {isGeneratingCards ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4">
                            <i className="fa-solid fa-brain text-5xl text-indigo-500 mb-4 animate-bounce"></i>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">AI đang phân tích Balo Kỹ Năng...</h2>
                            <p className="text-slate-500">Đang thiết kế bài trắc nghiệm tâm lý đặc quyền dành riêng cho bạn</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">Khám phá Tính cách (RIASEC)</h2>
                                <p className="text-slate-500">Vuốt <b className="text-emerald-500">Phải (Thích)</b> hoặc <b className="text-red-500">Trái (Bỏ qua)</b> để AI tìm ra nghề nghiệp phù hợp nhất.</p>
                            </div>

                            {swipeIndex < dynamicRiasecCards.length && (
                                <div className="relative w-full max-w-[320px] h-[400px] flex justify-center items-center perspective-1000">
                                    <AnimatePresence>
                                        {dynamicRiasecCards.map((card, index) => {
                                            if (index === swipeIndex) {
                                                return (
                                                    <motion.div
                                                        key={card.id}
                                                className="absolute w-full h-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-center items-center text-center cursor-grab active:cursor-grabbing z-20"
                                                drag="x"
                                                dragConstraints={{ left: 0, right: 0 }}
                                                onDragEnd={(_e, { offset, velocity: _velocity }) => {
                                                    const swipe = offset.x;
                                                    if (swipe > 100) {
                                                        handleSwipe('right', card.id);
                                                    } else if (swipe < -100) {
                                                        handleSwipe('left', card.id);
                                                    }
                                                }}
                                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                                exit={{ x: 500, opacity: 0, transition: { duration: 0.2 } }}
                                                whileDrag={{ scale: 1.05, rotate: 5 }}
                                            >
                                                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6 text-2xl font-bold shadow-inner">
                                                    {card.id}
                                                </div>
                                                <h3 className="font-bold text-lg text-slate-700 leading-relaxed mb-8">{card.text}</h3>
                                                <div className="flex gap-4 w-full mt-auto">
                                                    <button onClick={() => handleSwipe('left', card.id)} className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"><i className="fa-solid fa-xmark mr-2"></i>Bỏ qua</button>
                                                    <button onClick={() => handleSwipe('right', card.id)} className="flex-1 py-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 transition-colors"><i className="fa-solid fa-heart mr-2"></i>Thích</button>
                                                </div>
                                            </motion.div>
                                        );
                                    }
                                    return null;
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    {swipeIndex >= dynamicRiasecCards.length && dynamicRiasecCards.length > 0 && (
                        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 step-enter">
                            <h3 className="font-bold text-xl text-center text-indigo-700 mb-6">
                                {isSuggesting ? <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> AI đang phân tích hồ sơ tâm lý...</> : 'Đề xuất Nghề nghiệp cho bạn'}
                            </h3>
                            
                            {!isSuggesting && (
                                <div className="space-y-4">
                                    {careerSuggestions.map((s, idx) => (
                                        <div key={idx} onClick={() => startSandbox(s.title)} className="p-5 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group bg-slate-50 hover:bg-white">
                                            <h4 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
                                                {s.title} <i className="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500"></i>
                                            </h4>
                                            <p className="text-sm text-slate-500 mt-2">{s.reason}</p>
                                        </div>
                                    ))}
                                    
                                    <div className="pt-5 mt-5 border-t border-slate-200">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Hoặc tự nhập mục tiêu khác:</p>
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="Ví dụ: Backend Developer..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" value={localCareer} onChange={(e) => setLocalCareer(e.target.value)} />
                                            <button onClick={() => startSandbox(localCareer)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-md">Tiếp tục</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    </>
                    )}
                </div>
            )}

            {/* STEP 4: AI CAREER SANDBOX */}
            {step === 4 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col justify-center step-enter">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-2">
                                    <i className="fa-solid fa-vr-cardboard text-indigo-400"></i> AI Career Sandbox
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">Đang mô phỏng: <span className="font-bold text-white">{localCareer}</span></p>
                            </div>
                            <button onClick={() => generateAndGoToRoadmap()} className="text-xs font-bold text-slate-300 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg hidden sm:block">Bỏ qua <i className="fa-solid fa-forward-step ml-1"></i></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-50 relative hide-scrollbar">
                            <div className="flex gap-3 sm:gap-4 mb-6">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm border border-indigo-200">
                                    <i className="fa-solid fa-robot"></i>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-sm max-w-2xl">
                                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-2">Tình huống thực tế ảo</span>
                                    <p className="text-slate-700 font-medium leading-relaxed text-sm">{sandboxScenario}</p>
                                </div>
                            </div>

                            <div className="sm:ml-14 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                                {['code', 'ai', 'manual', 'ask'].map((choice, i) => (
                                    <button key={choice} onClick={() => handleSandboxChoice(choice)} disabled={sandboxFeedbackLocal !== ''} className={`text-left bg-white border border-slate-200 p-4 rounded-xl transition-all group ${sandboxFeedbackLocal ? 'opacity-50' : 'hover:border-indigo-500 hover:shadow-md'}`}>
                                        <i className={`fa-solid ${['fa-code','fa-sparkles','fa-file-excel','fa-users'][i]} text-slate-400 mb-2 text-lg block`}></i>
                                        <span className="font-bold text-sm text-slate-800 block mb-1">
                                            {choice === 'code' ? 'Tự code / script' : choice === 'ai' ? 'Dùng AI' : choice === 'manual' ? 'Làm thủ công cẩn thận' : 'Hỏi người giao task'}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {sandboxFeedbackLocal && (
                                <div className="mt-6 flex gap-3 sm:gap-4 step-enter">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-200">
                                        <i className="fa-solid fa-check-double"></i>
                                    </div>
                                    <div className="bg-white border border-emerald-200 rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-sm max-w-2xl w-full">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-2">Đánh giá Sự phù hợp</span>
                                        <p className="text-slate-700 font-medium leading-relaxed text-sm mb-4">{sandboxFeedbackLocal}</p>
                                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                                            <button onClick={generateAndGoToRoadmap} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-md">
                                                Chuyển sang Lên Lộ trình <i className="fa-solid fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 5: TẠO ROADMAP LOADING */}
            {step === 5 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center step-enter z-50">
                    <i className={`fa-solid fa-rocket text-6xl text-indigo-500 mb-6 ${isGeneratingRoadmap ? 'animate-bounce' : ''}`}></i>
                    <h1 className="text-3xl font-bold mb-4">{isGeneratingRoadmap ? 'AI đang tổng hợp và vẽ Lộ trình riêng cho bạn...' : 'Đã hoàn tất!'}</h1>
                    <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                        Quá trình Onboarding kết hợp đánh giá thực tế đã xong.
                    </p>
                    {!isGeneratingRoadmap && (
                        <button onClick={() => navigate('/roadmap')} className="mt-8 bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-xl hover:-translate-y-1 flex items-center gap-3 text-lg">
                            Vào Không gian Lộ trình <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
