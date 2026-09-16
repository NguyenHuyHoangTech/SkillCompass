import React, { useState, useEffect, useRef } from 'react';
import { Star, PlayCircle, Bot, Send, User, Sparkles } from 'lucide-react';
import type { Skill } from '../../types/roadmap';
import { generateMockCourses, type AICourse } from '../../services/ai';

interface AILearningHubProps {
  skill: Skill;
  onSelectCourse: (course: AICourse) => void;
  onBack: () => void;
}

export const AILearningHub: React.FC<AILearningHubProps> = ({ skill, onSelectCourse, onBack }) => {
  const [courses, setCourses] = useState<AICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialCourses = async () => {
      setLoading(true);
      try {
        const { chat_response, courses: initialCourses } = await generateMockCourses(skill.name);
        setCourses(initialCourses);
        setMessages([{ sender: 'ai', text: chat_response }]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialCourses();
  }, [skill.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || loading) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setLoading(true);

    try {
      const { chat_response, courses: newCourses } = await generateMockCourses(skill.name, userMsg);
      setCourses(newCourses);
      setMessages(prev => [...prev, { sender: 'ai', text: chat_response }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'ai', text: "Xin lỗi, đã có lỗi xảy ra. Hãy thử lại." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      
      {/* Left Area: Courses Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-2/3 xl:w-3/4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shrink-0 p-6 md:p-10 relative">
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
                ← Trở lại
            </button>
            <div className="max-w-4xl mx-auto mt-4 text-center">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
                  Không gian học tập <span className="text-amber-300">{skill.name}</span>
                </h1>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  AI đã phân tích kỹ năng và đề xuất các khóa học tối ưu nhất cho bạn. Khám phá các khóa học dưới đây hoặc trò chuyện với trợ lý AI để điều chỉnh.
                </p>
            </div>
        </div>

        {/* Course Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
            <div className="max-w-5xl mx-auto">
                <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-amber-500" /> Các Khóa học Đề xuất
                </h3>
                
                {loading && courses.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1,2,3].map(i => (
                            <div key={i} className="bg-white rounded-xl h-[320px] shadow-sm animate-pulse flex flex-col overflow-hidden">
                                <div className="bg-slate-200 h-40"></div>
                                <div className="p-4 flex-1 flex flex-col gap-3">
                                    <div className="bg-slate-200 h-6 w-3/4 rounded"></div>
                                    <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
                                    <div className="bg-slate-200 h-10 w-full rounded mt-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                                <div className="relative h-40 overflow-hidden bg-slate-200">
                                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-slate-800 rounded-md shadow-sm">
                                        {course.provider}
                                    </span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-lg text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-3 font-medium">{course.instructor}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-600 mb-4 mt-auto">
                                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md border border-amber-100">
                                            <Star size={13} className="fill-amber-500 text-amber-500" /> {course.rating.toFixed(1)}
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <User size={13} /> {course.enrolledCount.toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                                            {course.level}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => onSelectCourse(course)}
                                        className="w-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 py-2.5 rounded-lg font-bold transition-colors flex justify-center items-center gap-2"
                                    >
                                        <PlayCircle size={18} /> Vào Học Ngay
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Right Area: AI Chat Sidebar */}
      <div className="w-full lg:w-1/3 xl:w-1/4 bg-white border-l border-slate-200 flex flex-col h-full shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] absolute lg:relative z-20 translate-x-full lg:translate-x-0 transition-transform duration-300">
        <div className="p-4 bg-slate-900 text-white flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 relative">
                <Bot size={20} />
                {loading && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>}
            </div>
            <div>
                <h3 className="font-bold text-sm">Cố vấn Học tập AI</h3>
                <p className="text-[11px] text-slate-400">Tùy chỉnh danh sách khóa học</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                        msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ví dụ: Tìm khóa cơ bản hơn..."
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={loading}
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={loading || !chatInput.trim()}
                    className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                    <Send size={16} />
                </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">AI có thể điều chỉnh danh sách khóa học theo ý bạn.</p>
        </div>
      </div>

    </div>
  );
};
