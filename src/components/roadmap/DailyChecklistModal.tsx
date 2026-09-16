import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, X, CalendarDays, Send, Sparkles } from 'lucide-react';
import type { Milestone, Skill, SubTopic } from '../../types/roadmap';

interface DailyChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: Milestone[];
  onToggleTask: (skill: Skill, subTopic: SubTopic, completed: boolean) => void;
}

export const DailyChecklistModal: React.FC<DailyChecklistModalProps> = ({
  isOpen,
  onClose,
  milestones,
  onToggleTask,
}) => {
  const [tasks, setTasks] = useState<{skill: Skill, subTopic: SubTopic}[]>([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Gather all incomplete SubTopics from skills that are In Progress (levelPercentage > 0 && < 100)
      const gatheredTasks: {skill: Skill, subTopic: SubTopic}[] = [];
      milestones.forEach(ms => {
          ms.categories.forEach(cat => {
              cat.skills.forEach(skill => {
                  if (skill.levelPercentage > 0 && skill.levelPercentage < 100) {
                      skill.subTopics.forEach(st => {
                          if (!st.isCompleted) {
                              gatheredTasks.push({ skill: skill, subTopic: st });
                          }
                      });
                  }
              });
          });
      });
      setTasks(gatheredTasks);

      // Initial AI Message
      if (gatheredTasks.length > 0 && messages.length === 0) {
          setMessages([{ sender: 'ai', text: `Chào bạn, bạn đang có ${gatheredTasks.length} nhiệm vụ cần hoàn thành từ các khóa học đang học. Bạn muốn tôi gợi ý kế hoạch học tập cho hôm nay thế nào?` }]);
      } else if (gatheredTasks.length === 0 && messages.length === 0) {
          setMessages([{ sender: 'ai', text: `Bạn hiện chưa có khóa học nào đang học dở hoặc đã hoàn thành hết các nhiệm vụ. Hãy chọn một khóa học mới nhé!` }]);
      }
    }
  }, [isOpen, milestones]);

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
      // For mock purposes, we just simulate a delay and a generic response
      // In a real app, this would call an AI service passing `tasks` and `userMsg` to sort/prioritize them.
      await new Promise(r => setTimeout(r, 1500));
      setMessages(prev => [...prev, { 
          sender: 'ai', 
          text: "Tôi đã sắp xếp lại các nhiệm vụ theo yêu cầu của bạn. Hãy tập trung vào những mục trên cùng trước nhé!" 
      }]);
      // Shuffle tasks as a mock "reorganization"
      setTasks(prev => [...prev].sort(() => Math.random() - 0.5));
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'ai', text: "Xin lỗi, đã có lỗi xảy ra." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
       <div className="flex flex-col md:flex-row w-full max-w-5xl h-full max-h-[85vh] bg-slate-50 relative overflow-hidden rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
           
           <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full shadow-sm transition-colors"
            >
                <X size={20} />
            </button>

           {/* Left: AI Organizer Chat */}
           <div className="w-full md:w-[400px] bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
               <div className="p-6 border-b border-slate-800 bg-slate-950">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-amber-400" /> AI Organizer
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        Trợ lý AI giúp bạn sắp xếp kế hoạch học tập mỗi ngày một cách hiệu quả nhất.
                    </p>
               </div>
               
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

               <div className="p-4 bg-slate-950 border-t border-slate-800">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Vd: Chọn cho tôi 3 task quan trọng nhất hôm nay"
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
           </div>

           {/* Right: Checklist */}
           <div className="flex-1 flex flex-col bg-slate-50">
               <div className="p-6 md:p-8 border-b border-slate-200 bg-white">
                   <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                       <CalendarDays className="text-blue-600 w-8 h-8" />
                       Checklist Hàng Ngày
                   </h1>
                   <p className="text-slate-500 mt-2">Tổng hợp các bài học bạn đang theo đuổi.</p>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                   {tasks.length === 0 ? (
                       <div className="text-center py-20">
                           <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                               <CheckCircle2 className="text-slate-400 w-10 h-10" />
                           </div>
                           <h3 className="text-lg font-bold text-slate-700">Tất cả đã hoàn thành!</h3>
                           <p className="text-slate-500 mt-2">Bạn không có bài học nào đang dở dang.</p>
                       </div>
                   ) : (
                       <div className="space-y-4">
                           {tasks.map((task) => (
                               <div key={task.subTopic.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                                   <button 
                                        onClick={() => {
                                            onToggleTask(task.skill, task.subTopic, true);
                                            // Optimistically remove from view
                                            setTasks(prev => prev.filter(t => t.subTopic.id !== task.subTopic.id));
                                        }}
                                        className="mt-1 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                                    >
                                       <Circle size={24} />
                                   </button>
                                   <div>
                                       <h4 className="font-bold text-slate-800 text-lg">{task.subTopic.title}</h4>
                                       <p className="text-sm text-blue-600 font-medium mt-1">Từ khóa học: {task.skill.name}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
               </div>
           </div>

       </div>
    </div>
  );
};
