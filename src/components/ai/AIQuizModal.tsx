import React, { useState, useEffect } from 'react';
import type { Skill, SubTopic, QuizQuestionResponse, QuizEvaluationResponse } from '../../types/roadmap';
import { ApiService } from '../../services/apiService';
import { Bot, X, Sparkles, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AIQuizModalProps {
  isOpen: boolean;
  milestoneId: string;
  milestoneTitle: string;
  skill: Skill | null;
  subTopic: SubTopic | null;
  onClose: () => void;
  onSuccessEvaluation: () => void;
}

export const AIQuizModal: React.FC<AIQuizModalProps> = ({
  isOpen,
  milestoneId,
  milestoneTitle,
  skill,
  subTopic,
  onClose,
  onSuccessEvaluation,
}) => {
  const [questionData, setQuestionData] = useState<QuizQuestionResponse | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<QuizEvaluationResponse | null>(null);

  useEffect(() => {
    if (isOpen && skill && subTopic) {
      fetchQuestion();
      setUserAnswer('');
      setEvaluationResult(null);
    }
  }, [isOpen, skill, subTopic]);

  const fetchQuestion = async () => {
    if (!skill || !subTopic) return;
    setLoadingQuestion(true);
    try {
      const data = await ApiService.getQuizQuestion(milestoneTitle, skill.name, subTopic.title);
      setQuestionData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !skill || !subTopic || !questionData) return;

    setEvaluating(true);
    try {
      const result = await ApiService.submitQuizAnswer({
        milestoneId,
        skillId: skill.id,
        subTopicId: subTopic.id,
        subTopicTitle: subTopic.title,
        question: questionData.question,
        userAnswer,
      });

      setEvaluationResult(result);
      onSuccessEvaluation();
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  if (!isOpen || !skill || !subTopic) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container glass-panel">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="ai-avatar">
              <Bot size={22} className="ai-icon-pulse" />
            </div>
            <div>
              <h3 className="modal-title">🤖 AI Coach Guidance & Check: {subTopic.title}</h3>
              <p className="modal-subtitle">AI Coach guides the exercise for skill: {skill.name} • {milestoneTitle}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loadingQuestion ? (
            <div className="modal-loading-state">
              <Loader2 size={32} className="spin-icon" />
              <p>AI Coach is initializing the exercise for you...</p>
            </div>
          ) : evaluationResult ? (
            <div className="evaluation-result-view">
              <div className={`score-banner ${evaluationResult.isPassed ? 'passed' : 'needs-work'}`}>
                <div className="score-circle">
                  <span className="score-num">{evaluationResult.score}%</span>
                  <span className="score-lbl">AI Score</span>
                </div>
                <div className="score-meta">
                  <h4>{evaluationResult.isPassed ? '🎉 Skill Requirement Met!' : '⚠️ Needs More Review'}</h4>
                  <p>{evaluationResult.feedback}</p>
                </div>
              </div>

              <div className="result-details-grid">
                <div className="detail-box strengths">
                  <div className="detail-title"><CheckCircle2 size={16} /> Evaluated Strengths</div>
                  <p>{evaluationResult.strengths}</p>
                </div>
                <div className="detail-box improvements">
                  <div className="detail-title"><AlertCircle size={16} /> AI Improvement Suggestions</div>
                  <p>{evaluationResult.improvements}</p>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button className="btn-primary" onClick={onClose}>
                  Complete Exercise
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setEvaluationResult(null);
                    setUserAnswer('');
                  }}
                >
                  Try Answering Again
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitAnswer} className="quiz-form">
              <div className="question-card">
                <div className="question-badge">
                  <Sparkles size={16} /> AI Coach Proposed Scenario & Task
                </div>
                <p className="question-text">{questionData?.question}</p>
                {questionData?.hint && (
                  <div className="hint-box">
                    💡 <strong>Guidance from AI Coach:</strong> {questionData.hint}
                  </div>
                )}
              </div>

              <div className="answer-input-wrap">
                <label className="input-label">Your Answer / Solution:</label>
                <textarea
                  className="answer-textarea"
                  rows={4}
                  placeholder="Enter your reasoning or code snippet here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={evaluating}
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!userAnswer.trim() || evaluating}
                >
                  {evaluating ? (
                    <>
                      <Loader2 size={16} className="spin-icon" /> AI Coach Grading...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> 🤖 Submit for AI Coach to Grade
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
