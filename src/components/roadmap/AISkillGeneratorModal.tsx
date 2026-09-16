import React, { useState, useEffect, useRef } from 'react';
import { generateAndChatSkills } from '../../services/ai';
import type { ChatGeneratedSkill } from '../../services/ai';
import { Bot, User, Send, CheckCircle, Loader2, Minimize2, Sparkles } from 'lucide-react';
import type { Skill } from '../../types/roadmap';

interface AISkillGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneTitle: string;
  unlearnedSkills: Skill[];
  onConfirm: (skills: ChatGeneratedSkill[], replaceUnlearned: boolean) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const AISkillGeneratorModal: React.FC<AISkillGeneratorModalProps> = ({
  isOpen,
  onClose,
  milestoneTitle,
  unlearnedSkills,
  onConfirm,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [proposedSkills, setProposedSkills] = useState<ChatGeneratedSkill[]>([]);
  const [replaceUnlearned, setReplaceUnlearned] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Init chat
      setMessages([]);
      setProposedSkills([]);
      setReplaceUnlearned(true);
      handleSendInit();
    }
  }, [isOpen]);

  const handleSendInit = async () => {
    setLoading(true);
    try {
      const response = await generateAndChatSkills(milestoneTitle, unlearnedSkills, '', []);
      if (response) {
        setMessages([
          { id: `ai-${Date.now()}`, sender: 'ai', text: response.chat_response }
        ]);
        setProposedSkills(response.proposed_skills);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMsg: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: userText };
    const chatHistory = messages.map(m => ({ sender: m.sender, text: m.text }));
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateAndChatSkills(milestoneTitle, unlearnedSkills, userText, chatHistory);
      if (response) {
        setMessages(prev => [
          ...prev, 
          { id: `ai-${Date.now()}`, sender: 'ai', text: response.chat_response }
        ]);
        setProposedSkills(response.proposed_skills);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '1000px', width: '90%', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-circle" style={{ background: 'var(--accent-primary)', color: 'white' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>AI Skill Generator</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phân tích lộ trình hiện tại và tự động đề xuất</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <Minimize2 size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: '500px' }}>
          
          {/* Left: Chat */}
          <div style={{ flex: 1, borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', gap: '12px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  {msg.sender === 'ai' && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                      <Bot size={18} />
                    </div>
                  )}
                  <div style={{ 
                    padding: '12px 16px', 
                    borderRadius: '12px',
                    background: msg.sender === 'user' ? 'var(--accent-primary)' : 'white',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{msg.text}</p>
                  </div>
                  {msg.sender === 'user' && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    <Bot size={18} />
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'white', border: '1px solid var(--border-color)' }}>
                    <Loader2 size={18} className="spin-icon" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', background: 'white' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Yêu cầu AI thêm/bớt kỹ năng..."
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-color)', outline: 'none' }}
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  disabled={loading || !input.trim()}
                  style={{ 
                    width: '46px', height: '46px', borderRadius: '50%', 
                    border: 'none', background: 'var(--accent-primary)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    opacity: (!input.trim() || loading) ? 0.5 : 1
                  }}
                >
                  <Send size={18} style={{ transform: 'translateX(-2px)' }} />
                </button>
              </div>
            </form>
          </div>

          {/* Right: Suggested Skills */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} color="var(--accent-primary)" /> Danh sách đề xuất ({proposedSkills.length})
              </h4>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {proposedSkills.map((sk, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`fa-solid ${sk.icon || 'fa-star'}`}></i>
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{sk.title}</h5>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sk.description}</p>
                    </div>
                  </div>
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {sk.subTopics.map((sub, sIdx) => (
                      <li key={sIdx}>{sub.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {proposedSkills.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
                  <Sparkles size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                  <p>AI đang phân tích và chuẩn bị đề xuất...</p>
                </div>
              )}
            </div>

            {/* Confirm Section */}
            <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', background: 'white' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <input 
                  type="checkbox" 
                  checked={replaceUnlearned}
                  onChange={(e) => setReplaceUnlearned(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
                />
                Thay thế các kỹ năng chưa học (0%)
              </label>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={onClose}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button 
                  onClick={() => onConfirm(proposedSkills, replaceUnlearned)}
                  disabled={proposedSkills.length === 0 || loading}
                  style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 600, cursor: 'pointer', opacity: (proposedSkills.length === 0 || loading) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <CheckCircle size={18} /> Xác nhận & Thêm vào lộ trình
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
