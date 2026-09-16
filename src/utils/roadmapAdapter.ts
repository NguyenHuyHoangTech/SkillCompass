import type { UserRoadmap, Milestone as ComplexMilestone, SkillCategory, Skill as ComplexSkill, SubTopic } from '../types/roadmap';
import type { Milestone as SimpleMilestone } from '../services/ai';

export const convertToUserRoadmap = (
    simpleMilestones: SimpleMilestone[], 
    targetCareer: string, 
    assessFeedback: string,
    testedSkills: string[]
): UserRoadmap => {
    const complexMilestones: ComplexMilestone[] = simpleMilestones.map((sm, index) => {
        const complexSkills: ComplexSkill[] = (sm.skills || []).map((ss, sIdx) => {
            const subTopics: SubTopic[] = [
                {
                    id: `st-${sm.id}-${sIdx}-1`,
                    title: `Core principles of ${ss.title}`,
                    isCompleted: false,
                    courseraUrl: `https://www.coursera.org/search?query=${encodeURIComponent(ss.title + ' fundamentals')}`
                },
                {
                    id: `st-${sm.id}-${sIdx}-2`,
                    title: `Practical application of ${ss.title}`,
                    isCompleted: false,
                    courseraUrl: `https://www.coursera.org/search?query=${encodeURIComponent(ss.title + ' practical project')}`
                }
            ];

            const isTested = testedSkills.some(ts => ts.toLowerCase().includes(ss.title.toLowerCase()) || ss.title.toLowerCase().includes(ts.toLowerCase()));
            if (isTested && assessFeedback) {
                subTopics[0].isCompleted = true;
                subTopics[0].assessmentScore = 85;
                subTopics[0].aiFeedback = assessFeedback;
            }

            const completedCount = subTopics.filter(st => st.isCompleted).length;
            const levelPercentage = Math.round((completedCount / subTopics.length) * 100);

            return {
                id: `skill-${sm.id}-${sIdx}`,
                name: ss.title,
                levelPercentage: levelPercentage,
                subTopics: subTopics
            };
        });

        const category: SkillCategory = {
            id: `cat-${sm.id}-1`,
            name: "Core Competency Skills",
            skills: complexSkills
        };

        const allSubTopics = complexSkills.flatMap(s => s.subTopics);
        const completedSubTopics = allSubTopics.filter(st => st.isCompleted).length;
        const overallProgress = allSubTopics.length > 0 ? Math.round((completedSubTopics / allSubTopics.length) * 100) : 0;

        return {
            id: sm.id,
            title: sm.title,
            roleName: targetCareer,
            description: sm.goal || `Goal: ${sm.title}`,
            badge: "🏆",
            overallProgress: overallProgress,
            categories: [category],
            isOptimizedByAi: true
        };
    });

    return {
        id: `roadmap-${Date.now()}`,
        userId: "user-1",
        userName: "New User",
        targetRole: targetCareer,
        currentMilestoneId: complexMilestones.length > 0 ? complexMilestones[0].id : '',
        milestones: complexMilestones,
        updatedAt: new Date().toISOString()
    };
};
