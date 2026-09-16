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
      text: `Hello! I am your AI Career Advisor. What would you like to ask about the current stage **${milestoneTitle}** or would you like me to **Propose a New Future Roadmap Stage**?`,
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
        text: `✨ Automatically added future stage **"${proposed.title}"** to your Roadmap! You can view the new stage in the top tabs.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, confirmMsg]);
    }
  };

  const suggestPrompt = (text: string) => {
    setInput(text);
  };

  // If left sidebar menu is open, hide AI Career Chatbot completely
  if (isSidebarOpen) {
    return null;
  }

  return (
    <div className="career-chatbot-widget">
      {!isOpen && (
        <button className="chat-trigger-floating-btn icon-only" onClick={() => setIsOpen(true)} title="AI Advisor Future Consultation">
          <div className="chat-btn-glow"></div>
          <Bot size={26} />
        </button>
      )}

      {isOpen && (
        <div className="chat-drawer-container prominent-modal">
          <div className="chat-drawer-header">
            <div className="chat-header-title">
              <Bot size={20} className="ai-icon-glow" />
              <div>
                <h4>Future Roadmap AI Advisor</h4>
                <span className="chat-status-sub">Stage DB data: {milestoneTitle}</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={handleClose}>
              <Minimize2 size={18} />
            </button>
          </div>

          <div className="chat-drawer-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                <div className="msg-avatar">
                  {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="msg-bubble">
                  <div className="msg-text">{msg.text}</div>

                  {/* Render Action to Add Proposed Milestone */}
                  {msg.proposedMilestone && (
                    <div className="proposed-milestone-card-preview glass-card" style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.25)', background: 'rgba(15, 23, 42, 0.6)' }}>
                      <div className="proposed-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span className="badge-tag" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {msg.proposedMilestone.badge}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>AI Proposed Stage</span>
                      </div>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '0.92rem', color: '#f8fafc', fontWeight: 700 }}>{msg.proposedMilestone.title}</h5>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>{msg.proposedMilestone.description}</p>
                      
                      {addedMilestoneIds[msg.proposedMilestone.id] ? (
                        <div className="milestone-added-badge" style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                          <CheckCircle size={16} /> Added To Your Roadmap
                        </div>
                      ) : (
                        <button
                          className="btn-primary btn-sm"
                          style={{ width: '100%', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                          onClick={() => handleAddProposedMilestone(msg.proposedMilestone!)}
                        >
                          <PlusCircle size={16} /> Add This Stage To Roadmap
                        </button>
                      )}
                    </div>
                  )}

                  <span className="msg-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message-row ai loading">
                <div className="msg-avatar">
                  <Bot size={16} />
                </div>
                <div className="msg-bubble loading">
                  <Loader2 size={16} className="spin-icon" /> AI is analyzing data & creating stage...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="chat-quick-prompts">
            <button
              type="button"
              className="prompt-chip"
              onClick={() => suggestPrompt('Propose Stage 4 AI Native Cloud for me')}
            >
              🚀 AI Native Stage (Stage 4)
            </button>
            <button
              type="button"
              className="prompt-chip"
              onClick={() => suggestPrompt('Propose Stage 5 Design System Lead for me')}
            >
              🎨 Design System Stage (Stage 5)
            </button>
            <button
              type="button"
              className="prompt-chip"
              onClick={() => suggestPrompt('How long until I reach Senior level with this progress?')}
            >
              ⏳ Time to reach Senior?
            </button>
          </div>


          <form onSubmit={handleSend} className="chat-input-form">
            <input
              type="text"
              className="chat-input-field"
              placeholder="Ask AI or request a future stage..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="chat-send-btn" disabled={!input.trim() || loading}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
