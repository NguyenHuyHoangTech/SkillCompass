import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { 
    updateAIConfig,
    testGeminiKey,
    generateAssessmentQuestion, 
    evaluateAssessmentAnswer,
    generateDynamicRIASECCards,
    suggestIkigaiCareers,
    generateDualRoadmaps,
    refineRoadmap,
    generateIkigaiQuestions,
    type IkigaiCareerSuggestion,
    type RiasecCard,
    type DualRoadmapsResponse,
    type Milestone
} from '../services/ai';

export default function Onboarding() {
    const navigate = useNavigate();
    const { state, setSkills, setCareer, setMilestones } = useAppContext();
    const [step, setStep] = useState(1);
    
    // API Config State
    const [showApiConfig, setShowApiConfig] = useState(false);
    const [tempApiKey, setTempApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [tempModel, setTempModel] = useState(localStorage.getItem('gemini_model_name') || 'gemini-1.5-flash');
    const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
    const [isTestingKey, setIsTestingKey] = useState(false);
    const [testMessage, setTestMessage] = useState("Xin chào, bạn có hoạt động không?");
    const [aiReply, setAiReply] = useState("");

    const handleTestKey = async () => {
        setIsTestingKey(true);
        setTestResult(null);
        setAiReply("");
        const res = await testGeminiKey(tempApiKey, tempModel, testMessage);
        setTestResult(res);
        if (res.success) {
            updateAIConfig(tempApiKey, tempModel);
            if (res.reply) setAiReply(res.reply);
        }
        setIsTestingKey(false);
    };
    const [localSkills, setLocalSkills] = useState<string[]>(state.skills || []);
    const [customSkill, setCustomSkill] = useState('');
    
    // Assessment state (Step 2)
    const [currentTestIndex, setCurrentTestIndex] = useState(0);
    const [assessQuestion, setAssessQuestion] = useState('Đang tải câu hỏi...');
    const [assessAnswer, setAssessAnswer] = useState('');
    const [assessFeedback, setAssessFeedback] = useState('');
    const [isAssessing, setIsAssessing] = useState(false);
    
    // Ikigai Questions State (Step 3)
    const [isGeneratingIkigaiQuestions, setIsGeneratingIkigaiQuestions] = useState(false);
    const [ikigaiQuestions, setIkigaiQuestions] = useState({ love: '', money: '' });
    const [ikigaiAnswers, setIkigaiAnswers] = useState({ love: '', money: '' });

    // RIASEC State (Step 4)
    const [swipeIndex, setSwipeIndex] = useState(0);
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

    // Context Triangle (Step 7)
    const [contextTriangle, setContextTriangle] = useState({ time: '', academic: '', budget: '' });

    // Dual Roadmaps & Feedback (Step 8)
    const [isGeneratingRoadmaps, setIsGeneratingRoadmaps] = useState(false);
    const [dualRoadmaps, setDualRoadmaps] = useState<DualRoadmapsResponse | null>(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [selectedOption, setSelectedOption] = useState<1 | 2>(1);
    const [isRefining, setIsRefining] = useState(false);

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
            setStep(3); // Go to Ikigai Questions
            setIsGeneratingIkigaiQuestions(true);
            const questions = await generateIkigaiQuestions(localSkills);
            setIkigaiQuestions(questions);
            setIsGeneratingIkigaiQuestions(false);
        }
    };

    const submitIkigaiQuestions = async () => {
        if (!ikigaiAnswers.love.trim() || !ikigaiAnswers.money.trim()) {
            alert('Vui lòng trả lời cả 2 câu hỏi để AI hiểu rõ hơn về bạn nhé!');
            return;
        }
        setStep(4);
        setIsGeneratingCards(true);
        const cards = await generateDynamicRIASECCards(localSkills);
        setDynamicRiasecCards(cards);
        setIsGeneratingCards(false);
    };

    const handleSwipe = async (direction: 'left' | 'right', id: string) => {
        if (direction === 'right') {
            setRiasecScores(prev => ({ ...prev, [id]: prev[id] + 1 }));
        }
        
        if (swipeIndex < dynamicRiasecCards.length - 1) {
            setSwipeIndex(prev => prev + 1);
        } else {
            setSwipeIndex(prev => prev + 1); // Hide last card
            setStep(5); // Move to Free Text Step
        }
    };

    const goToSuggestions = async () => {
        setStep(6);
        setIsSuggesting(true);
        // Combine Ikigai answers with the free text
        const combinedIkigaiText = `Sở thích (Love): ${ikigaiAnswers.love}. Kỳ vọng thu nhập (Paid for): ${ikigaiAnswers.money}. Thông tin thêm: ${ikigaiText}`;
        const suggestions = await suggestIkigaiCareers(localSkills, riasecScores, combinedIkigaiText);
        setCareerSuggestions(suggestions);
        setIsSuggesting(false);
    };

    const refineSuggestions = async () => {
        if (!suggestionFeedback.trim()) return;
        setIsSuggesting(true);
        const combinedIkigaiText = `Sở thích: ${ikigaiAnswers.love}. Thu nhập: ${ikigaiAnswers.money}. Thêm: ${ikigaiText}. YÊU CẦU ĐIỀU CHỈNH GỢI Ý MỤC TIÊU LẦN NÀY: ${suggestionFeedback}`;
        const suggestions = await suggestIkigaiCareers(localSkills, riasecScores, combinedIkigaiText);
        setCareerSuggestions(suggestions);
        setSuggestionFeedback('');
        setIsSuggesting(false);
    };

    const selectCareer = (careerTitle: string) => {
        if (!careerTitle.trim()) {
            alert('Vui lòng chọn hoặc nhập mục tiêu sự nghiệp');
            return;
        }
        setLocalCareer(careerTitle);
        setCareer(careerTitle);
        setStep(7);
    };

    const generateFinalRoadmaps = async () => {
        if (!contextTriangle.time || !contextTriangle.academic || !contextTriangle.budget) {
            alert('Vui lòng trả lời đầy đủ 3 câu hỏi để AI lên lộ trình chính xác nhất.');
            return;
        }
        setStep(8);
        setIsGeneratingRoadmaps(true);
        const combinedIkigaiText = `Sở thích: ${ikigaiAnswers.love}. Thu nhập: ${ikigaiAnswers.money}. Thêm: ${ikigaiText}`;
        const roadmaps = await generateDualRoadmaps(localCareer, localSkills, riasecScores, combinedIkigaiText, contextTriangle);
        setDualRoadmaps(roadmaps);
        setIsGeneratingRoadmaps(false);
    };

    const handleRefine = async () => {
        if (!feedbackText.trim() || !dualRoadmaps) return;
        setIsRefining(true);
        const currentMilestones = selectedOption === 1 ? dualRoadmaps.option1.milestones : dualRoadmaps.option2.milestones;
        const refinedMilestones = await refineRoadmap(currentMilestones, feedbackText);
        
        if (!refinedMilestones) {
            alert('Lỗi: AI đang quá tải (hoặc hết Quota). Vui lòng đợi 1-2 phút rồi thử lại!');
            setIsRefining(false);
            return;
        }

        if (selectedOption === 1) {
            setDualRoadmaps({ ...dualRoadmaps, option1: { ...dualRoadmaps.option1, milestones: refinedMilestones } });
        } else {
            setDualRoadmaps({ ...dualRoadmaps, option2: { ...dualRoadmaps.option2, milestones: refinedMilestones } });
        }
        
        setFeedbackText('');
        setIsRefining(false);
        alert('Lộ trình đã được AI điều chỉnh theo yêu cầu của bạn!');
    };

    const finalizeAndGoToRoadmap = () => {
        if (!dualRoadmaps) return;
        const finalMilestones = selectedOption === 1 ? dualRoadmaps.option1.milestones : dualRoadmaps.option2.milestones;
        setMilestones(finalMilestones);
        navigate('/roadmap');
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
                
                <div className="hidden lg:flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <span className={step >= 1 ? "text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-bold" : "px-2 py-1"}>1. Kỹ năng</span><i className="fa-solid fa-chevron-right text-[8px]"></i>
                    <span className={step >= 2 ? "text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-bold" : "px-2 py-1"}>2. Test</span><i className="fa-solid fa-chevron-right text-[8px]"></i>
                    <span className={step >= 3 ? "text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-bold" : "px-2 py-1"}>3. Ikigai</span><i className="fa-solid fa-chevron-right text-[8px]"></i>
                    <span className={step >= 4 ? "text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-bold" : "px-2 py-1"}>4. RIASEC</span><i className="fa-solid fa-chevron-right text-[8px]"></i>
                    <span className={step >= 6 ? "text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-bold" : "px-2 py-1"}>5. Mục tiêu</span><i className="fa-solid fa-chevron-right text-[8px]"></i>
                    <span className={step >= 7 ? "text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-bold" : "px-2 py-1"}>6. Ngữ cảnh</span><i className="fa-solid fa-chevron-right text-[8px]"></i>
                    <span className={step >= 8 ? "text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-bold" : "px-2 py-1"}>7. Lộ trình</span>
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setShowApiConfig(!showApiConfig)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                        title="Cấu hình AI"
                    >
                        <i className="fa-solid fa-gear"></i>
                        <span className="text-sm font-medium hidden sm:inline">AI Config</span>
                    </button>

                    {showApiConfig && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
                            <h3 className="text-sm font-bold text-slate-800 mb-3">Cấu hình Gemini API</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">API Key</label>
                                    <input 
                                        type="password" 
                                        value={tempApiKey}
                                        onChange={(e) => setTempApiKey(e.target.value)}
                                        placeholder="AIzaSy..." 
                                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Model</label>
                                    <select 
                                        value={tempModel}
                                        onChange={(e) => setTempModel(e.target.value)}
                                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Nhanh)</option>
                                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Thông minh)</option>
                                        <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Exp</option>
                                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Tin nhắn test</label>
                                    <textarea 
                                        value={testMessage}
                                        onChange={(e) => setTestMessage(e.target.value)}
                                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none h-16"
                                        placeholder="Nhập tin nhắn bất kỳ..."
                                    />
                                </div>

                                <button 
                                    onClick={handleTestKey}
                                    disabled={isTestingKey || !tempApiKey || !testMessage}
                                    className="w-full bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isTestingKey ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                                    Gửi Test & Lưu
                                </button>

                                {testResult && !testResult.success && (
                                    <div className="text-xs p-2 rounded-md bg-red-50 text-red-700">
                                        <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                                        {testResult.message}
                                    </div>
                                )}
                                
                                {aiReply && (
                                    <div className="text-xs p-3 rounded-md bg-indigo-50 border border-indigo-100 text-slate-700 max-h-40 overflow-y-auto whitespace-pre-wrap">
                                        <strong className="text-indigo-700 block mb-1"><i className="fa-solid fa-robot mr-1"></i> AI Trả lời:</strong>
                                        {aiReply}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
                                    {currentTestIndex === localSkills.length - 1 ? 'Hoàn tất & Tiếp tục' : 'Kỹ năng tiếp theo'} <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: IKIGAI QUESTIONS (LOVE & MONEY) */}
            {step === 3 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-center step-enter">
                    {isGeneratingIkigaiQuestions ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4">
                            <i className="fa-solid fa-circle-notch fa-spin text-5xl text-indigo-500 mb-4"></i>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">AI đang thiết kế câu hỏi cá nhân hóa cho bạn...</h2>
                            <p className="text-slate-500">Dựa trên triết lý Ikigai và các kỹ năng bạn vừa chọn</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Đi tìm Ikigai của bạn</h2>
                                <p className="text-slate-500 text-sm">AI đã phân tích kỹ năng của bạn. Hãy trả lời thêm 2 câu hỏi sau để chúng tôi hiểu Đam mê và Kỳ vọng thu nhập của bạn.</p>
                            </div>

                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 relative overflow-y-auto hide-scrollbar max-h-[75vh]">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-indigo-700 mb-2">
                                            <i className="fa-solid fa-heart text-red-500 mr-2"></i>Sở thích (What you love)
                                        </label>
                                        <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-200">{ikigaiQuestions.love}</p>
                                        <textarea rows={3} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder-slate-400" 
                                            placeholder="Ghi ra những việc bạn làm mà không thấy chán..."
                                            value={ikigaiAnswers.love} onChange={(e) => setIkigaiAnswers({...ikigaiAnswers, love: e.target.value})}></textarea>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-indigo-700 mb-2">
                                            <i className="fa-solid fa-sack-dollar text-emerald-500 mr-2"></i>Thu nhập (What you can be paid for)
                                        </label>
                                        <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-200">{ikigaiQuestions.money}</p>
                                        <textarea rows={3} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder-slate-400" 
                                            placeholder="Bạn mong mức lương bao nhiêu, ổn định hay freelance?..."
                                            value={ikigaiAnswers.money} onChange={(e) => setIkigaiAnswers({...ikigaiAnswers, money: e.target.value})}></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                    <button onClick={submitIkigaiQuestions} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-md">
                                        Tiếp tục <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* STEP 4: MỤC TIÊU SỰ NGHIỆP - TINDER SWIPE (RIASEC) */}
            {step === 4 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-3xl mx-auto p-4 sm:p-6 flex flex-col justify-center step-enter items-center">
                    {isGeneratingCards ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4">
                            <i className="fa-solid fa-brain text-5xl text-indigo-500 mb-4 animate-bounce"></i>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">AI đang chuẩn bị Thẻ Bài Tâm Lý...</h2>
                            <p className="text-slate-500">Dựa trên mô hình Holland Codes (RIASEC) để đánh giá tính cách nghề nghiệp</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">Khám phá Tính cách (RIASEC)</h2>
                                <p className="text-slate-500">Vuốt <b className="text-emerald-500">Phải (Có)</b> hoặc <b className="text-red-500">Trái (Không)</b>. AI đang phân tích 6 khía cạnh tâm lý của bạn.</p>
                            </div>

                            {swipeIndex < dynamicRiasecCards.length && (
                                <div className="relative w-full max-w-[320px] h-[400px] flex justify-center items-center perspective-1000">
                                    <AnimatePresence>
                                        {dynamicRiasecCards.map((card, index) => {
                                            if (index === swipeIndex) {
                                                return (
                                                    <motion.div
                                                        key={card.id}
                                                        className="absolute w-full h-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 flex flex-col justify-center items-center text-center cursor-grab active:cursor-grabbing z-20"
                                                        drag="x"
                                                        dragConstraints={{ left: 0, right: 0 }}
                                                        onDragEnd={(_e, { offset, _velocity }) => {
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
                                                            <button onClick={() => handleSwipe('left', card.id)} className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"><i className="fa-solid fa-xmark mr-2"></i>Không</button>
                                                            <button onClick={() => handleSwipe('right', card.id)} className="flex-1 py-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 transition-colors"><i className="fa-solid fa-check mr-2"></i>Có</button>
                                                        </div>
                                                    </motion.div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* STEP 5: FREE TEXT */}
            {step === 5 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-center step-enter">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Chia sẻ tự do (Tuỳ chọn)</h2>
                        <p className="text-slate-500 text-sm">Bạn có muốn bổ sung thêm định hướng nghề nghiệp, hay còn điều gì trăn trở muốn AI phân tích không?</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 relative">
                        <div className="mb-5">
                            <textarea rows={4} className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder-slate-400 resize-none" 
                                placeholder="Có thể bỏ trống hoặc nhập thêm bất cứ thông tin nào..."
                                value={ikigaiText} onChange={(e) => setIkigaiText(e.target.value)}></textarea>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                            <button onClick={goToSuggestions} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-md">
                                Gửi AI Phân tích Mục tiêu <i className="fa-solid fa-magic"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 6: CAREER SUGGESTIONS & MINI ROADMAP */}
            {step === 6 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col justify-center step-enter items-center">
                    {isSuggesting ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4">
                            <i className="fa-solid fa-circle-notch fa-spin text-5xl text-indigo-500 mb-4"></i>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">AI đang phân tích Ikigai và RIASEC...</h2>
                            <p className="text-slate-500">Đang ghép nối kỹ năng, tính cách và mong muốn của bạn với dữ liệu thị trường</p>
                        </div>
                    ) : (
                        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 step-enter max-h-[85vh] overflow-y-auto hide-scrollbar">
                            <h3 className="font-bold text-2xl text-center text-slate-800 mb-8">AI Đề Xuất Mục Tiêu Cho Bạn</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {careerSuggestions.map((s, idx) => (
                                    <div key={idx} className="p-5 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all bg-white flex flex-col h-full relative group">
                                        <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            {idx + 1}
                                        </div>
                                        <h4 className="font-bold text-lg text-indigo-700 mb-2">{s.title}</h4>
                                        <p className="text-sm text-slate-600 mb-4 flex-1 italic">"{s.reason}"</p>
                                        
                                        <div className="mb-4">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Phác thảo lộ trình (Mini-Roadmap)</span>
                                            <ul className="space-y-1">
                                                {s.mini_roadmap.map((step, i) => (
                                                    <li key={i} className="text-xs text-slate-700 flex gap-2">
                                                        <i className="fa-solid fa-arrow-right text-indigo-400 mt-0.5 text-[10px]"></i> {step}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="bg-indigo-50 p-3 rounded-xl mb-5">
                                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">Ví dụ thực tế</span>
                                            <p className="text-xs text-indigo-800 font-medium">{s.real_world_example}</p>
                                        </div>

                                        <button onClick={() => selectCareer(s.title)} className="mt-auto w-full py-2.5 bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white font-bold rounded-xl transition-colors text-sm">
                                            Chọn Mục Tiêu Này
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="pt-6 mt-6 border-t border-slate-200 bg-slate-50 p-6 rounded-2xl flex flex-col gap-5">
                                <div>
                                    <h4 className="font-bold text-slate-700 mb-1">Không thích các gợi ý trên?</h4>
                                    <p className="text-xs text-slate-500">Cung cấp thêm thông tin để AI gợi ý lại, hoặc tự định hướng mục tiêu cụ thể của bạn.</p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4 w-full">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <span className="text-xs font-bold text-indigo-600">Cách 1: Yêu cầu AI gợi ý hướng khác</span>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="VD: Tôi muốn làm các mảng liên quan đến Data hơn..." className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-inner" value={suggestionFeedback} onChange={(e) => setSuggestionFeedback(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && refineSuggestions()} />
                                            <button onClick={refineSuggestions} className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-colors shadow-sm whitespace-nowrap"><i className="fa-solid fa-arrows-rotate mr-2"></i>Gợi ý lại</button>
                                        </div>
                                    </div>

                                    <div className="hidden sm:block w-px bg-slate-200"></div>

                                    <div className="flex-1 flex flex-col gap-2">
                                        <span className="text-xs font-bold text-emerald-600">Cách 2: Tự nhập mục tiêu bạn đã chốt</span>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="VD: Data Analyst..." className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 transition-all shadow-inner" value={localCareer} onChange={(e) => setLocalCareer(e.target.value)} />
                                            <button onClick={() => selectCareer(localCareer)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-md whitespace-nowrap">Chọn</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 7: CONTEXT TRIANGLE FORM */}
            {step === 7 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-center step-enter">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Tam Giác Ngữ Cảnh</h2>
                        <p className="text-slate-500 text-sm">Cung cấp 3 thông tin thực tế này để AI xây dựng Lộ trình khả thi nhất cho bạn đối với mục tiêu: <b>{localCareer}</b></p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 relative space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2"><i className="fa-regular fa-clock text-indigo-500 mr-2"></i>Quỹ thời gian (Time Commitment)</label>
                            <select className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none transition-all bg-slate-50"
                                value={contextTriangle.time} onChange={(e) => setContextTriangle({...contextTriangle, time: e.target.value})}>
                                <option value="">-- Chọn thời gian bạn có thể dành ra --</option>
                                <option value="Rảnh rỗi, có thể học toàn thời gian (40h/tuần)">Học toàn thời gian (40h/tuần)</option>
                                <option value="Chỉ rảnh buổi tối và cuối tuần (15-20h/tuần)">Rảnh buổi tối & cuối tuần (15-20h/tuần)</option>
                                <option value="Khá bận rộn, chỉ học được rất ít (5-10h/tuần)">Khá bận rộn (5-10h/tuần)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2"><i className="fa-solid fa-graduation-cap text-indigo-500 mr-2"></i>Trạng thái học vấn (Academic Status)</label>
                            <select className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none transition-all bg-slate-50"
                                value={contextTriangle.academic} onChange={(e) => setContextTriangle({...contextTriangle, academic: e.target.value})}>
                                <option value="">-- Chọn tình trạng hiện tại --</option>
                                <option value="Sinh viên năm 1-2 đúng chuyên ngành IT">Sinh viên năm 1-2 đúng ngành IT</option>
                                <option value="Sinh viên năm 3-4 chuẩn bị thực tập">Sinh viên năm 3-4 chuẩn bị thực tập/ra trường</option>
                                <option value="Người làm trái ngành muốn chuyển hướng sang IT">Trái ngành muốn chuyển sang IT</option>
                                <option value="Đã đi làm IT muốn nâng cao tay nghề">Đã đi làm IT, muốn nâng cao năng lực</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2"><i className="fa-solid fa-wallet text-indigo-500 mr-2"></i>Nguồn lực / Tài chính (Budget)</label>
                            <select className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none transition-all bg-slate-50"
                                value={contextTriangle.budget} onChange={(e) => setContextTriangle({...contextTriangle, budget: e.target.value})}>
                                <option value="">-- Chọn khả năng đầu tư --</option>
                                <option value="Muốn học hoàn toàn miễn phí (Tự học qua Youtube, Docs)">Hoàn toàn miễn phí (Youtube, Docs...)</option>
                                <option value="Có thể mua các khóa học online giá rẻ (Udemy, Coursera)">Đầu tư khóa học online (Udemy, Coursera...)</option>
                                <option value="Sẵn sàng chi trả cho chứng chỉ quốc tế và bootcamp đắt tiền">Sẵn sàng chi cho Bootcamp & Chứng chỉ quốc tế đắt tiền</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
                            <button onClick={generateFinalRoadmaps} className="w-full bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-lg text-lg">
                                Lên Lộ Trình Ngay <i className="fa-solid fa-rocket"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 8: DUAL ROADMAPS & FEEDBACK REFINEMENT */}
            {step === 8 && (
                <div className="absolute inset-0 top-[73px] w-full max-w-6xl mx-auto p-4 sm:p-6 flex flex-col step-enter overflow-hidden">
                    {isGeneratingRoadmaps ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4">
                            <i className="fa-solid fa-cogs fa-spin text-5xl text-indigo-500 mb-4"></i>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Đang tổng hợp dữ liệu và thiết kế 2 Lộ trình...</h2>
                            <p className="text-slate-500">AI đang cân nhắc kỹ năng, Ikigai và Tam giác ngữ cảnh của bạn</p>
                        </div>
                    ) : dualRoadmaps ? (
                        <div className="flex flex-col h-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-300 shadow-xl relative">
                            {isRefining && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                                    <i className="fa-solid fa-wand-magic-sparkles text-4xl text-indigo-600 animate-bounce mb-4"></i>
                                    <h3 className="text-xl font-bold text-slate-800">AI đang tinh chỉnh lại lộ trình theo yêu cầu của bạn...</h3>
                                </div>
                            )}
                            
                            <div className="bg-white p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center border-b border-slate-200 shrink-0 shadow-sm z-10">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-800">Chọn 1 trong 2 Lộ trình</h2>
                                    <p className="text-xs text-slate-500 mt-1">AI đã thiết kế 2 hướng đi dựa trên Hồ sơ cá nhân của bạn</p>
                                </div>
                                <button onClick={finalizeAndGoToRoadmap} className="mt-3 sm:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md">
                                    Chốt Lộ trình {selectedOption} & Bắt đầu <i className="fa-solid fa-play"></i>
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                                {/* Option 1 */}
                                <div className={`flex-1 overflow-y-auto hide-scrollbar border-r border-slate-200 transition-all ${selectedOption === 1 ? 'bg-indigo-50/30' : 'bg-slate-50 opacity-60 hover:opacity-100 cursor-pointer'}`} onClick={() => setSelectedOption(1)}>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Lựa chọn 1</span>
                                            {selectedOption === 1 && <i className="fa-solid fa-circle-check text-indigo-600 text-xl"></i>}
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{dualRoadmaps.option1.title}</h3>
                                        <p className="text-sm text-slate-600 mb-6">{dualRoadmaps.option1.description}</p>
                                        
                                        <div className="space-y-4">
                                            {dualRoadmaps.option1.milestones.map((m, i) => (
                                                <div key={i} className={`p-4 rounded-xl border ${selectedOption === 1 ? 'bg-white border-indigo-200 shadow-sm' : 'border-slate-300'}`}>
                                                    <h4 className="font-bold text-indigo-700 text-sm mb-1">{m.title}</h4>
                                                    <p className="text-xs text-slate-500 font-medium">{m.goal}</p>
                                                    <div className="mt-3 flex gap-2 flex-wrap">
                                                        {(m.skills || []).map((s, idx) => (
                                                            <span key={idx} className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-600">{s.title}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Option 2 */}
                                <div className={`flex-1 overflow-y-auto hide-scrollbar transition-all ${selectedOption === 2 ? 'bg-indigo-50/30' : 'bg-slate-50 opacity-60 hover:opacity-100 cursor-pointer'}`} onClick={() => setSelectedOption(2)}>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Lựa chọn 2</span>
                                            {selectedOption === 2 && <i className="fa-solid fa-circle-check text-emerald-600 text-xl"></i>}
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{dualRoadmaps.option2.title}</h3>
                                        <p className="text-sm text-slate-600 mb-6">{dualRoadmaps.option2.description}</p>
                                        
                                        <div className="space-y-4">
                                            {dualRoadmaps.option2.milestones.map((m, i) => (
                                                <div key={i} className={`p-4 rounded-xl border ${selectedOption === 2 ? 'bg-white border-emerald-200 shadow-sm' : 'border-slate-300'}`}>
                                                    <h4 className="font-bold text-emerald-700 text-sm mb-1">{m.title}</h4>
                                                    <p className="text-xs text-slate-500 font-medium">{m.goal}</p>
                                                    <div className="mt-3 flex gap-2 flex-wrap">
                                                        {(m.skills || []).map((s, idx) => (
                                                            <span key={idx} className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-600">{s.title}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Form (Bottom Bar) */}
                            <div className="bg-white border-t border-slate-300 p-4 sm:p-5 shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                <div className="flex flex-col sm:flex-row gap-4 items-center mb-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Muốn điều chỉnh lộ trình? Hãy chọn: 
                                    </p>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button onClick={() => setSelectedOption(1)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedOption === 1 ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>Lựa chọn 1</button>
                                        <button onClick={() => setSelectedOption(2)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedOption === 2 ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}>Lựa chọn 2</button>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="text" placeholder={`Ví dụ: Thêm kỹ năng ReactJS vào mốc 1 của Lựa chọn ${selectedOption}...`} 
                                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} 
                                        onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                                    />
                                    <button onClick={handleRefine} className="bg-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-700 px-6 py-2.5 rounded-xl font-bold transition-colors text-sm whitespace-nowrap shadow-sm">
                                        <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Điều chỉnh Lựa chọn {selectedOption}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
