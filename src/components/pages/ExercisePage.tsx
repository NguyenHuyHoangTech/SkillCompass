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
        <h3>No exercise selected</h3>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>Please select a skill item from the Roadmap to do the exercise.</p>
        <button className="btn-primary" onClick={onBackToRoadmap}>
          <ArrowLeft size={16} /> Back to Roadmap
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
      questionText: `Practical application for "${subTopic.title}": Analyze the most optimal solution to solve the following system problem.`,
      options: [
        'A. Use consistent design standards, reducing cognitive load for users.',
        'B. Completely separate layers, ignoring end-user experience.',
        'C. Skip visual hierarchy to save development time.',
        'D. Overuse complex animations causing slow page load speed.',
      ],
      correctIndex: 0,
      codePrompt: 'Write a line explaining your mindset or a code snippet illustrating your solution:',
      initialCodeSnippet: `// Solution for ${subTopic.title}\nfunction handleOptimization() {\n  // 1. Apply UX & Layout standards\n  // 2. Optimize performance & experience\n}`,
    }
  };

  const currentQ = sampleQuestions[subTopic.id] || sampleQuestions.default;

  const handleSubmit = async () => {
    if (selectedOption === null) {
      alert('Please select an answer option before submitting!');
      return;
    }

    setIsSubmitting(true);
    try {
      const isCorrect = selectedOption === currentQ.correctIndex;
      const baseScore = isCorrect ? 90 : 60;
      const finalScore = userCode.trim().length > 20 ? Math.min(100, baseScore + 10) : baseScore;

      const aiFeedbackText = isCorrect
        ? `Excellent! You correctly chose option A and have the right mindset for "${subTopic.title}".`
        : `You chose a less than optimal answer. Make sure to apply standardization principles and optimize experience for "${subTopic.title}".`;

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
          'Continue practicing test exercises to improve your AI Score',
          'Apply this knowledge to practical projects in your roadmap',
        ],
      });

      onSuccessEvaluation();
    } catch (err) {
      console.error(err);
      alert('An error occurred while submitting the exercise. Please try again!');
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
          <button className="exercise-back-btn" onClick={onBackToRoadmap} title="Back to Roadmap">
            <ArrowLeft size={18} />
            <span>To Roadmap</span>
          </button>
          <div className="exercise-breadcrumb">
            <span className="bc-ms">{milestoneTitle}</span>
            <span className="bc-sep">/</span>
            <span className="bc-skill">{skill.name}</span>
          </div>
        </div>
        <div className="exercise-header-right">
          <span className="exercise-badge">📝 Exercise Page</span>
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
              <Sparkles size={16} /> AI Proposed Scenario Question:
            </div>
            <p className="q-text">{currentQ.questionText}</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="exercise-options-group">
            <label className="options-group-title">Select the best answer:</label>
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
              <Code2 size={16} /> {currentQ.codePrompt || 'Explain your reasoning or provide sample code (optional):'}
            </label>
            <textarea
              className="exercise-textarea"
              rows={4}
              placeholder="Enter your notes or code here..."
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
            />
          </div>

          {/* Submit Actions */}
          <div className="exercise-actions-bar">
            {evaluationResult ? (
              <button className="btn-secondary-custom" onClick={handleReset}>
                <RefreshCw size={16} /> Retry Exercise
              </button>
            ) : (
              <button
                className="btn-submit-exercise"
                onClick={handleSubmit}
                disabled={isSubmitting || selectedOption === null}
              >
                {isSubmitting ? (
                  <>
                    <span className="spin-icon">💫</span> AI Grading...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Submit & AI Grade
                  </>
                )}
              </button>
            )}
            <button className="btn-outline-back" onClick={onBackToRoadmap}>
              Save & Back to Roadmap
            </button>
          </div>
        </div>

        {/* Right Column: AI Score & Live Feedback Panel */}
        <div className="exercise-sidebar-card glass-panel">
          <div className="sidebar-card-header">
            <Award size={20} className="award-icon" />
            <h3>Results & AI Score</h3>
          </div>

          {evaluationResult ? (
            <div className="eval-result-box fade-in">
              <div className="score-display-wrap">
                <span className="score-num-big">{evaluationResult.score}%</span>
                <span className="score-status-label">
                  {evaluationResult.score >= 80 ? '🎯 Excellent' : '⚡ Completed'}
                </span>
              </div>

              <div className="feedback-section">
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', marginBottom: '6px' }}>
                  🤖 Feedback from AI Coach:
                </h4>
                <p className="feedback-text">{evaluationResult.feedback}</p>
              </div>

              {evaluationResult.suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    💡 Development Suggestions:
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
                <CheckCircle2 size={16} /> Done & Return to Roadmap
              </button>
            </div>
          ) : (
            <div className="eval-placeholder-box">
              <div className="placeholder-icon">🤖</div>
              <h4>Ready to Grade</h4>
              <p>Select an answer and click **Submit & AI Grade** to receive detailed capability analysis.</p>
              <div className="placeholder-tips">
                <span>✓ Instant AI grading</span>
                <span>✓ Automatically saved to your Roadmap</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
