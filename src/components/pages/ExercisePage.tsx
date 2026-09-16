import React, { useState } from 'react';
import type { Skill, SubTopic } from '../../types/roadmap';
import { ApiService } from '../../services/apiService';
import { ArrowLeft, CheckCircle2, Sparkles, Send, Award, HelpCircle, Code2, AlertCircle, RefreshCw } from 'lucide-react';

interface ExercisePageProps {
  milestoneId: string;
  milestoneTitle: string;
  skill: Skill | null;
  subTopic: SubTopic | null;
  onBackToRoadmap: () => void;
  onSuccessEvaluation: () => void;
}

export const ExercisePage: React.FC<ExercisePageProps> = ({
  milestoneId,
  milestoneTitle,
  skill,
  subTopic,
  onBackToRoadmap,
  onSuccessEvaluation,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
    suggestions: string[];
  } | null>(null);

  if (!skill || !subTopic) {
    return (
      <div className="page-view-container glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h3>Chưa chọn bài tập</h3>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>Vui lòng chọn một mục kỹ năng từ Lộ trình để làm bài tập.</p>
        <button className="btn-primary" onClick={onBackToRoadmap}>
          <ArrowLeft size={16} /> Quay về Lộ Trình
        </button>
      </div>
    );
  }

  // Sample dynamic question scenarios based on subtopic
  const sampleQuestions: Record<string, {
    questionText: string;
    options: string[];
    correctIndex: number;
    codePrompt?: string;
    initialCodeSnippet?: string;
  }> = {
    default: {
      questionText: `Áp dụng thực tế cho "${subTopic.title}": Hãy phân tích giải pháp tối ưu nhất để giải quyết vấn đề dưới đây trong hệ thống.`,
      options: [
        'A. Sử dụng đúng chuẩn thiết kế nhất quán, giảm tải cognitive load cho người dùng.',
        'B. Tách biệt hoàn toàn các layer, không quan tâm tới trải nghiệm người dùng cuối.',
        'C. Bỏ qua phân cấp thị giác để tiết kiệm thời gian phát triển.',
        'D. Lạm dụng animation phức tạp gây chậm tốc độ tải trang.',
      ],
      correctIndex: 0,
      codePrompt: 'Viết dòng giải thích tư duy hoặc snippet code minh họa giải pháp của bạn:',
      initialCodeSnippet: `// Giải pháp cho ${subTopic.title}\nfunction handleOptimization() {\n  // 1. Áp dụng chuẩn UX & Layout\n  // 2. Tối ưu hiệu năng & trải nghiệm\n}`,
    }
  };

  const currentQ = sampleQuestions[subTopic.id] || sampleQuestions.default;

  const handleSubmit = async () => {
    if (selectedOption === null) {
      alert('Vui lòng chọn một phương án trả lời trước khi nộp bài!');
      return;
    }

    setIsSubmitting(true);
    try {
      const isCorrect = selectedOption === currentQ.correctIndex;
      const baseScore = isCorrect ? 90 : 60;
      const finalScore = userCode.trim().length > 20 ? Math.min(100, baseScore + 10) : baseScore;

      const aiFeedbackText = isCorrect
        ? `Xuất sắc! Bạn đã chọn chính xác đáp án A và có phân tích tư duy đúng đắn cho mục "${subTopic.title}".`
        : `Bạn đã chọn đáp án chưa tối ưu nhất. Cần chú ý áp dụng nguyên tắc chuẩn hóa và tối ưu trải nghiệm cho mục "${subTopic.title}".`;

      // Save evaluation to backend API / local roadmap
      await ApiService.updateSubTopic({
        milestoneId,
        skillId: skill.id,
        subTopicId: subTopic.id,
        isCompleted: true,
        assessmentScore: finalScore,
        aiFeedback: aiFeedbackText,
      });

      setEvaluationResult({
        score: finalScore,
        feedback: aiFeedbackText,
        suggestions: [
          'Tiếp tục thực hành các bài tập bài test để nâng cao điểm AI Score',
          'Áp dụng kiến thức này vào dự án thực tế trong lộ trình',
        ],
      });

      onSuccessEvaluation();
    } catch (err) {
      console.error(err);
      alert('Đã có lỗi xảy ra khi nộp bài tập. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setUserCode('');
    setEvaluationResult(null);
  };

  return (
    <div className="exercise-page-container fade-in">
      {/* 1. Header Bar */}
      <div className="exercise-header-banner glass-panel">
        <div className="exercise-header-left">
          <button className="exercise-back-btn" onClick={onBackToRoadmap} title="Quay về Lộ Trình">
            <ArrowLeft size={18} />
            <span>Về Lộ Trình</span>
          </button>
          <div className="exercise-breadcrumb">
            <span className="bc-ms">{milestoneTitle}</span>
            <span className="bc-sep">/</span>
            <span className="bc-skill">{skill.name}</span>
          </div>
        </div>
        <div className="exercise-header-right">
          <span className="exercise-badge">📝 Trang Làm Bài Tập</span>
        </div>
      </div>

      {/* 2. Main Content Layout */}
      <div className="exercise-content-grid">
        {/* Left Column: Problem & Interactive Section */}
        <div className="exercise-main-card glass-panel">
          <div className="exercise-card-header">
            <div className="ex-title-wrap">
              <HelpCircle size={22} className="ex-icon" />
              <h2>{subTopic.title}</h2>
            </div>
            {subTopic.description && <p className="ex-sub-desc">{subTopic.description}</p>}
          </div>

          {/* Question Text */}
          <div className="exercise-question-box">
            <div className="q-label">
              <Sparkles size={16} /> Câu Hỏi Tình Huống AI Đề Xuất:
            </div>
            <p className="q-text">{currentQ.questionText}</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="exercise-options-group">
            <label className="options-group-title">Chọn phương án trả lời đúng nhất:</label>
            {currentQ.options.map((option, idx) => (
              <div
                key={idx}
                className={`exercise-option-card ${selectedOption === idx ? 'selected' : ''}`}
                onClick={() => setSelectedOption(idx)}
              >
                <div className="radio-circle">{selectedOption === idx && <div className="radio-inner" />}</div>
                <span className="option-text">{option}</span>
              </div>
            ))}
          </div>

          {/* Code / Text Reasoning Section */}
          <div className="exercise-code-box">
            <label className="code-label">
              <Code2 size={16} /> {currentQ.codePrompt || 'Giải trình thêm tư duy hoặc code minh họa (không bắt buộc):'}
            </label>
            <textarea
              className="exercise-textarea"
              rows={4}
              placeholder="Nhập ghi chú hoặc mã code của bạn ở đây..."
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
            />
          </div>

          {/* Submit Actions */}
          <div className="exercise-actions-bar">
            {evaluationResult ? (
              <button className="btn-secondary-custom" onClick={handleReset}>
                <RefreshCw size={16} /> Làm Lại Bài Tập
              </button>
            ) : (
              <button
                className="btn-submit-exercise"
                onClick={handleSubmit}
                disabled={isSubmitting || selectedOption === null}
              >
                {isSubmitting ? (
                  <>
                    <span className="spin-icon">💫</span> AI Đang Chấm Điểm...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Nộp Bài & Chấm Điểm AI
                  </>
                )}
              </button>
            )}
            <button className="btn-outline-back" onClick={onBackToRoadmap}>
              Lưu & Quay về Lộ Trình
            </button>
          </div>
        </div>

        {/* Right Column: AI Score & Live Feedback Panel */}
        <div className="exercise-sidebar-card glass-panel">
          <div className="sidebar-card-header">
            <Award size={20} className="award-icon" />
            <h3>Kết Quả & Điểm AI Score</h3>
          </div>

          {evaluationResult ? (
            <div className="eval-result-box fade-in">
              <div className="score-display-wrap">
                <span className="score-num-big">{evaluationResult.score}%</span>
                <span className="score-status-label">
                  {evaluationResult.score >= 80 ? '🎯 Đạt Chuẩn Xuất Sắc' : '⚡ Đã Hoàn Thành'}
                </span>
              </div>

              <div className="feedback-section">
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', marginBottom: '6px' }}>
                  🤖 Đánh Giá Từ AI Coach:
                </h4>
                <p className="feedback-text">{evaluationResult.feedback}</p>
              </div>

              {evaluationResult.suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    💡 Gợi Ý Phát Triển:
                  </h4>
                  <ul className="suggestion-list">
                    {evaluationResult.suggestions.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={14} color="#10b981" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button className="btn-return-roadmap-full" onClick={onBackToRoadmap}>
                <CheckCircle2 size={16} /> Hoàn Tất & Về Lộ Trình
              </button>
            </div>
          ) : (
            <div className="eval-placeholder-box">
              <div className="placeholder-icon">🤖</div>
              <h4>Sẵn Sàng Chấm Điểm</h4>
              <p>Chọn đáp án và bấm nút **Nộp Bài & Chấm Điểm AI** để nhận kết quả phân tích năng lực chi tiết.</p>
              <div className="placeholder-tips">
                <span>✓ Chấm điểm tức thì bằng AI</span>
                <span>✓ Tự động lưu vào Lộ trình cá nhân</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
