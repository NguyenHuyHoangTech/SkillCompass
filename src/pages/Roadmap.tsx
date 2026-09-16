import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { evaluateSkillPractice, optimizeRoadmap } from '../services/ai';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Roadmap() {
    const navigate = useNavigate();
    const { state, setMilestones } = useAppContext();
    const milestones = state.milestones || [];
    
    const [selectedMilestoneId, setSelectedMilestoneId] = useState(milestones[0]?.id || '');
    const [targetCountry, setTargetCountry] = useState('Việt Nam');
    
    // AI Practice Modal State
    const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
    const [practiceSkill, setPracticeSkill] = useState<any>(null);
    const [practiceAnswer, setPracticeAnswer] = useState('');
    const [practiceFeedback, setPracticeFeedback] = useState('');
    const [isSubmittingPractice, setIsSubmittingPractice] = useState(false);

    // AI Optimizer Modal State
    const [isOptimizerModalOpen, setIsOptimizerModalOpen] = useState(false);
    const [optimizerLoading, setOptimizerLoading] = useState(false);
    const [optimizerFeedback, setOptimizerFeedback] = useState('');

    // Milestone Test Modal State
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);

    useEffect(() => {
        if (!state.career) {
            navigate('/');
        }
    }, [state.career, navigate]);

    const m = milestones.find(x => x.id === selectedMilestoneId);

    const data = {
        labels: ['UI/UX', 'Core Tech', 'Problem Solving', 'Data', 'AI Tools', 'Architecture'],
        datasets: [
            {
                label: 'Năng lực Hiện tại',
                data: [65, 50, 70, 45, 30, 20],
                backgroundColor: 'rgba(59, 130, 246, 0.25)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
            },
            {
                label: `Tiêu chuẩn ${targetCountry}`,
                data: [80, 85, 75, 60, 70, 50],
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                borderColor: 'rgba(236, 72, 153, 1)',
                borderDash: [5, 5],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: { 
                min: 0, max: 100, 
                ticks: { display: false }
            }
        },
        plugins: {
            legend: { position: 'bottom' as const }
        }
    };

    const openSkillPractice = (skill: any) => {
        setPracticeSkill(skill);
        setPracticeAnswer('');
        setPracticeFeedback('');
        setIsPracticeModalOpen(true);
    };

    const submitPractice = async () => {
        if(!practiceAnswer.trim()) return;
        setIsSubmittingPractice(true);
        const fb = await evaluateSkillPractice(practiceSkill.title, practiceSkill.ai_practice_scenario, practiceAnswer);
        setPracticeFeedback(fb);
        setIsSubmittingPractice(false);
    };

    const openOptimizer = async () => {
        setIsOptimizerModalOpen(true);
        setOptimizerLoading(true);
        setOptimizerFeedback('');
        const fb = await optimizeRoadmap(milestones, targetCountry);
        setOptimizerFeedback(fb);
        setOptimizerLoading(false);
    };

    const applyOptimizer = () => {
        // Mock updating milestone logic
        const updated = [...milestones];
        if (updated.length > 2) {
            updated[2].goal = "Đã tối ưu theo " + targetCountry;
        }
        setMilestones(updated);
        setIsOptimizerModalOpen(false);
    };

    return (
        <div className="bg-slate-50 text-slate-800 h-screen flex flex-col sm:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="w-full sm:w-[380px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0 z-20 shadow-xl">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
                            <i className="fa-solid fa-map-location-dot"></i>
                        </div>
                        <div>
                            <h1 className="font-bold text-xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">SkillPath AI</h1>
                            <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">{state.career}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 hide-scrollbar">
                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Thị trường Mục tiêu</label>
                        <div className="bg-slate-100 rounded-lg p-1.5 border border-slate-200 shadow-inner">
                            <div className="bg-white rounded-md flex items-center px-3 py-2 border border-slate-200 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                <i className="fa-solid fa-location-dot text-blue-500 mr-2"></i>
                                <input type="text" value={targetCountry} onChange={(e) => setTargetCountry(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full placeholder-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-3">
                            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Skill Gap Analysis</h2>
                        </div>
                        <div className="relative w-full aspect-square bg-slate-50/50 rounded-2xl border border-slate-100 p-2">
                            <Radar data={data} options={chartOptions} />
                        </div>
                        <p className="text-xs text-slate-500 text-center mt-3 leading-relaxed">
                            Đường nét đứt thể hiện chuẩn năng lực tại <span className="font-semibold text-slate-700">{targetCountry}</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full bg-slate-50/50 relative overflow-hidden">
                <div className="shrink-0 bg-white border-b border-slate-200 px-8 py-6 z-10 shadow-sm">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Career Milestone Pathway</h2>
                            <p className="text-sm text-slate-500 mt-1">Lộ trình dựa trên đánh giá năng lực AI.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={openOptimizer} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg border border-amber-600 flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5">
                                <i className="fa-solid fa-wand-magic-sparkles"></i> AI Tối ưu Lộ trình
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 pt-1 px-1">
                        {milestones.map((milestone) => (
                            <div key={milestone.id} onClick={() => setSelectedMilestoneId(milestone.id)} 
                                className={`shrink-0 w-64 rounded-xl border p-4 cursor-pointer transition-all hover:-translate-y-1 ${
                                    selectedMilestoneId === milestone.id 
                                    ? (milestone.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white')
                                    : (milestone.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-slate-600')
                                }`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                                        <i className={`fa-solid ${milestone.status === 'completed' ? 'fa-circle-check' : 'fa-person-running'}`}></i>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/20">{milestone.progress}%</span>
                                </div>
                                <h3 className="font-bold text-sm mb-1">{milestone.title}</h3>
                                <p className="text-[11px] opacity-80">{milestone.start_date} - {milestone.end_date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar p-8">
                    {m ? (
                        <div className="max-w-4xl mx-auto pb-10">
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Mục tiêu Giai đoạn</label>
                                    <div className="text-lg font-bold text-slate-800">{m.goal}</div>
                                </div>
                                <div className="w-full md:w-1/3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Ghi chú Cá nhân</label>
                                    <div className="text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-lg">{m.user_notes}</div>
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-layer-group text-blue-500"></i> Các Kỹ năng Cần thiết
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {m.skills?.map(skill => (
                                    <div key={skill.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider bg-slate-100 text-slate-600">{skill.category}</span>
                                            <span className="text-xs font-semibold text-blue-500">{skill.status}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">{skill.title}</h4>
                                        <p className="text-xs text-slate-500 mb-4 h-8 line-clamp-2">{skill.goal}</p>
                                        
                                        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                                            {skill.sub_tasks?.map(st => (
                                                <div key={st.id} className="flex items-start gap-2 mb-2">
                                                    <input type="checkbox" defaultChecked={st.is_completed} className="mt-1" />
                                                    <div className="flex-1">
                                                        <span className={`text-sm text-slate-700 font-medium ${st.is_completed ? 'line-through text-slate-400' : ''}`}>{st.text}</span>
                                                        {st.completion_note && <p className="text-[11px] text-emerald-600 mt-0.5"><i className="fa-solid fa-check-double mr-1"></i>{st.completion_note}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button onClick={() => openSkillPractice(skill)} className="w-full py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-indigo-700 text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                            <i className="fa-solid fa-wand-magic-sparkles"></i> AI Scenario Practice
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center border-t border-slate-200 pt-8">
                                <button onClick={() => setIsTestModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-1 inline-flex items-center gap-3">
                                    <i className="fa-solid fa-shield-check text-xl"></i> Đánh giá Tổng thể Giai đoạn
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                            Chưa có dữ liệu Roadmap. Vui lòng quay lại trang chủ.
                        </div>
                    )}
                </div>
            </div>

            {/* AI Practice Modal */}
            {isPracticeModalOpen && practiceSkill && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden modal-enter flex flex-col max-h-[90vh]">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white flex justify-between">
                            <h3 className="text-xl font-bold">{practiceSkill.title}</h3>
                            <button onClick={() => setIsPracticeModalOpen(false)}><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="bg-slate-50 border rounded-xl p-5 mb-5">
                                <h4 className="font-bold text-slate-700 mb-2"><i className="fa-solid fa-robot text-indigo-500 mr-2"></i>Tình huống AI Mentor:</h4>
                                <p className="text-sm text-slate-600">{practiceSkill.ai_practice_scenario}</p>
                            </div>
                            <textarea rows={5} className="w-full border rounded-xl p-4 text-sm focus:border-indigo-500 outline-none" placeholder="Nhập cách giải quyết của bạn..." value={practiceAnswer} onChange={(e)=>setPracticeAnswer(e.target.value)} disabled={practiceFeedback !== ''}></textarea>
                            
                            {practiceFeedback && (
                                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex justify-center items-center"><i className="fa-solid fa-check"></i></div>
                                    <div>
                                        <h4 className="font-bold text-emerald-800 text-sm">Đánh giá từ AI:</h4>
                                        <p className="text-sm text-emerald-700 mt-1">{practiceFeedback}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="border-t p-5 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setIsPracticeModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-200">Đóng</button>
                            {!practiceFeedback && (
                                <button onClick={submitPractice} disabled={isSubmittingPractice} className="px-6 py-2.5 rounded-xl text-white bg-indigo-600 font-semibold hover:bg-indigo-700">
                                    {isSubmittingPractice ? 'Đang chấm...' : 'Nộp bài'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Optimizer Modal */}
            {isOptimizerModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden modal-enter flex flex-col">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
                            <h3 className="text-xl font-bold">AI Điều chỉnh Lộ trình Tương lai</h3>
                            <p className="text-orange-100 text-sm">Cập nhật xu hướng việc làm tại {targetCountry}</p>
                        </div>
                        <div className="p-8">
                            {optimizerLoading ? (
                                <div className="text-center py-6">
                                    <i className="fa-solid fa-circle-notch fa-spin text-4xl text-orange-500 mb-4"></i>
                                    <p className="text-slate-600">Đang phân tích xu hướng...</p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                    <h4 className="font-bold text-blue-800 text-sm mb-2"><i className="fa-solid fa-database mr-2"></i>Đề xuất của AI:</h4>
                                    <p className="text-sm text-blue-700 whitespace-pre-wrap">{optimizerFeedback}</p>
                                </div>
                            )}
                        </div>
                        <div className="border-t p-5 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setIsOptimizerModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-200">Đóng</button>
                            {!optimizerLoading && (
                                <button onClick={applyOptimizer} className="px-6 py-2.5 rounded-xl text-white bg-orange-500 font-semibold hover:bg-orange-600">Cập nhật Lộ trình</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Milestone Test Modal */}
            {isTestModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden modal-enter flex flex-col">
                        <div className="p-8 text-center bg-purple-50">
                            <i className="fa-solid fa-ranking-star text-5xl text-purple-600 mb-4"></i>
                            <h3 className="text-2xl font-bold text-slate-800">Chứng nhận Hoàn thành</h3>
                            <p className="text-slate-500 mt-2 text-sm">Giai đoạn: {m?.title}</p>
                        </div>
                        <div className="p-8">
                            <div className="bg-white border rounded-xl p-5 mb-4">
                                <h4 className="font-bold text-slate-800 mb-2">Đánh giá chung:</h4>
                                <p className="text-sm text-slate-600">Bạn đã hoàn thành tốt các bài thực hành AI trong giai đoạn này. Sẵn sàng cho mốc tiếp theo!</p>
                            </div>
                        </div>
                        <div className="border-t p-5 bg-slate-50 flex justify-end">
                            <button onClick={() => setIsTestModalOpen(false)} className="px-6 py-2.5 rounded-xl text-white bg-purple-600 font-semibold hover:bg-purple-700">Tuyệt vời, Đóng lại</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
