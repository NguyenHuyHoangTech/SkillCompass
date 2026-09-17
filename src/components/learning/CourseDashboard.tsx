import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, Bot, Send, CheckCircle2, Circle, GraduationCap, Clock, BookOpen, Layers, User } from 'lucide-react';
import type { Skill } from '../../types/roadmap';
import { generateMockChecklist, type AIChecklistItem, type AICourse } from '../../services/ai';

interface CourseDashboardProps {
  skill: Skill;
  course: AICourse;
  onBack: () => void;
  onApplyChecklist: (items: string[]) => void;
  onCompleteCourse: () => void;
}

export const CourseDashboard: React.FC<CourseDashboardProps> = ({ skill, course, onBack, onApplyChecklist, onCompleteCourse }) => {
  const [checklist, setChecklist] = useState<AIChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [completedSyllabusItems, setCompletedSyllabusItems] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const syllabus = course.syllabus || [];
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If the skill is already in progress, restore checklist and bypass planning mode
    if (skill.levelPercentage > 0 && skill.subTopics && skill.subTopics.length > 0) {
      setChecklist(skill.subTopics.map(st => ({ id: st.id, title: st.title, isCompleted: st.isCompleted })));
      
      const completedIndices: number[] = [];
      skill.subTopics.forEach((st, i) => {
        if (st.isCompleted) completedIndices.push(i);
        if (st.isCompleted) completedIndices.push(i);
      });
      // We don't use setCompletedItems here for syllabus, we just set isLearningMode
      // In a real app, syllabus completion would be saved to DB. For mock, we start at 0.
      setIsLearningMode(true);
      setLoading(false);
      return;
    }

    const fetchInitialChecklist = async () => {
      setLoading(true);
      try {
        const { chat_response, checklist: initialList } = await generateMockChecklist(skill.name, course.title);
        setChecklist(initialList);
        setMessages([{ sender: 'ai', text: chat_response }]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialChecklist();
  }, [skill.id, skill.name, course.title]);

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
      const { chat_response, checklist: newList } = await generateMockChecklist(skill.name, course.title, userMsg);
      setChecklist(newList);
      setMessages(prev => [...prev, { sender: 'ai', text: chat_response }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, an error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApplyChecklist(checklist.map(i => i.title));
    setIsAnimating(true);
    setTimeout(() => {
        setIsLearningMode(true);
        setIsAnimating(false);
    }, 800);
  };

  const handleToggleSyllabusItem = (index: number) => {
    setCompletedSyllabusItems(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleFinishCourse = () => {
      onCompleteCourse();
  };

  return (
    <div className="flex w-full h-full bg-slate-900 text-slate-300 relative overflow-hidden font-sans">
      
      {/* Left Area: Video Player & Course Info */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="hover:bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    ← Close Course
                </button>
                <div className="h-6 w-px bg-slate-800"></div>
                <h1 className="font-bold text-white text-lg flex items-center gap-2">
                    <GraduationCap className="text-blue-500" />
                    {course.title}
                </h1>
            </div>
            <div className="text-xs bg-slate-800 px-3 py-1.5 rounded-full text-slate-400 font-medium border border-slate-700">
                Skill: <span className="text-amber-400">{skill.name}</span>
            </div>
        </div>

        {/* Video Player Placeholder */}
        <div className="w-full bg-black aspect-video relative flex flex-col items-center justify-center group shrink-0 border-b border-slate-800">
            <img src={course.thumbnailUrl} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <button className="relative z-10 w-20 h-20 bg-blue-600/90 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-blue-900/50">
                <PlayCircle size={40} className="ml-1" />
            </button>
            <p className="relative z-10 mt-4 text-sm text-slate-300 font-medium">Click to start the first lesson</p>
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                <h2 className="text-white font-bold text-xl drop-shadow-md">1. Introduction to {skill.name}</h2>
                <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded text-xs text-white">00:00 / 12:45</div>
            </div>
        </div>

        {/* Course Details (Below video) */}
        <div className="p-8 max-w-5xl mx-auto w-full">
            <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-700">
                    <User size={16} className="text-slate-400" /> {course.instructor}
                </div>
                <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-700">
                    <Clock size={16} className="text-slate-400" /> {course.duration}
                </div>
                <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-700">
                    <Layers size={16} className="text-slate-400" /> {course.level}
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-400" /> Course Overview
            </h3>
            <p className="text-slate-400 leading-relaxed max-w-3xl">
                {course.description}
            </p>
        </div>
      </div>

      {/* Right Area: Sidebar */}
      <div className={`w-full lg:w-[400px] xl:w-[450px] bg-slate-950 border-l border-slate-800 flex flex-col h-full absolute lg:relative z-20 ${
          isAnimating 
          ? 'transition-all duration-700 ease-in-out opacity-0 translate-y-3/4 -translate-x-full scale-50' 
          : 'transition-transform duration-300 translate-x-full lg:translate-x-0'
      }`}>
        {!isLearningMode && !isAnimating ? (
            <>
                <div className="p-5 border-b border-slate-800 bg-slate-900 flex flex-col gap-1 shrink-0">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Bot className="text-emerald-400" /> AI Checklist & Plan
                    </h3>
                    <p className="text-[12px] text-slate-400">Adjust the course plan in chat, then confirm to start learning.</p>
                </div>

        {/* Active Checklist View */}
        <div className="shrink-0 p-5 border-b border-slate-800 bg-slate-900/50">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-slate-300">Suggested Tasks:</h4>
                <span className="text-xs text-blue-400 font-medium">{checklist.length} items</span>
            </div>
            
            {loading && checklist.length === 0 ? (
                <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-800 rounded animate-pulse"></div>)}
                </div>
            ) : (
                <div className="space-y-3 max-h-[30vh] overflow-y-auto custom-scrollbar pr-2">
                    {checklist.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700 group">
                            <Circle size={16} className="text-slate-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-300 leading-snug">{item.title}</span>
                        </div>
                    ))}
                </div>
            )}
            
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                        msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-slate-800 border border-slate-700 text-slate-300 rounded-tl-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Example: Split the checklist into 7 days..."
                    className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500"
                    disabled={loading}
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={loading || !chatInput.trim()}
                    className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>

        <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-950">
            <button
                onClick={handleApply}
                disabled={checklist.length === 0 || loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
                <CheckCircle2 size={18} />
                Confirm Plan & Start Learning
            </button>
        </div>
            </>
        ) : isLearningMode ? (
            // LEARNING MODE SIDEBAR (Syllabus)
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="p-5 border-b border-slate-800 bg-slate-900 flex flex-col gap-1 shrink-0">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-blue-400" /> Lesson List
                    </h3>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{width: `${syllabus.length > 0 ? (completedSyllabusItems.length / syllabus.length) * 100 : 0}%`}}></div>
                    </div>
                    <p className="text-[12px] text-slate-400 mt-2">{completedSyllabusItems.length} / {syllabus.length} lessons completed</p>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3">
                    {syllabus.map((item, idx) => {
                        const isDone = completedSyllabusItems.includes(idx) || item.isCompleted;
                        return (
                            <div key={idx} 
                                onClick={() => handleToggleSyllabusItem(idx)}
                                className={`p-4 rounded-xl border transition-colors cursor-pointer flex gap-3 ${isDone ? 'bg-emerald-900/20 border-emerald-900/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {isDone ? <CheckCircle2 size={18} className="text-emerald-500" /> : <PlayCircle size={18} className="text-slate-600" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm font-medium ${isDone ? 'text-slate-400' : 'text-slate-200'}`}>{item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12} /> {item.duration}</p>
                                </div>
                            </div>
                        );
                    })}
                    {syllabus.length === 0 && (
                        <div className="text-sm text-slate-500 p-4 text-center">No lesson data available.</div>
                    )}
                </div>
                <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-950">
                    <button
                        onClick={handleFinishCourse}
                        disabled={completedSyllabusItems.length < syllabus.length || syllabus.length === 0}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <GraduationCap size={20} />
                        Complete Course
                    </button>
                    {completedSyllabusItems.length < syllabus.length && syllabus.length > 0 && (
                        <p className="text-xs text-center text-slate-500 mt-2">You need to watch all lesson videos to receive the certificate.</p>
                    )}
                </div>
            </div>
        ) : null}
      </div>

    </div>
  );
};
