import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';
import { executeWithFallback } from '../../services/ai';

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

  const handleSendMessage = async (textToSend?: string) => {
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

    try {
      const prompt = `You are a friendly, expert AI Programming Tutor helping a student with their practical exercise.
Topic: "${subTopicTitle}"
Skill: "${skillName}"
Milestone: "${milestoneTitle}"
Scenario: "${scenarioText || 'General practice'}"
Student's code/answer snippet: "${userAnswerCode || 'None'}"

Student's question: "${msg}"

Provide a clear, practical, encouraging response in English (2-4 sentences max). Give code hints, best practices, or code reviews as appropriate.`;

      const aiReply = await executeWithFallback(prompt, 'SANDBOX_PRACTICE');

      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Chatbox Error:", err);
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `Regarding "${subTopicTitle}": Make sure you structure your solution logically, follow clean code principles, and test step-by-step!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { label: '💡 Solution hints', action: 'Please give me hints on the steps to solve this exercise' },
    { label: '🔍 Review my work snippet', action: 'Please review my actual practical work snippet' },
    { label: '⚡ SEO & A11y Standards', action: 'Guide me on optimizing SEO and Accessibility for this' },
    { label: '🏆 How grading works', action: 'How does the AI grade the work?' },
  ];

  return (
    <div className="exercise-ai-chatbox flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg">
      {/* Header Chat */}
      <div className="p-3.5 px-4 bg-gradient-to-r from-sky-600 to-blue-700 dark:from-slate-800 dark:to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-sky-500/30 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-full bg-white/20 dark:bg-slate-700/60 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h4 className="m-0 text-sm font-extrabold text-white">
              Practical AI Coach
            </h4>
            <span className="text-[11px] text-sky-100 dark:text-slate-300 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 🟢 Direct Guidance Assistant
            </span>
          </div>
        </div>

        <span className="text-[11px] bg-white/20 dark:bg-slate-700/80 px-2.5 py-1 rounded-full text-white font-bold">
          Dedicated Tutor
        </span>
      </div>

      {/* Messages Stream - Smooth Internal Scrolling */}
      <div className="flex-1 min-h-0 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50 dark:bg-slate-950">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[86%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'rounded-br-xs bg-sky-600 dark:bg-cyan-600 text-white shadow-md'
                  : 'rounded-bl-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
              {m.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-sky-600 dark:text-cyan-400 text-xs italic p-2">
            <Bot size={16} className="spin-icon" /> AI Coach is typing a response...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-2 px-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto hide-scrollbar">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.action)}
            className="px-2.5 py-1.5 rounded-full border border-sky-200 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-cyan-300 text-xs font-bold whitespace-nowrap hover:bg-sky-100 dark:hover:bg-slate-700 transition-colors shrink-0"
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
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask AI Coach for practical guidance..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/80 focus:border-sky-500 dark:focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className={`px-4 py-2.5 rounded-xl border-none font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 transition-all ${
            inputText.trim() && !isTyping
              ? 'bg-sky-600 dark:bg-cyan-600 hover:bg-sky-700 dark:hover:bg-cyan-500 cursor-pointer shadow-md'
              : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          <Send size={15} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
