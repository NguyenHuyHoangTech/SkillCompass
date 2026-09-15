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
      text: `Xin chào! Tôi là AI Career Advisor của bạn. Bạn muốn tôi tư vấn điều gì về mốc **${milestoneTitle}** hiện tại hoặc bạn có muốn tôi **Đề xuất thêm Mốc Lộ Trình Tương Lai Mới** không?`,
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
        text: `✨ Đã tự động thêm mốc tương lai **"${proposed.title}"** vào Lộ Trình của bạn! Bạn có thể xem mốc mới ở thanh Tab mốc trên cùng.`,
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
        <button className="chat-trigger-floating-btn icon-only" onClick={() => setIsOpen(true)} title="AI Advisor Tư Vấn Tương Lai">
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
                <h4>AI Advisor Tương Lai Lộ Trình</h4>
                <span className="chat-status-sub">Dữ liệu từ DB mốc: {milestoneTitle}</span>
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
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Mốc AI Đề Xuất</span>
                      </div>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '0.92rem', color: '#f8fafc', fontWeight: 700 }}>{msg.proposedMilestone.title}</h5>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>{msg.proposedMilestone.description}</p>
                      
                      {addedMilestoneIds[msg.proposedMilestone.id] ? (
                        <div className="milestone-added-badge" style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                          <CheckCircle size={16} /> Đã Thêm Vào Lộ Trình Của Bạn
                        </div>
                      ) : (
                        <button
                          className="btn-primary btn-sm"
                          style={{ width: '100%', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                          onClick={() => handleAddProposedMilestone(msg.proposedMilestone!)}
                        >
                          <PlusCircle size={16} /> Thêm Mốc Này Vào Lộ Trình
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
                  <Loader2 size={16} className="spin-icon" /> AI đang phân tích dữ liệu & tạo mốc...
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
              onClick={() => suggestPrompt('Đề xuất mốc Giai đoạn 4 AI Native Cloud cho tôi')}
            >
              🚀 Mốc AI Native (Giai đoạn 4)
            </button>
            <button
              type="button"
              className="prompt-chip"
              onClick={() => suggestPrompt('Đề xuất mốc Giai đoạn 5 Design System Lead cho tôi')}
            >
              🎨 Mốc Design System (Giai đoạn 5)
            </button>
            <button
              type="button"
              className="prompt-chip"
              onClick={() => suggestPrompt('Bao lâu nữa tôi đạt trình độ Senior với tiến độ này?')}
            >
              ⏳ Thời gian lên Senior?
            </button>
          </div>


          <form onSubmit={handleSend} className="chat-input-form">
            <input
              type="text"
              className="chat-input-field"
              placeholder="Hỏi AI hoặc đề xuất mốc tương lai..."
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
