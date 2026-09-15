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
        text: `👋 Chào bạn! Tôi là AI Coach hướng dẫn bài tập thực tế.\n\nTôi sẽ đồng hành cùng bạn thực hiện bài tập "${subTopicTitle}" thuộc kỹ năng ${skillName} (${milestoneTitle}).\n\n💡 Bạn có thể hỏi tôi cách giải quyết, lấy gợi ý từng bước, nhờ tôi review đoạn mã code của bạn, hoặc bấm các nút hỏi nhanh bên dưới nhé!`,
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

      if (lower.includes('gợi ý') || lower.includes('bước 1') || lower.includes('bắt đầu')) {
        aiReply = `💡 Gợi Ý Hướng Dẫn Thực Hành Bài "${subTopicTitle}":\n\n1. Bước 1: Phân tích cấu trúc: Xác định các thành phần chính của bài tập.\n2. Bước 2: Sử dụng Tag Chuẩn: Sử dụng đúng thẻ semantic ngữ nghĩa (<header>, <nav>, <main>, <article>, <footer>).\n3. Bước 3: Tối ưu Accessibility: Bổ sung các thuộc tính alt, aria-label và tiêu đề h1-h3 rõ ràng.\n\nBạn có muốn tôi làm mẫu một đoạn code HTML chuẩn không?`;
      } else if (lower.includes('kiểm tra') || lower.includes('code') || lower.includes('review')) {
        if (userAnswerCode.trim().length > 0) {
          aiReply = `🔍 AI Review Bài Làm Của Bạn:\n\nĐoạn bài làm của bạn:\n${userAnswerCode.slice(0, 150)}...\n\n✅ Đánh giá sơ bộ: Cấu trúc của bạn đi đúng hướng! Thể hiện được tư duy tổ chức dữ liệu hợp lý.\n\n📌 Khuyên dùng: Đảm bảo phân cấp thẻ tiêu đề không bị nhảy cấp và kiểm tra độ tương phản màu sắc khi hiển thị trên mobile.`;
        } else {
          aiReply = `🔍 Bạn hãy nhập giải pháp hoặc mã code của bạn vào khung bài làm bên trái, sau đó nhắn cho tôi "Kiểm tra code" để tôi đánh giá chi tiết nhé!`;
        }
      } else if (lower.includes('seo') || lower.includes('accessibility') || lower.includes('a11y')) {
        aiReply = `⚡ Mẹo Chuẩn SEO & Accessibility:\n- Chỉ sử dụng duy nhất 1 thẻ <h1> trên mỗi trang.\n- Thêm thuộc tính lang="vi" ở thẻ <html> và alt mô tả ý nghĩa cho mọi hình ảnh.\n- Dùng thẻ <button> cho hành động bấm thay vì <div onClick>.`;
      } else if (lower.includes('chấm điểm') || lower.includes('nộp')) {
        aiReply = `🏆 Bạn nhấn nút "🏆 Nộp Bài Chấm Điểm" ở góc bên trái bài làm để hệ thống AI tính điểm phần trăm và lưu kết quả vào Lộ Trình của bạn nhé!`;
      } else {
        aiReply = `🤖 Đối với bài tập thực tế "${subTopicTitle}":\n\nBạn cần tập trung vào việc áp dụng đúng nguyên lý thiết kế thực tiễn. ${scenarioText ? `Đặc biệt lưu ý tình huống dự án: ${scenarioText.slice(0, 90)}...` : ''}\n\nBạn cần tôi giải thích thêm về phần nào không?`;
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
    { label: '💡 Gợi ý bước giải', action: 'Cho tôi xin gợi ý các bước giải quyết bài tập này' },
    { label: '🔍 Review đoạn bài làm', action: 'Hãy kiểm tra đoạn bài làm thực tế của tôi' },
    { label: '⚡ Chuẩn SEO & A11y', action: 'Hướng dẫn tối ưu chuẩn SEO và Accessibility cho bài này' },
    { label: '🏆 Cách chấm điểm', action: 'Cách thức AI chấm điểm bài làm như thế nào?' },
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
              AI Coach Hướng Dẫn Bài Thực Tế
            </h4>
            <span style={{ fontSize: '0.74rem', color: '#e0f2fe', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} /> 🟢 Trợ lý Hướng Dẫn Trực Tiếp
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
            <Bot size={16} className="spin-icon" /> AI Coach đang soạn phản hồi hướng dẫn...
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
          placeholder="Hỏi AI Coach hướng dẫn bài làm thực tế..."
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
          <span>Gửi</span>
        </button>
      </form>
    </div>
  );
};
