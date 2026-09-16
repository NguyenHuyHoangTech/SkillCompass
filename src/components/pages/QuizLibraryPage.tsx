import React, { useState } from 'react';
import type { Milestone, Skill, SubTopic, QuizEvaluationResponse } from '../../types/roadmap';
import { ApiService } from '../../services/apiService';
import { ExerciseAIChatbox } from '../ai/ExerciseAIChatbox';
import { useAppContext } from '../../context/AppContext';
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
  Search,
  CheckCircle2,
  Filter,
  ExternalLink,
} from 'lucide-react';

interface QuizLibraryPageProps {
  milestones: Milestone[];
  onOpenQuiz?: (skill: Skill, subTopic: SubTopic) => void;
}

export const QuizLibraryPage: React.FC<QuizLibraryPageProps> = ({ milestones }) => {
  const { t } = useAppContext();
  const [activeExercise, setActiveExercise] = useState<{
    milestone: Milestone;
    skill: Skill;
    subTopic: SubTopic;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMilestoneFilter, setSelectedMilestoneFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const [userSolution, setUserSolution] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<QuizEvaluationResponse | null>(null);

  // Compute live statistics across all milestones
  const allSubTopics = milestones.flatMap(m => 
    m.categories.flatMap(c => 
      c.skills.flatMap(s => s.subTopics)
    )
  );

  const totalCount = allSubTopics.length;
  const completedCount = allSubTopics.filter(st => st.isCompleted).length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const scoredTopics = allSubTopics.filter(st => st.assessmentScore !== undefined && st.assessmentScore > 0);
  const avgScore = scoredTopics.length > 0 
    ? Math.round(scoredTopics.reduce((acc, st) => acc + (st.assessmentScore || 0), 0) / scoredTopics.length) 
    : 0;

  // Filter milestones based on user search and filters
  const filteredMilestones = milestones.map(ms => {
    const matchesMilestoneFilter = selectedMilestoneFilter === 'All' || ms.id === selectedMilestoneFilter || ms.title.toLowerCase().includes(selectedMilestoneFilter.toLowerCase());

    if (!matchesMilestoneFilter) return null;

    const filteredCategories = ms.categories.map(cat => {
      const filteredSkills = cat.skills.map(sk => {
        const matchingSubTopics = sk.subTopics.filter(st => {
          const matchesSearch = st.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                sk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (st.description && st.description.toLowerCase().includes(searchQuery.toLowerCase()));
          
          if (!matchesSearch) return false;

          if (statusFilter === 'completed') return st.isCompleted;
          if (statusFilter === 'pending') return !st.isCompleted;
          return true;
        });

        if (matchingSubTopics.length === 0) return null;
        return { ...sk, subTopics: matchingSubTopics };
      }).filter(Boolean) as Skill[];

      if (filteredSkills.length === 0) return null;
      return { ...cat, skills: filteredSkills };
    }).filter(Boolean);

    if (filteredCategories.length === 0) return null;
    return { ...ms, categories: filteredCategories as any };
  }).filter(Boolean) as Milestone[];

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Dynamic Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-800/50 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
              <Bot size={14} className="text-cyan-400" /> AI-Powered Practice Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Practical Exercise Center
            </h1>
            <p className="text-sm text-blue-200 dark:text-slate-400 leading-relaxed">
              Practice real-world project scenarios. Guided step-by-step by AI Coach with automated code grading & mindset feedback.
            </p>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 dark:bg-slate-900/60 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shrink-0">
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl font-black text-cyan-400">{completedCount}/{totalCount}</div>
              <div className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Completed</div>
            </div>
            <div className="text-center px-2 border-x border-white/10">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{completionPercentage}%</div>
              <div className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Progress</div>
            </div>
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl font-black text-amber-400">{avgScore}%</div>
              <div className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Avg Score</div>
            </div>
          </div>
        </div>

        {/* Dynamic Feature Pills */}
        <div className="flex flex-wrap gap-2.5 mt-6 pt-6 border-t border-white/10 relative z-10">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-blue-100 flex items-center gap-2">
            <Lightbulb size={14} className="text-amber-300" /> 1. Real-world Project Scenario Task
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-blue-100 flex items-center gap-2">
            <Bot size={14} className="text-cyan-300" /> 2. Dedicated AI Chatbox Guidance
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-blue-100 flex items-center gap-2">
            <Sparkles size={14} className="text-purple-300" /> 3. Scoring & Mindset Evaluation
          </div>
        </div>
      </div>

      {/* 2. MODE SWITCH: ACTIVE EXERCISE VS EXERCISE LIBRARY */}
      {activeExercise ? (
        <div className="space-y-6 animate-fade-in">
          {/* Top Control Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => setActiveExercise(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm transition-colors"
            >
              <ArrowLeft size={16} /> Back to Exercise List
            </button>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-slate-700 uppercase tracking-wider">
                {activeExercise.milestone.title}
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {activeExercise.skill.name} • <span className="text-blue-600 dark:text-cyan-400">{activeExercise.subTopic.title}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Scenario & Submission Form (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              {/* Problem Title & Scenario Card */}
              <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-5 border border-slate-200 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Code size={16} /> Practical Project Scenario Task
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                  {activeExercise.subTopic.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeExercise.subTopic.description || `Build a practical solution for ${activeExercise.subTopic.title} following industry standards and best practices.`}
                </p>

                {/* Practical Requirements checklist */}
                <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckSquare size={14} className="text-emerald-500" /> Key Required Criteria:
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside pl-1">
                    <li>Apply optimal architectural patterns and clean code principles.</li>
                    <li>Ensure responsive behavior and cross-device compatibility.</li>
                    <li>Comply with performance, SEO & Accessibility standards (WCAG).</li>
                  </ul>
                </div>

                {/* Recommended Course Link */}
                {activeExercise.skill.courseLinks && activeExercise.skill.courseLinks.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">External Resource:</span>
                    {activeExercise.skill.courseLinks.map((course, idx) => (
                      <a
                        key={idx}
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium hover:bg-indigo-100 transition-colors"
                      >
                        <ExternalLink size={12} /> {course.title} ({course.provider})
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Evaluation Result or Form */}
              {evaluationResult ? (
                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className={`p-4 rounded-xl border flex items-center gap-4 ${evaluationResult.isPassed ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'}`}>
                    <div className="text-center min-w-[70px]">
                      <span className="text-2xl font-black">{evaluationResult.score}%</span>
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">AI Score</div>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base">
                        {evaluationResult.isPassed ? '🎉 Meets Practical Standards!' : '⚠️ Needs Further Optimization'}
                      </h4>
                      <p className="text-xs leading-relaxed mt-1 opacity-90">
                        {evaluationResult.feedback}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                      <strong className="text-emerald-600 dark:text-emerald-400">💪 Strengths:</strong> {evaluationResult.strengths}
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-blue-500 shadow-sm">
                      <strong className="text-blue-600 dark:text-cyan-400">💡 Suggestions for Improvement:</strong> {evaluationResult.improvements}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEvaluationResult(null);
                      setUserSolution('');
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    🔄 Try Entering a Different Solution
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitSolution} className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Code size={14} className="text-blue-500" /> Enter Your Solution / Code Snippet:
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Write your HTML/CSS/JS code snippet or explain your architectural solution here... (Ask AI Coach in the right panel for hints)"
                    value={userSolution}
                    onChange={(e) => setUserSolution(e.target.value)}
                    disabled={evaluating}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 resize-y"
                  />

                  <button
                    type="submit"
                    disabled={!userSolution.trim() || evaluating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 text-white font-extrabold text-sm shadow-md hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> AI Coach is Grading your Work...
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

            {/* RIGHT: AI Coach Chatbox (5 cols) */}
            <div className="lg:col-span-5 sticky top-6 h-[calc(100vh-120px)] min-h-[500px] max-h-[700px]">
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
        /* 3. DYNAMIC EXERCISE LIBRARY GRID */
        <div className="space-y-6">
          {/* Filters & Search Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search exercises by name, skill, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 font-medium"
              />
              <Search className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
            </div>

            {/* Milestone Stage Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar shrink-0">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1 shrink-0">
                <Filter size={13} /> Stage:
              </span>
              <button
                onClick={() => setSelectedMilestoneFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedMilestoneFilter === 'All' ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                All Stages
              </button>
              {milestones.map((ms, idx) => (
                <button
                  key={ms.id}
                  onClick={() => setSelectedMilestoneFilter(ms.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedMilestoneFilter === ms.id ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  Stage {idx + 1}
                </button>
              ))}
            </div>

            {/* Status Filter Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start md:self-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${statusFilter === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${statusFilter === 'completed' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${statusFilter === 'pending' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Milestones Cards Loop */}
          {filteredMilestones.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <HelpCircle className="mx-auto text-slate-300 dark:text-slate-600" size={40} />
              <h3 className="font-bold text-slate-700 dark:text-slate-200 text-lg">No exercises found matching your filter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try searching for a different keyword or resetting your Stage filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedMilestoneFilter('All'); setStatusFilter('all'); }}
                className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredMilestones.map((ms, msIdx) => (
              <div key={ms.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100 dark:border-slate-700">
                      {msIdx + 1}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                        {ms.title}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{ms.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {ms.badge || `Stage ${msIdx + 1}`}
                  </span>
                </div>

                {/* Skills Loop */}
                <div className="space-y-5">
                  {ms.categories.flatMap((c) => c.skills).map((sk) => (
                    <div key={sk.id} className="bg-slate-50/70 dark:bg-slate-950/60 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
                          {sk.name}
                        </span>
                        <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-blue-100 dark:border-slate-700">
                          Completed {sk.levelPercentage}%
                        </span>
                      </div>

                      {/* SubTopics Exercise List */}
                      <div className="space-y-2.5">
                        {sk.subTopics.map((sub) => (
                          <div
                            key={sub.id}
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${sub.isCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                {sub.isCompleted ? <CheckCircle2 size={16} /> : <HelpCircle size={16} />}
                              </div>
                              <div>
                                <span className={`text-sm font-bold block ${sub.isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-800 dark:text-slate-100'}`}>
                                  {sub.title}
                                </span>
                                {sub.description && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                    {sub.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {sub.assessmentScore !== undefined && sub.assessmentScore > 0 && (
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${sub.assessmentScore >= 70 ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'}`}>
                                  {sub.assessmentScore}% AI Score
                                </span>
                              )}

                              <button
                                onClick={() => handleSelectExercise(ms, sk, sub)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-extrabold shadow-sm transition-all"
                              >
                                <Bot size={15} />
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
            ))
          )}
        </div>
      )}
    </div>
  );
};
