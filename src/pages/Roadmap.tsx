import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { UserRoadmap, Skill, SubTopic, Milestone } from '../types/roadmap';
import { ApiService } from '../services/apiService';
import { TopNavbar } from '../components/layout/TopNavbar';
import { SidebarNav } from '../components/layout/SidebarNav';
import { RoadmapHeader } from '../components/roadmap/RoadmapHeader';
import { SpiderChart } from '../components/roadmap/SpiderChart';
import { SkillCategoryList } from '../components/roadmap/SkillCategoryList';
import { AIQuizModal } from '../components/ai/AIQuizModal';
import { AICareerChatbot } from '../components/ai/AICareerChatbot';
import { EditMilestoneModal } from '../components/roadmap/EditMilestoneModal';
import { AIRoadmapGeneratorModal } from '../components/roadmap/AIRoadmapGeneratorModal';
import { AISkillGeneratorModal } from '../components/roadmap/AISkillGeneratorModal';
import { AddSkillModal } from '../components/roadmap/AddSkillModal';
import { DailyChecklistModal } from '../components/roadmap/DailyChecklistModal';
import { AICourseAnalysisModal } from '../components/learning/AICourseAnalysisModal';
import { AILearningHub } from '../components/learning/AILearningHub';
import { CourseDashboard } from '../components/learning/CourseDashboard';
import type { ChatGeneratedSkill, ChatGeneratedMilestone } from '../services/ai';
import type { AICourse } from '../services/ai';
import type { ManualSkillData } from '../components/roadmap/AddSkillModal';
import { AnalyticsPage } from '../components/pages/AnalyticsPage';
import { QuizLibraryPage } from '../components/pages/QuizLibraryPage';
import { AllSkillsPage } from '../components/pages/AllSkillsPage';
import { GlobalAnalyticsModal } from '../components/pages/GlobalAnalyticsModal';
import { CertificateModal } from '../components/learning/CertificateModal';
import { SettingsPage } from '../components/pages/SettingsPage';
import { CoursesPage } from './CoursesPage';
import { Onboarding } from './Onboarding';
import '../App.css';

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('ms-stage-1');

  // Page Routing State (Sidebar Vertical Tabs switch DIFFERENT PAGES)
  const [activePage, setActivePage] = useState<string>(
    window.location.pathname === '/roadmap'
      ? 'page-roadmap'
      : 'page-onboarding'
  );

  // Sub-Tab Navigation inside Roadmap Page (Horizontal Tabs in Header)
  const [activeSubTab, setActiveSubTab] = useState<string>('view-checklist');

  // Sidebar Drawer Open/Close State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // Modal & Chatbot States
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopic | null>(null);
  const [isCareerChatOpen, setIsCareerChatOpen] = useState(false);
  const [isEditMilestoneModalOpen, setIsEditMilestoneModalOpen] = useState(false);
  const [milestoneToEdit, setMilestoneToEdit] = useState<any>(null);
  const [isAiRoadmapGeneratorOpen, setIsAiRoadmapGeneratorOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [isAiSkillGeneratorOpen, setIsAiSkillGeneratorOpen] = useState(false);
  const [isGalaxyModalOpen, setIsGalaxyModalOpen] = useState(false);
  const [isGlobalAnalyticsOpen, setIsGlobalAnalyticsOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isDailyChecklistOpen, setIsDailyChecklistOpen] = useState(false);

  // Learning Hub States
  const [learningSkill, setLearningSkill] = useState<Skill | null>(null);
  const [isAnalyzingCourse, setIsAnalyzingCourse] = useState(false);
  const [activeLearningPage, setActiveLearningPage] = useState<'none' | 'hub' | 'dashboard'>('none');
  const [selectedCourse, setSelectedCourse] = useState<AICourse | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/roadmap') {
      setActivePage('page-roadmap');
    } else if (location.pathname === '/') {
      setActivePage('page-onboarding');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (activePage === 'page-roadmap' && location.pathname !== '/roadmap') {
      navigate('/roadmap');
    } else if (activePage === 'page-onboarding' && location.pathname !== '/') {
      navigate('/');
    }
  }, [activePage, navigate, location.pathname]);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      const data = await ApiService.getRoadmap();
      setRoadmap(data);
      if (data.currentMilestoneId) {
        setActiveMilestoneId(data.currentMilestoneId);
      }
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMilestone = (id: string) => {
    setActiveMilestoneId(id);
  };

  const handleOpenQuiz = (skill: Skill, subTopic: SubTopic) => {
    setSelectedSkill(skill);
    setSelectedSubTopic(subTopic);
    setIsQuizModalOpen(true);
  };

  const handleToggleCheck = async (skill: Skill, subTopic: SubTopic, completed: boolean, specificMilestoneId?: string) => {
    if (!roadmap) return;

    try {
      const updatedData = await ApiService.updateSubTopic({
        milestoneId: specificMilestoneId || activeMilestoneId,
        skillId: skill.id,
        subTopicId: subTopic.id,
        isCompleted: completed,
      });
      setRoadmap(updatedData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMilestone = async (newMilestone: Milestone) => {
    const updatedData = await ApiService.addMilestoneToRoadmap(newMilestone);
    setRoadmap(updatedData);
    setActiveMilestoneId(newMilestone.id);
  };

  const handleStartLearning = (skill: Skill) => {
    setLearningSkill(skill);
    if (skill.levelPercentage > 0 && skill.levelPercentage < 100) {
      if (!selectedCourse) {
         setSelectedCourse({
           id: `course-${skill.id}`,
           title: `Course ${skill.name}`,
           provider: 'SkillCompass',
           rating: 5.0,
           duration: 'Flexible',
           level: 'Continue Learning',
           instructor: 'AI Expert',
           description: 'Course restored from your learning progress.',
           thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
           enrolledCount: 1,
           tags: [skill.name, 'Continue Learning'],
           syllabus: [
             { id: 1, title: 'Lesson 1: Review the Basics', duration: '12:00', isCompleted: true },
             { id: 2, title: 'Lesson 2: Practice the Skill', duration: '25:30', isCompleted: false },
             { id: 3, title: 'Lesson 3: Real-World Project', duration: '45:00', isCompleted: false },
             { id: 4, title: 'Lesson 4: Summary', duration: '10:00', isCompleted: false }
           ]
         });
      }
      setActiveLearningPage('dashboard');
    } else {
      setIsAnalyzingCourse(true);
    }
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzingCourse(false);
    setActiveLearningPage('hub');
  };

  const handleApplyChecklist = async (items: string[]) => {
    if (!roadmap || !learningSkill) return;
    
    try {
        const updatedRoadmap = await ApiService.addChecklistTasks(activeMilestoneId, learningSkill.id, items);
        setRoadmap(updatedRoadmap);
        setIsDailyChecklistOpen(true);
        
        // Automatically close the task panel after 2.5 seconds so the user can start learning
        setTimeout(() => {
            setIsDailyChecklistOpen(false);
        }, 2500);
    } catch (e) {
        console.error('Failed to add checklist tasks:', e);
    }
  };

  const handleCompleteCourse = async () => {
    if (!roadmap || !learningSkill) return;

    try {
      const updatedRoadmap = await ApiService.completeSkill(activeMilestoneId, learningSkill.id);
      setRoadmap(updatedRoadmap);
      setIsCertificateModalOpen(true);
    } catch (err) {
      console.error('Failed to complete course:', err);
    }
  };

  const handleSuccessEvaluation = async () => {
    await loadRoadmap();
  };

  const handleSelectSubTab = (tabId: string) => {
    if (tabId === 'view-optimizer') {
      setIsAiRoadmapGeneratorOpen(true);
      return;
    }
    
    if (tabId === 'view-checklist') {
      setIsDailyChecklistOpen(true);
      return;
    }

    setActiveSubTab(tabId);

    const targetMap: Record<string, string> = {
      'view-radar': 'sec-radar',
    };

    const targetId = targetMap[tabId];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleOpenAddMilestone = () => {
    setMilestoneToEdit(null);
    setIsEditMilestoneModalOpen(true);
  };

  const handleOpenEditMilestone = (ms: Milestone) => {
    setMilestoneToEdit({ id: ms.id, title: ms.title, description: ms.description, categoriesCount: ms.categories.length });
    setIsEditMilestoneModalOpen(true);
  };

  const handleDeleteMilestone = (id: string) => {
    if (!roadmap) return;
    const newMilestones = roadmap.milestones.filter((m: Milestone) => m.id !== id);
    setRoadmap({ ...roadmap, milestones: newMilestones });
    if (activeMilestoneId === id) {
      setActiveMilestoneId(newMilestones.length > 0 ? newMilestones[0].id : '');
    }
  };

  const handleForceCompleteMilestone = async (id: string) => {
    if (!roadmap) return;
    try {
      const updatedRoadmap = await ApiService.updateMilestone(id, { isForceCompleted: true });
      setRoadmap(updatedRoadmap);
    } catch (err) {
      console.error('Failed to force complete milestone:', err);
      // Fallback local update if API completely fails (though ApiService handles fallback already)
      const newMilestones = roadmap.milestones.map((m: Milestone) => {
        if (m.id === id) {
          return { ...m, isForceCompleted: true };
        }
        return m;
      });
      setRoadmap({ ...roadmap, milestones: newMilestones });
    }
  };

  const handleSaveMilestone = (data: any) => {
    if (!roadmap) return;
    if (data.id) {
      const newMilestones = roadmap.milestones.map((m: Milestone) => {
        if (m.id === data.id) {
          return { ...m, title: data.title, description: data.description, startDate: data.startDate, endDate: data.endDate };
        }
        return m;
      });
      setRoadmap({ ...roadmap, milestones: newMilestones });
    } else {
      const newMs: Milestone = {
        id: `m-custom-${Date.now()}`,
        title: data.title,
        roleName: data.title,
        badge: '🆕 Custom',
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        overallProgress: 0,
        categories: Array.from({ length: 2 }).map((_, i) => ({
          id: `c-${Date.now()}-${i}`,
          name: `Category ${i + 1}`,
          skills: []
        }))
      };
      setRoadmap({ ...roadmap, milestones: [...roadmap.milestones, newMs] });
      setActiveMilestoneId(newMs.id);
    }
  };

  const handleConfirmGeneratedRoadmap = (newMilestonesData: ChatGeneratedMilestone[], replaceFuture: boolean) => {
    if (!roadmap) return;
    const activeMsIndex = roadmap.milestones.findIndex((m: Milestone) => m.id === activeMilestoneId);
    
    // Keep milestones up to active (or all if not replaceFuture)
    const keepIdx = replaceFuture && activeMsIndex !== -1 ? activeMsIndex + 1 : roadmap.milestones.length;
    const keptMilestones = roadmap.milestones.slice(0, keepIdx);

    const mapped = newMilestonesData.map((d, i) => ({
      id: `m-ai-${Date.now()}-${i}`,
      title: d.title,
      roleName: d.title,
      badge: '🤖 AI Generated',
      description: d.description,
      overallProgress: 0,
      categories: Array.from({ length: d.categoriesCount }).map((_, ci) => ({
        id: `c-ai-${Date.now()}-${i}-${ci}`,
        name: `AI Sub-topic ${ci + 1}`,
        skills: []
      }))
    }));

    const newMilestones = [...keptMilestones, ...mapped];
    const updatedRoadmap = { ...roadmap, milestones: newMilestones };
    setRoadmap(updatedRoadmap);
    localStorage.setItem('skill_compass_roadmap', JSON.stringify(updatedRoadmap));
    setIsAiRoadmapGeneratorOpen(false);

    if (replaceFuture && mapped.length > 0) {
      setActiveMilestoneId(mapped[0].id);
    }
  };


  const handleConfirmGeneratedSkills = (skills: ChatGeneratedSkill[], replaceUnlearned: boolean) => {
    if (!roadmap) return;
    const activeMs = roadmap.milestones.find((m) => m.id === activeMilestoneId);
    if (!activeMs) return;

    let newMilestones = [...roadmap.milestones];
    const msIndex = newMilestones.findIndex(m => m.id === activeMilestoneId);
    let currentMs = { ...newMilestones[msIndex] };

    // Format new skills
    const newSkillsFormatted = skills.map((sk, index) => ({
      id: `sk-ai-${Date.now()}-${index}`,
      name: sk.title,
      icon: sk.icon || 'fa-star',
      levelPercentage: 0,
      subTopics: sk.subTopics.map((sub, sIdx) => ({
        id: `sub-ai-${Date.now()}-${index}-${sIdx}`,
        title: sub.title,
        isCompleted: false
      }))
    }));

    currentMs.categories = currentMs.categories.map(cat => {
      let newSkills = [...cat.skills];
      if (replaceUnlearned) {
        newSkills = newSkills.filter(skill => skill.levelPercentage > 0);
      }
      return { ...cat, skills: newSkills };
    });

    // Add new skills to the first category (or create an "AI Generated" category if none)
    if (currentMs.categories.length > 0 && newSkillsFormatted.length > 0) {
      currentMs.categories[0].skills.push(...newSkillsFormatted);
    } else if (newSkillsFormatted.length > 0) {
      currentMs.categories.push({
        id: `cat-ai-${Date.now()}`,
        name: 'AI Generated Skills',
        skills: newSkillsFormatted
      });
    }

    newMilestones[msIndex] = currentMs;
    const updatedRoadmap = { ...roadmap, milestones: newMilestones };
    setRoadmap(updatedRoadmap);
    localStorage.setItem('skill_compass_roadmap', JSON.stringify(updatedRoadmap));
    setIsAiSkillGeneratorOpen(false);
  };


  const handleManualAddSkill = async (data: ManualSkillData) => {
    if (!roadmap) return;
    const activeMs = roadmap.milestones.find((m) => m.id === activeMilestoneId);
    if (!activeMs) return;

    let newMilestones = [...roadmap.milestones];
    const msIndex = newMilestones.findIndex(m => m.id === activeMilestoneId);
    let currentMs = { ...newMilestones[msIndex] };

    let categoryExists = false;
    currentMs.categories = currentMs.categories.map(cat => {
      if (cat.name === data.categoryName) {
        categoryExists = true;
        return {
          ...cat,
          skills: [...cat.skills, {
            id: `sk-manual-${Date.now()}`,
            name: data.title,
            icon: 'fa-star', // default icon
            levelPercentage: 0,
            subTopics: data.subtopics
              .filter(st => st.trim() !== '')
              .map((st, i) => ({
                id: `sub-m-${Date.now()}-${i}`, 
                title: st, 
                isCompleted: false 
              }))
          }]
        };
      }
      return cat;
    });

    if (!categoryExists) {
      currentMs.categories.push({
        id: `cat-manual-${Date.now()}`,
        name: data.categoryName,
        skills: [{
          id: `sk-manual-${Date.now()}`,
          name: data.title,
          icon: 'fa-star',
          levelPercentage: 0,
          subTopics: data.subtopics
            .filter(st => st.trim() !== '')
            .map((st, i) => ({
              id: `sub-m-${Date.now()}-${i}`, 
              title: st, 
              isCompleted: false 
            }))
        }]
      });
    }

    newMilestones[msIndex] = currentMs;
    const updatedRoadmap = { ...roadmap, milestones: newMilestones };
    setRoadmap(updatedRoadmap);
    localStorage.setItem('skill_compass_roadmap', JSON.stringify(updatedRoadmap));
  };




  if (loading || !roadmap) {
    return (
      <div className="app-loading-screen">
        <div className="spin-icon" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💫</div>
        <h2>Skill Compass AI - Loading system data...</h2>
      </div>
    );
  }

  const activeMilestone = roadmap?.milestones.find(m => m.id === activeMilestoneId);
  const unlearnedSkills = activeMilestone 
    ? activeMilestone.categories.flatMap(c => c.skills).filter(s => s.levelPercentage === 0)
    : [];

  if (!roadmap || !activeMilestone) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>Loading or no roadmap available...</div>;
  }

  return (
    <div className="app-main-outer-shell h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* 1. Sticky Top Navbar with Main Page Tabs (Roadmap, All Skills, Exercises & Tests) */}
      <TopNavbar
        userName={roadmap.userName}
        activePage={activePage}
        activeSubTab={activeSubTab}
        onSelectSubTab={handleSelectSubTab}
        onSelectPage={setActivePage}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenGalaxy={() => setIsGalaxyModalOpen(true)}
        onOpenGlobalAnalytics={() => setIsGlobalAnalyticsOpen(true)}
      />

      <div className="app-layout-wrapper flex-1 flex overflow-hidden relative">
        {/* 2. Vertical Drawer Sidebar Tab */}
        <SidebarNav
          userName={roadmap.userName}
          activePage={activePage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSelectPage={(page) => setActivePage(page)}
          onOpenCareerChat={() => setIsCareerChatOpen(true)}
        />

        {/* 3. Main Viewport Container */}
        <div className="main-viewport flex-1 h-full overflow-hidden relative">
          {activePage === 'page-onboarding' && (
            <Onboarding onFinish={() => setActivePage('page-roadmap')} />
          )}
          
          {activePage === 'page-roadmap' && (
              <div className="roadmap-page-view flex flex-col sm:flex-row h-full overflow-hidden bg-slate-50">
                <div className="w-full sm:w-[380px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-xl h-full overflow-hidden">
                  <div className="p-6 flex-1 flex flex-col h-full overflow-hidden">

                    {/* Spider Chart */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden" id="sec-radar">
                      <div className="flex justify-between items-end mb-3 shrink-0">
                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Skill Gap Analysis</h2>
                        <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-md">{roadmap.targetRole || 'Frontend Dev'}</span>
                      </div>
                      <SpiderChart
                        categories={activeMilestone.categories}
                        milestoneTitle={activeMilestone.title}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Main Content */}
                <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50">
                  <div className="shrink-0 bg-white border-b border-slate-200 z-10 shadow-sm">
                    <RoadmapHeader
                      milestones={roadmap.milestones}
                      activeMilestoneId={activeMilestoneId}
                      onSelectMilestone={handleSelectMilestone}
                      onEditMilestone={handleOpenEditMilestone}
                      onDeleteMilestone={handleDeleteMilestone}
                      onAddMilestone={handleOpenAddMilestone}
                      onForceCompleteMilestone={handleForceCompleteMilestone}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto hide-scrollbar p-4 sm:p-8" id="sec-checklist">
                    <SkillCategoryList 
                      categories={activeMilestone.categories}
                      onToggleCheck={handleToggleCheck}
                      onAIReplace={() => setIsAiSkillGeneratorOpen(true)}
                      onManualAdd={() => setIsAddSkillModalOpen(true)}
                      onLearnSkill={handleStartLearning}
                    />
                  </div>
                </div>
              </div>
          )}

          {activePage === 'page-analytics' && (
            <AnalyticsPage milestone={activeMilestone} />
          )}

          {activePage === 'page-quiz-lib' && (
            <QuizLibraryPage
              milestones={roadmap.milestones}
              onOpenQuiz={handleOpenQuiz}
            />
          )}

          {activePage === 'page-settings' && (
            <SettingsPage userName={roadmap.userName} />
          )}

          {activePage === 'page-courses' && (
            <CoursesPage />
          )}

          {/* AI Quiz Modal */}
          <AIQuizModal
            isOpen={isQuizModalOpen}
            milestoneId={activeMilestoneId}
            milestoneTitle={activeMilestone.title}
            skill={selectedSkill}
            subTopic={selectedSubTopic}
            onClose={() => setIsQuizModalOpen(false)}
            onSuccessEvaluation={handleSuccessEvaluation}
          />

          {/* Floating AI Career Advisor Chatbot */}
          <AICareerChatbot
            milestoneId={activeMilestoneId}
            milestoneTitle={activeMilestone.title}
            forceOpen={isCareerChatOpen}
            onCloseForceOpen={() => setIsCareerChatOpen(false)}
            onAddMilestone={handleAddMilestone}
            isSidebarOpen={isSidebarOpen}
          />

          {/* New Modals */}
          <EditMilestoneModal
            isOpen={isEditMilestoneModalOpen}
            onClose={() => setIsEditMilestoneModalOpen(false)}
            milestoneToEdit={milestoneToEdit}
            onSave={handleSaveMilestone}
          />

          <AIRoadmapGeneratorModal
            isOpen={isAiRoadmapGeneratorOpen}
            onClose={() => setIsAiRoadmapGeneratorOpen(false)}
            targetRole={roadmap.targetRole || roadmap.milestones[roadmap.milestones.length - 1]?.title || ''}
            currentMilestones={roadmap.milestones}
            onConfirm={handleConfirmGeneratedRoadmap}
          />

          <AddSkillModal
            isOpen={isAddSkillModalOpen}
            onClose={() => setIsAddSkillModalOpen(false)}
            onSave={handleManualAddSkill}
            existingCategories={roadmap?.milestones.find(m => m.id === activeMilestoneId)?.categories.map(c => c.name) || []}
          />

          <AISkillGeneratorModal
            isOpen={isAiSkillGeneratorOpen}
            onClose={() => setIsAiSkillGeneratorOpen(false)}
            milestoneTitle={activeMilestone.title}
            unlearnedSkills={unlearnedSkills}
            onConfirm={handleConfirmGeneratedSkills}
          />
          
          <DailyChecklistModal
            isOpen={isDailyChecklistOpen}
            onClose={() => setIsDailyChecklistOpen(false)}
            milestones={roadmap.milestones}
            onToggleTask={handleToggleCheck}
          />
          
          {/* Floating Action Button for Daily Checklist */}
          {activePage === 'page-roadmap' && (
            <button
                onClick={() => setIsDailyChecklistOpen(true)}
                className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-600/30 flex flex-col items-center justify-center transition-transform hover:scale-110 border-2 border-white/20 group"
                title="Open Daily Checklist"
            >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                <i className="fa-solid fa-list-check text-xl mb-0.5"></i>
                <span className="text-[9px] font-bold tracking-wider">TASKS</span>
            </button>
          )}
          
          {isGalaxyModalOpen && (
            <div className="fixed inset-0 z-[100] bg-slate-900">
              <AllSkillsPage 
                milestones={roadmap.milestones}
                onOpenQuiz={handleOpenQuiz}
                onToggleCheck={handleToggleCheck}
                onClose={() => setIsGalaxyModalOpen(false)}
                onLearnSkill={handleStartLearning}
              />
            </div>
          )}

          {/* Global Analytics Modal Overlay */}
          {roadmap && (
            <GlobalAnalyticsModal 
              isOpen={isGlobalAnalyticsOpen}
              onClose={() => setIsGlobalAnalyticsOpen(false)}
              milestones={roadmap.milestones}
            />
          )}

          <AICourseAnalysisModal 
            isOpen={isAnalyzingCourse}
            skill={learningSkill}
            onAnalysisComplete={handleAnalysisComplete}
          />
          
          <CertificateModal
            isOpen={isCertificateModalOpen}
            onClose={() => {
              setIsCertificateModalOpen(false);
              setActiveLearningPage('none');
            }}
            userName={roadmap?.userName || ''}
            skillName={learningSkill?.name || ''}
          />

          {/* AI Learning Hub Modal */}
          {activePage === 'page-roadmap' && activeLearningPage === 'hub' && learningSkill && (
             <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-md">
               <div className="w-full max-w-7xl h-full max-h-[90vh] bg-slate-50 relative overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
                 <AILearningHub 
                   skill={learningSkill}
                   onSelectCourse={(course) => {
                     setSelectedCourse(course);
                     setActiveLearningPage('dashboard');
                   }}
                   onBack={() => setActiveLearningPage('none')}
                 />
               </div>
             </div>
          )}

          {/* AI Course Dashboard Modal */}
          {activePage === 'page-roadmap' && activeLearningPage === 'dashboard' && learningSkill && selectedCourse && (
             <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-md">
               <div className="w-full max-w-7xl h-full max-h-[90vh] bg-slate-900 text-slate-300 relative overflow-hidden rounded-3xl shadow-2xl border border-slate-700 flex flex-col animate-in fade-in zoom-in-95 duration-300">
                 <CourseDashboard 
                   skill={learningSkill}
                   course={selectedCourse}
                   onBack={() => setActiveLearningPage('none')}
                   onApplyChecklist={handleApplyChecklist}
                   onCompleteCourse={handleCompleteCourse}
                 />
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
