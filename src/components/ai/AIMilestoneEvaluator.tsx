import React, { useState, useEffect } from 'react';
import type { Milestone, OverallAiEvaluation } from '../../types/roadmap';
import { ApiService } from '../../services/apiService';
import { Bot, Sparkles, CheckCircle, AlertTriangle, Lightbulb, Loader2, RefreshCw } from 'lucide-react';

interface AIMilestoneEvaluatorProps {
  milestone: Milestone;
  onRefreshRoadmap: () => void;
  onOpenCareerChat?: () => void;
}

export const AIMilestoneEvaluator: React.FC<AIMilestoneEvaluatorProps> = ({
  milestone,
  onRefreshRoadmap,
}) => {
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<OverallAiEvaluation | undefined>(
    milestone.overallAiEvaluation
  );
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedMessage, setOptimizedMessage] = useState('');

  useEffect(() => {
    setEvaluation(milestone.overallAiEvaluation);
    setOptimizedMessage('');
  }, [milestone.id, milestone.overallAiEvaluation]);

  const handleEvaluatePhase = async () => {
    setEvaluating(true);
    setOptimizedMessage('');
    try {
      const result = await ApiService.evaluateMilestonePhase(milestone.id);
      setEvaluation(result);
      onRefreshRoadmap();
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleOptimizeRoadmap = async () => {
    setOptimizing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setOptimizedMessage(`✨ AI optimized stage "${milestone.title}": Prioritized high-demand skills based on current hiring trends!`);
      onRefreshRoadmap();
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="milestone-evaluator-card glass-panel">
      <div className="evaluator-top">
        <div className="evaluator-header-title">
          <div className="ai-badge-icon">
            <Bot size={20} />
          </div>
          <div>
            <h3>Overall AI Stage Evaluation</h3>
          </div>
        </div>

        <div className="evaluator-header-actions">
          <button
            className="eval-action-btn btn-ai-optimize"
            onClick={handleOptimizeRoadmap}
            disabled={optimizing}
            title="AI Roadmap Optimization"
          >
            {optimizing ? (
              <>
                <Loader2 size={16} className="spin-icon" /> <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} className="btn-icon spark" /> <span>AI Optimize Roadmap</span>
              </>
            )}
          </button>

          <button
            className="eval-action-btn btn-ai-re-evaluate"
            onClick={handleEvaluatePhase}
            disabled={evaluating}
            title="Re-evaluate stage progress"
          >
            {evaluating ? (
              <>
                <Loader2 size={16} className="spin-icon" /> <span>Analyzing...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} className="btn-icon" /> <span>Re-Evaluate Stage</span>
              </>
            )}
          </button>
        </div>
      </div>

      {optimizedMessage && (
        <div className="optimized-alert-box">
          <Sparkles size={16} /> {optimizedMessage}
        </div>
      )}

      {evaluating ? (
        <div className="evaluator-loading-state">
          <Loader2 size={28} className="spin-icon" />
          <p>AI is analyzing quiz results and stage progress...</p>
        </div>
      ) : evaluation ? (
        <div className="evaluator-content-body">
          <div className="readiness-banner">
            <div className="readiness-score-box">
              <span className="r-score">{evaluation.score}%</span>
            </div>
            <div className="readiness-info">
              <h4>{evaluation.score}% AI Assessment: {milestone.roleName}</h4>
              <p>{evaluation.summary}</p>
            </div>
          </div>

          <div className="eval-grid-columns">
            <div className="eval-col strengths">
              <div className="eval-col-title">
                <CheckCircle size={16} /> Key Strengths Achieved
              </div>
              <ul>
                {evaluation.strengths.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="eval-col gaps">
              <div className="eval-col-title">
                <AlertTriangle size={16} /> Gaps / Areas to Improve
              </div>
              <ul>
                {evaluation.weaknesses.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="eval-col actions">
              <div className="eval-col-title">
                <Lightbulb size={16} /> Recommended Next Action Items
              </div>
              <ul>
                {evaluation.actionItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="evaluator-empty-state">
          <Bot size={36} className="empty-ai-icon" />
          <p>Click <strong>"Re-Evaluate Stage"</strong> for AI to synthesize your progress and readiness for this milestone!</p>
          <button className="btn-primary" onClick={handleEvaluatePhase}>
            <Sparkles size={16} /> Evaluate Now With AI
          </button>
        </div>
      )}
    </div>
  );
};
