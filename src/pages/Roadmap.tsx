import { useState, useEffect } from 'react';
import type { UserRoadmap, Skill, SubTopic, Milestone } from '../types/roadmap';
import { ApiService } from '../services/apiService';
import { TopNavbar } from '../components/layout/TopNavbar';
import { SidebarNav } from '../components/layout/SidebarNav';
import { RoadmapHeader } from '../components/roadmap/RoadmapHeader';
import { SpiderChart } from '../components/roadmap/SpiderChart';
import { SkillCategoryList } from '../components/roadmap/SkillCategoryList';
import { AIMilestoneEvaluator } from '../components/ai/AIMilestoneEvaluator';
import { AIQuizModal } from '../components/ai/AIQuizModal';
import { AICareerChatbot } from '../components/ai/AICareerChatbot';
import { AnalyticsPage } from '../components/pages/AnalyticsPage';
import { QuizLibraryPage } from '../components/pages/QuizLibraryPage';
import { AllSkillsPage } from '../components/pages/AllSkillsPage';
import { SettingsPage } from '../components/pages/SettingsPage';
import Onboarding from './Onboarding';
import '../App.css';

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('ms-stage-1');

  // Page Routing State (Sidebar Vertical Tabs switch DIFFERENT PAGES)
  const [activePage, setActivePage] = useState<string>(() => {
    if (window.location.pathname.includes('/roadmap')) {
      return 'page-roadmap';
    }
    return 'page-onboarding';
  });

  // Sub-Tab Navigation inside Roadmap Page (Horizontal Tabs in Header)
  const [activeSubTab, setActiveSubTab] = useState<string>('view-all');

  // Sidebar Drawer Open/Close State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // Modal & Chatbot States
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopic | null>(null);
  const [isCareerChatOpen, setIsCareerChatOpen] = useState(false);

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

  const handleToggleCheck = async (skill: Skill, subTopic: SubTopic, completed: boolean) => {
    if (!roadmap) return;

    try {
      const updatedData = await ApiService.updateSubTopic({
        milestoneId: activeMilestoneId,
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

  const handleSuccessEvaluation = async () => {
    await loadRoadmap();
  };

  const handleSelectSubTab = (tabId: string) => {
    setActiveSubTab(tabId);
    if (tabId === 'view-all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetMap: Record<string, string> = {
      'view-checklist': 'sec-checklist',
      'view-radar': 'sec-radar',
      'view-optimizer': 'sec-optimizer',
    };

    const targetId = targetMap[tabId];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };




  if (loading || !roadmap) {
    return (
      <div className="app-loading-screen">
        <div className="spin-icon" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💫</div>
        <h2>Skill Compass AI - Loading system data...</h2>
      </div>
    );
  }

  const activeMilestone =
    (roadmap?.milestones && roadmap.milestones.length > 0)
      ? (roadmap.milestones.find((m) => m.id === activeMilestoneId) || roadmap.milestones[0])
      : null;

  return (
    <div className="app-main-outer-shell">
      {/* 1. Sticky Top Navbar với các Tab chuyển trang chính (Lộ Trình, Tất Cả Kỹ Năng, Bài Tập & Test) */}
      <TopNavbar
        userName={roadmap.userName}
        activePage={activePage}
        activeSubTab={activeSubTab}
        onSelectSubTab={handleSelectSubTab}
        onSelectPage={(page) => setActivePage(page)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenCareerChat={() => setIsCareerChatOpen(true)}
      />

      <div className="app-layout-wrapper">
        {/* 2. Thanh Tab Dọc Đẩy Ra Dạng Drawer */}
        <SidebarNav
          userName={roadmap.userName}
          activePage={activePage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSelectPage={(page) => setActivePage(page)}
          onOpenCareerChat={() => setIsCareerChatOpen(true)}
        />

        {/* 3. Main Viewport Container */}
        <div className="main-viewport">
          {activePage === 'page-onboarding' && (
            <Onboarding onFinish={async () => {
              await loadRoadmap();
              setActivePage('page-roadmap');
            }} />
          )}

          {activePage === 'page-roadmap' && (
            <div className="roadmap-page-view">
              {/* Horizontal Milestone Tabs */}
              <RoadmapHeader
                milestones={roadmap.milestones || []}
                activeMilestoneId={activeMilestoneId}
                onSelectMilestone={handleSelectMilestone}
                onOpenCareerChat={() => setIsCareerChatOpen(true)}
              />

              {/* Tất cả các thành phần luôn được hiển thị trọn vẹn trên 1 TRANG duy nhất */}
              {activeMilestone && (
                <div className="roadmap-single-page-wrapper">
                  {/* Row 1: AI Đánh Giá Tổng Thể & Biểu Đồ Mạng Nhện nằm CHUNG 1 DÒNG */}
                  <div className="top-eval-radar-row">
                    <div className="evaluator-col" id="sec-optimizer">
                      <AIMilestoneEvaluator
                        milestone={activeMilestone}
                        onRefreshRoadmap={loadRoadmap}
                        onOpenCareerChat={() => setIsCareerChatOpen(true)}
                      />
                    </div>
                    <div className="radar-col" id="sec-radar">
                      <SpiderChart
                        categories={activeMilestone.categories || []}
                        milestoneTitle={activeMilestone.title || ''}
                      />
                    </div>
                  </div>

                  {/* Row 2: Danh Sách Kỹ Năng / Checklist rộng 100% bên dưới */}
                  <div className="checklist-full-row" id="sec-checklist">
                    <SkillCategoryList
                      categories={activeMilestone.categories || []}
                      onOpenQuiz={handleOpenQuiz}
                      onToggleCheck={handleToggleCheck}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activePage === 'page-all-skills' && (
            <AllSkillsPage
              milestones={roadmap.milestones || []}
              onOpenQuiz={handleOpenQuiz}
              onToggleCheck={handleToggleCheck}
            />
          )}

          {activePage === 'page-analytics' && activeMilestone && (
            <AnalyticsPage milestone={activeMilestone} />
          )}

          {activePage === 'page-quiz-lib' && (
            <QuizLibraryPage
              milestones={roadmap.milestones || []}
              onOpenQuiz={handleOpenQuiz}
            />
          )}

          {activePage === 'page-settings' && (
            <SettingsPage userName={roadmap.userName} />
          )}

          {/* AI Quiz Modal */}
          {activeMilestone && (
            <AIQuizModal
              isOpen={isQuizModalOpen}
              milestoneId={activeMilestoneId}
              milestoneTitle={activeMilestone.title}
              skill={selectedSkill}
              subTopic={selectedSubTopic}
              onClose={() => setIsQuizModalOpen(false)}
              onSuccessEvaluation={handleSuccessEvaluation}
            />
          )}

          {/* Floating AI Career Advisor Chatbot với chức năng Thêm Mốc Lộ Trình Tương Lai do AI Đề Xuất */}
          <AICareerChatbot
            milestoneId={activeMilestoneId}
            milestoneTitle={activeMilestone.title}
            forceOpen={isCareerChatOpen}
            onCloseForceOpen={() => setIsCareerChatOpen(false)}
            onAddMilestone={handleAddMilestone}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </div>
    </div>
  );
}

