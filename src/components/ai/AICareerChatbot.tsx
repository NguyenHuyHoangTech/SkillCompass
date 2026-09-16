import React, { useState, useRef, useEffect } from 'react';
import type { CareerChatMessage, Milestone } from '../../types/roadmap';
import { ApiService } from '../../services/apiService';
import { Send, Bot, User, Loader2, Minimize2, PlusCircle, CheckCircle } from 'lucide-react';

interface AICareerChatbotProps {
  milestoneId: string;
  milestoneTitle: string;
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
  onAddMilestone?: (newMilestone: Milestone) => void;
  isSidebarOpen?: boolean;
}

export const AICareerChatbot: React.FC<AICareerChatbotProps> = ({
  milestoneId,
  milestoneTitle,
  forceOpen,
  onCloseForceOpen,
  onAddMilestone,
  isSidebarOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addedMilestoneIds, setAddedMilestoneIds] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<CareerChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am your AI Career Advisor. What questions do you have about stage **${milestoneTitle}**, or would you like me to **Recommend New Future Roadmap Stages**?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: CareerChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await ApiService.askCareerAdvisor(userText, milestoneId);
      const aiMsg: CareerChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposedMilestone: response.proposedMilestone,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProposedMilestone = async (proposed: Milestone) => {
    if (onAddMilestone) {
      onAddMilestone(proposed);
      setAddedMilestoneIds((prev) => ({ ...prev, [proposed.id]: true }));

      const confirmMsg: CareerChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'ai',
        text: `✨ Automatically added future stage **"${proposed.title}"** to your roadmap! You can view the new stage tab at the top.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, confirmMsg]);
    }
  };

  return (
    <div className={`career-chatbot-widget ${isOpen ? 'active' : ''} ${isSidebarOpen ? 'sidebar-expanded' : ''}`}>
      {!isOpen && (
        <button
          className="chatbot-trigger-btn shadow-lg"
          onClick={() => setIsOpen(true)}
          title="Open AI Advisor Chat"
        >
          <Bot size={22} className="ai-icon-spin" />
          <span className="trigger-label font-bold">AI Advisor</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window glass-panel shadow-2xl flex flex-col">
          <div className="chatbot-header flex items-center justify-between p-3.5 bg-gradient-to-r from-sky-600 to-indigo-700 text-white rounded-t-2xl">
            <div className="header-info flex items-center gap-2.5">
              <div className="bot-avatar bg-white/20 p-1.5 rounded-xl flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold m-0 leading-tight">AI Career Advisor</h4>
                <span className="text-[11px] text-sky-150 opacity-90 block mt-0.5">
                  Consulting for: {milestoneTitle}
                </span>
              </div>
            </div>

            <button
              className="minimize-btn text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              onClick={handleClose}
              title="Minimize chat"
            >
              <Minimize2 size={16} />
            </button>
          </div>

          <div className="chatbot-messages-body flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.map((m) => (
              <div key={m.id} className={`chat-message-row flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`message-bubble max-w-[85%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-sky-600 text-white rounded-br-xs' : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs'}`}>
                  <div className="flex items-center gap-1.5 mb-1 opacity-70 text-[11px] font-bold">
                    {m.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                    <span>{m.sender === 'user' ? 'You' : 'AI Advisor'}</span>
                    <span className="ml-auto font-normal">{m.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-wrap leading-relaxed m-0 text-xs sm:text-sm">{m.text}</p>

                  {m.proposedMilestone && (
                    <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-slate-800">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-1">
                        <PlusCircle size={14} /> Proposed New Stage
                      </div>
                      <h5 className="font-extrabold text-xs text-indigo-900 m-0">{m.proposedMilestone.title}</h5>
                      <p className="text-[11px] text-indigo-700 mt-1 mb-2 leading-snug">{m.proposedMilestone.description}</p>

                      {addedMilestoneIds[m.proposedMilestone.id] ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle size={14} /> Added to Roadmap!
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddProposedMilestone(m.proposedMilestone!)}
                          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1"
                        >
                          <PlusCircle size={13} /> Add Stage to Roadmap
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2">
                <Loader2 size={16} className="animate-spin text-sky-600" />
                <span>AI Advisor is analyzing response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input-bar p-3 border-t border-slate-200 bg-white flex gap-2 rounded-b-2xl">
            <input
              type="text"
              placeholder="Ask AI Career Advisor..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-sky-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl transition-colors font-bold text-xs flex items-center justify-center gap-1 shadow-md"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
