import React, { useState } from 'react';
import type { Milestone, Skill, SubTopic, QuizEvaluationResponse } from '../../types/roadmap';
import { ApiService } from '../../services/apiService';
import { ExerciseAIChatbox } from '../ai/ExerciseAIChatbox';
import {
  BookOpenCheck,
  Bot,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ArrowLeft,
  Code,
  CheckSquare,
  Award,
  Loader2,
} from 'lucide-react';

interface QuizLibraryPageProps {
  milestones: Milestone[];
  onOpenQuiz?: (skill: Skill, subTopic: SubTopic) => void;
}

export const QuizLibraryPage: React.FC<QuizLibraryPageProps> = ({ milestones }) => {
  const [activeExercise, setActiveExercise] = useState<{
    milestone: Milestone;
    skill: Skill;
    subTopic: SubTopic;
  } | null>(null);

  const [userSolution, setUserSolution] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<QuizEvaluationResponse | null>(null);

  const handleSelectExercise = (milestone: Milestone, skill: Skill, subTopic: SubTopic) => {
    setActiveExercise({ milestone, skill, subTopic });
    setUserSolution('');
    setEvaluationResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExercise || !userSolution.trim()) return;

    setEvaluating(true);
    try {
      const result = await ApiService.submitQuizAnswer({
        milestoneId: activeExercise.milestone.id,
        skillId: activeExercise.skill.id,
        subTopicId: activeExercise.subTopic.id,
        subTopicTitle: activeExercise.subTopic.title,
        question: `Please provide a standardized code/solution for the exercise "${activeExercise.subTopic.title}" under the skill ${activeExercise.skill.name}?`,
        userAnswer: userSolution,
      });

      setEvaluationResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="page-view-container">
      {/* 1. Page Header Banner */}
      <div className="page-header-banner glass-panel">
        <div className="page-title-group">
          <BookOpenCheck size={30} className="page-title-icon" style={{ color: 'var(--primary)' }} />
          <div>
            <h2>🤖 Practical Exercise Center & AI Coach Guidance</h2>
            <p>
              A space to practice real-world project scenarios. Includes a dedicated AI chatbox to guide you step-by-step, debug code, and grade your work.
            </p>
          </div>
        </div>

        <div className="ai-guidance-feature-pills" style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
          <div style={{ padding: '6px 12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '0.78rem', color: '#0369a1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={14} /> 1. Real-world Project Scenario Task
          </div>
          <div style={{ padding: '6px 12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #a7f3d0', fontSize: '0.78rem', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bot size={14} /> 2. Dedicated AI Chatbox Direct Guidance
          </div>
          <div style={{ padding: '6px 12px', background: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d5ff', fontSize: '0.78rem', color: '#7e22ce', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> 3. Scoring & Mindset Evaluation
          </div>
        </div>
      </div>

      {/* 2. MODE SWITCH */}
      {activeExercise ? (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Control Bar */}
          <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '14px' }}>
            <button
              onClick={() => setActiveExercise(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} /> Back to Exercise List
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="page-indicator-small-badge">{activeExercise.milestone.badge}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeExercise.skill.name} • {activeExercise.subTopic.title}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', alignItems: 'start' }}>
            {/* LEFT: Scenario & Form */}
            <div className="category-card glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Problem Title & Scenario Card */}
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Code size={16} /> Real-world Project Scenario Task
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0' }}>
                  {activeExercise.subTopic.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  {activeExercise.subTopic.description || `Build a practical solution for the ${activeExercise.subTopic.title} item following technology industry standards.`}
                </p>

                {/* Practical Requirements checklist */}
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckSquare size={14} color="#059669" /> Required Criteria to Achieve:
                  </span>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                    <li>Apply correct syntax and structural hierarchy principles.</li>
                    <li>Ensure mobile optimization (Responsive).</li>
                    <li>Comply with SEO & Accessibility standards (WCAG A11y).</li>
                  </ul>
                </div>
              </div>

              {evaluationResult ? (
                <div className="evaluation-result-view" style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div className={`score-banner ${evaluationResult.isPassed ? 'passed' : 'needs-work'}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: `1px solid var(--border-color)` }}>
                    <div style={{ textAlign: 'center', minWidth: '70px' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: evaluationResult.isPassed ? '#059669' : '#d97706' }}>{evaluationResult.score}%</span>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>AI Score</div>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: evaluationResult.isPassed ? '#047857' : '#b45309' }}>
                        {evaluationResult.isPassed ? '🎉 Meets Practical Standards!' : '⚠️ Needs Further Optimization'}
                      </h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {evaluationResult.feedback}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                    <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '3px solid #059669' }}>
                      <strong style={{ color: '#047857' }}>💪 Strengths:</strong> {evaluationResult.strengths}
                    </div>
                    <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '3px solid #0284c7' }}>
                      <strong style={{ color: '#0369a1' }}>💡 Suggestions for upgrade:</strong> {evaluationResult.improvements}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEvaluationResult(null);
                      setUserSolution('');
                    }}
                    style={{
                      marginTop: '14px',
                      padding: '10px',
                      width: '100%',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                    }}
                  >
                    🔄 Try Entering a Different Solution
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitSolution} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💻 Enter Your Code / Practical Solution:
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Write a snippet of HTML/CSS/JS code or explain your architectural mindset here... (Or ask AI Coach in the chatbox on the right for hints)"
                    value={userSolution}
                    onChange={(e) => setUserSolution(e.target.value)}
                    disabled={evaluating}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      fontSize: '0.88rem',
                      fontFamily: 'monospace',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      lineHeight: 1.5,
                      resize: 'vertical',
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!userSolution.trim() || evaluating}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: userSolution.trim() ? 'pointer' : 'not-allowed',
                      opacity: userSolution.trim() ? 1 : 0.65,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                    }}
                  >
                    {evaluating ? (
                      <>
                        <Loader2 size={18} className="spin-icon" /> AI Coach is Grading your Work...
                      </>
                    ) : (
                      <>
                        <Award size={18} /> 🏆 Submit for AI Coach to Grade
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT: AI Coach Chatbox */}
            <div style={{ position: 'sticky', top: '80px', height: 'calc(100vh - 110px)', minHeight: '520px', maxHeight: '720px' }}>
              <ExerciseAIChatbox
                subTopicTitle={activeExercise.subTopic.title}
                skillName={activeExercise.skill.name}
                milestoneTitle={activeExercise.milestone.title}
                scenarioText={activeExercise.subTopic.description}
                userAnswerCode={userSolution}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="quiz-library-grid" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {milestones.map((ms) => (
            <div key={ms.id} className="category-card glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="var(--primary)" /> {ms.title}
                </h3>
                <span className="page-indicator-small-badge">{ms.badge}</span>
              </div>

              <div className="skills-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {ms.categories.flatMap((c) => c.skills).map((sk) => (
                  <div key={sk.id} className="skill-item-card">
                    <div className="skill-card-top">
                      <span className="skill-name" style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.02rem' }}>{sk.name}</span>
                      <span className="skill-level-num">{sk.levelPercentage}%</span>
                    </div>

                    <div className="subtopic-list" style={{ marginTop: '12px' }}>
                      {sk.subTopics.map((sub) => (
                        <div key={sub.id} className="subtopic-item">
                          <div className="subtopic-left">
                            <HelpCircle size={18} color="var(--primary)" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className="subtopic-title">{sub.title}</span>
                              {sub.description && <span className="subtopic-desc">{sub.description}</span>}
                            </div>
                          </div>

                          <div className="subtopic-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {sub.assessmentScore !== undefined && sub.assessmentScore > 0 && (
                              <span className={`score-badge ${sub.assessmentScore >= 70 ? 'pass' : 'review'}`}>
                                {sub.assessmentScore}% AI Score
                              </span>
                            )}
                            <button
                              className="ai-quiz-trigger-btn"
                              onClick={() => handleSelectExercise(ms, sk, sub)}
                              title="Start practical exercise & open AI Coach chatbox"
                            >
                              <Bot size={16} />
                              <span>🚀 Start Practice & AI Chat</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
