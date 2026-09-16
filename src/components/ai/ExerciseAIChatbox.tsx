import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface ExerciseAIChatboxProps {
  subTopicTitle: string;
  skillName: string;
  milestoneTitle: string;
  scenarioText?: string;
  userAnswerCode?: string;
}

export const ExerciseAIChatbox: React.FC<ExerciseAIChatboxProps> = ({
  subTopicTitle,
  skillName,
  milestoneTitle,
  scenarioText,
  userAnswerCode = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat context when topic changes
  useEffect(() => {
    const initialMsgs: Message[] = [
      {
        id: 'msg-init-1',
        sender: 'ai',
        text: `👋 Hello! I am your AI Coach for practical exercises.\n\nI will accompany you through the exercise "${subTopicTitle}" under the skill ${skillName} (${milestoneTitle}).\n\n💡 You can ask me for solutions, step-by-step hints, ask me to review your code snippet, or click the quick prompt buttons below!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(initialMsgs);
  }, [subTopicTitle, skillName, milestoneTitle]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate smart AI response tailored to practical exercise
    setTimeout(() => {
      let aiReply = '';
      const lower = msg.toLowerCase();

      if (lower.includes('hint') || lower.includes('step 1') || lower.includes('start')) {
        aiReply = `💡 Practical Guidance Hint for "${subTopicTitle}":\n\n1. Step 1: Analyze structure: Identify the main components of the exercise.\n2. Step 2: Use Standard Tags: Use correct semantic tags (<header>, <nav>, <main>, <article>, <footer>).\n3. Step 3: Optimize Accessibility: Add alt attributes, aria-labels, and clear h1-h3 headings.\n\nWould you like me to show a sample of standard HTML code?`;
      } else if (lower.includes('check') || lower.includes('code') || lower.includes('review')) {
        if (userAnswerCode.trim().length > 0) {
          aiReply = `🔍 AI Review Of Your Work:\n\nYour submitted snippet:\n${userAnswerCode.slice(0, 150)}...\n\n✅ Preliminary assessment: Your structure is on the right track! It shows a logical data organization mindset.\n\n📌 Recommendation: Ensure heading tag hierarchy is not skipped and check color contrast for mobile display.`;
        } else {
          aiReply = `🔍 Please enter your solution or code snippet into the workspace on the left, then message me "Review code" so I can evaluate it in detail!`;
        }
      } else if (lower.includes('seo') || lower.includes('accessibility') || lower.includes('a11y')) {
        aiReply = `⚡ SEO & Accessibility Tips:\n- Only use one <h1> tag per page.\n- Add lang="en" attribute to <html> tag and descriptive alt text for all images.\n- Use <button> tags for clickable actions instead of <div onClick>.`;
      } else if (lower.includes('grade') || lower.includes('submit')) {
        aiReply = `🏆 Click the "🏆 Submit for AI Coach to Grade" button at the bottom left to have the AI system calculate your percentage score and save the result to your Roadmap!`;
      } else {
        aiReply = `🤖 Regarding the practical exercise "${subTopicTitle}":\n\nYou need to focus on applying practical design principles. ${scenarioText ? `Pay special attention to the project scenario: ${scenarioText.slice(0, 90)}...` : ''}\n\nDo you need me to explain any part in more detail?`;
      }

      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 750);
  };

  const quickPrompts = [
    { label: '💡 Solution hints', action: 'Please give me hints on the steps to solve this exercise' },
    { label: '🔍 Review my work snippet', action: 'Please review my actual practical work snippet' },
    { label: '⚡ SEO & A11y Standards', action: 'Guide me on optimizing SEO and Accessibility for this' },
    { label: '🏆 How grading works', action: 'How does the AI grade the work?' },
  ];

  return (
    <div className="exercise-ai-chatbox glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '16px', border: '1px solid #bae6fd', background: '#ffffff', overflow: 'hidden' }}>
      {/* Header Chat */}
      <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} color="#ffffff" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#ffffff' }}>
              Practical AI Coach
            </h4>
            <span style={{ fontSize: '0.74rem', color: '#e0f2fe', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} /> 🟢 Direct Guidance Assistant
            </span>
          </div>
        </div>

        <span style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: '20px', color: '#ffffff', fontWeight: 700 }}>
          Dedicated Tutor
        </span>
      </div>

      {/* Messages Stream - Smooth Internal Scrolling */}
      <div style={{ flex: 1, minHeight: 0, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '86%',
                padding: '12px 14px',
                borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                background: m.sender === 'user' ? '#0284c7' : '#ffffff',
                color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                boxShadow: m.sender === 'user' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
                fontSize: '0.86rem',
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.text}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px', padding: '0 4px' }}>
              {m.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.8rem', fontStyle: 'italic', padding: '8px' }}>
            <Bot size={16} className="spin-icon" /> AI Coach is typing a response...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div style={{ padding: '8px 12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.action)}
            style={{
              padding: '6px 10px',
              borderRadius: '20px',
              border: '1px solid #bae6fd',
              background: '#f0f9ff',
              color: '#0369a1',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Text Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{ padding: '12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}
      >
        <input
          type="text"
          placeholder="Ask AI Coach for practical guidance..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            outline: 'none',
            fontSize: '0.86rem',
            color: '#0f172a',
            background: '#f8fafc',
          }}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            background: '#0284c7',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            opacity: inputText.trim() ? 1 : 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Send size={15} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
