import { GoogleGenAI } from '@google/genai';

// Initialize the API with the provided key or environment variable
let apiKeysList: string[] = [
    localStorage.getItem('gemini_api_key') || '',
    import.meta.env.VITE_GEMINI_API_KEY || '',
    // Add your API keys here as strings, e.g., 'AIzaSy...', 'AIzaSy...'
].filter(Boolean);

if (apiKeysList.length === 0) {
    apiKeysList.push('AQ.Ab8RN6JDlnH8wQy06XFKjWScBEUvJunwZkBJsEFIAiU21keBhw'); // default fallback
}

let currentKeyIndex = 0;
export let _ai = new GoogleGenAI({ apiKey: apiKeysList[currentKeyIndex] });
export let _modelName = localStorage.getItem('gemini_model_name') || 'gemini-3.5-flash';

export const setApiKeysList = (keys: string[]) => {
    apiKeysList = keys.filter(Boolean);
    currentKeyIndex = 0;
    if (apiKeysList.length > 0) {
        _ai = new GoogleGenAI({ apiKey: apiKeysList[0] });
    }
};

export const updateAIConfig = (newKey: string, newModel: string) => {
    if (newKey && !apiKeysList.includes(newKey)) {
        apiKeysList.unshift(newKey); // Put new key at the top
        localStorage.setItem('gemini_api_key', newKey);
        currentKeyIndex = 0;
        _ai = new GoogleGenAI({ apiKey: newKey });
    }
    if (newModel) {
        _modelName = newModel;
        localStorage.setItem('gemini_model_name', newModel);
    }
};

const executeWithFallback = async (_prompt: string): Promise<string> => {
    // Force mock mode for UI testing by throwing an error immediately
    throw new Error("MOCK_MODE_ENABLED");
};

export const getAvailableModels = async (key: string): Promise<{success: boolean, models: string[], message: string}> => {
    try {
        const testAi = new GoogleGenAI({ apiKey: key });
        const res = await testAi.models.list();
        const models: string[] = [];
        for await (const m of res) {
            const modelNameStr = m.name.replace(/^models\//, '');
            if (modelNameStr.includes('gemini') || modelNameStr.includes('gemma')) {
                models.push(modelNameStr);
            }
        }
        return { success: true, models, message: "Models fetched successfully!" };
    } catch (e: any) {
        console.error("List models failed:", e);
        return { success: false, models: [], message: e.message || "Connection failed!" };
    }
};

export const testGeminiKey = async (key: string, model: string, customMessage: string = "Test message"): Promise<{success: boolean, message: string, reply?: string}> => {
    try {
        const testAi = new GoogleGenAI({ apiKey: key });
        const response = await testAi.models.generateContent({
            model: model,
            contents: customMessage,
        });
        const replyText = response.text;
        return { success: !!replyText, message: "Connection successful!", reply: replyText };
    } catch (e: any) {
        console.error("Test API Key failed:", e);
        return { success: false, message: e.message || "Connection failed!" };
    }
};

export const generateAssessmentQuestion = async (skill: string): Promise<string> => {
    const prompt = `You are a technical recruitment expert. Please provide 1 SHORT, practical situational question (maximum 2 sentences) to assess a candidate's proficiency in the skill "${skill}". The question should closely reflect a real-world working scenario, avoiding purely theoretical questions. Please respond in English.`;
    
    try {
        const responseText = await executeWithFallback(prompt);
        return responseText || `Can you share your most practical experience working with ${skill}?`;
    } catch (error) {
        console.error("AI Error:", error);
        return `How do you handle difficult bugs or errors when working with ${skill}?`;
    }
};

export const evaluateAssessmentAnswer = async (skill: string, answer: string): Promise<string> => {
    const prompt = `Act as a technical expert. A candidate just answered a question regarding the skill "${skill}" as follows: "${answer}". 
Provide an EXTREMELY SHORT evaluation of this answer (1-2 sentences). Praise them if correct, or give constructive feedback if wrong. Maintain a professional and constructive tone. Please respond in English.`;
    
    try {
        const responseText = await executeWithFallback(prompt);
        return responseText || "Your answer has been recorded and well evaluated.";
    } catch (error) {
        console.error("AI Error:", error);
        return "Thank you for sharing. Your experience is very valuable.";
    }
};

export const generateSandboxScenario = async (career: string): Promise<string> => {
    const prompt = `You are the direct manager of a "${career}". Provide a SHORT hypothetical sandbox scenario (about 3-4 sentences) describing a practical, slightly challenging problem or task that someone in this role must solve on their very first day of work. For example: The boss drops a broken Excel file... Please respond in English.`;
    
    try {
        const responseText = await executeWithFallback(prompt);
        return responseText || `Welcome to your first day! An unexpected task related to ${career} has just been assigned to you. Where do you start?`;
    } catch (error) {
        console.error("AI Error:", error);
        return "The system encountered a minor issue. Let's assume you have an urgent deadline to meet right now.";
    }
};

export const evaluateSandboxChoice = async (career: string, choiceType: string): Promise<string> => {
    let choiceText = "";
    switch(choiceType) {
        case 'code': choiceText = "Write code/scripts to automate the process."; break;
        case 'ai': choiceText = "Use AI tools (like ChatGPT, Gemini) for a quick solution."; break;
        case 'manual': choiceText = "Perform the task manually step-by-step using basic tools."; break;
        case 'ask': choiceText = "Ask the person who assigned the task or colleagues for clarification before starting."; break;
        default: choiceText = choiceType;
    }

    const prompt = `The user is applying for the "${career}" position. Faced with a difficult problem, they chose to handle it by: "${choiceText}".
Provide a SHORT evaluation (2-3 sentences) regarding the professional mindset behind this choice. Suggest 1 specific skill or mindset they NEED TO ADD in the future to grow stronger in this role. Please respond in English.`;
    
    try {
        const responseText = await executeWithFallback(prompt);
        return responseText || "Your choice shows a solid practical mindset. However, always be open to learning new skills.";
    } catch (error) {
        console.error("AI Error:", error);
        return "This is a very practical choice. Keep up the good work!";
    }
};

export interface Milestone {
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'planned';
    progress: number;
    start_date: string;
    end_date: string;
    goal: string;
    user_notes: string;
    skills: Skill[];
}

export interface Skill {
    id: string;
    title: string;
    category: string;
    status: 'completed' | 'in-progress' | 'planned';
    goal: string;
    user_notes: string;
    ai_practice_scenario: string;
    sub_tasks: SubTask[];
}

export interface SubTask {
    id: string;
    text: string;
    is_completed: boolean;
    completion_note: string;
}

export const generateRoadmap = async (skills: string[], career: string, sandboxFeedback: string): Promise<Milestone[]> => {
    const prompt = `You are an excellent AI Career Coach. Please design a Career Roadmap in a standard JSON format for someone who wants to become a "${career}".
Their current skills: ${skills.join(', ')}.
Feedback on their working mindset: ${sandboxFeedback}.

Output requirements: 
Extract EXACTLY AND ONLY a JSON array (no markdown \`\`\`json or extra text) containing exactly 3 objects representing 3 Milestones.
The JSON structure for each Milestone is as follows:
{
    "id": "m1", // m1, m2, m3
    "title": "Milestone Title (e.g., Ready for Internship)",
    "status": "completed", // m1: completed, m2: in-progress, m3: planned
    "progress": 100, // 100, 35, 0...
    "start_date": "01/09/2026",
    "end_date": "15/11/2026",
    "goal": "Main goal",
    "user_notes": "Encouraging notes",
    "skills": [ // 1-2 skills per milestone
        {
            "id": "s1", 
            "title": "Skill name",
            "category": "Core Tech or AI-Era Competency",
            "status": "completed", // matching the milestone's status
            "goal": "Skill goal",
            "user_notes": "",
            "ai_practice_scenario": "1 tough practical question regarding this skill",
            "sub_tasks": [ // 1-2 sub tasks
                { "id": "st1_1", "text": "Subtask name", "is_completed": true, "completion_note": "Pass" }
            ]
        }
    ]
}
Ensure the content is in English, practical, and the JSON is directly parseable.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s) || rawText.match(/\{.*\}/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as Milestone[];
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return getMockMilestones(career);
    }
};

export const optimizeRoadmap = async (_currentRoadmap: any, country: string): Promise<string> => {
    const prompt = `Briefly analyze (2-3 sentences) current IT hiring trends in the "${country}" market. Then suggest 1 LATEST AI skill the candidate needs to learn to avoid becoming obsolete. Format as follows:
Analysis: ...
Suggestion: ...
Please respond in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        return responseText || `The ${country} market is hungry for AI-integrated personnel. Learn more about Generative AI.`;
    } catch (error) {
        console.error("AI Error:", error);
        return `The ${country} market is in high demand for high-quality personnel.`;
    }
};

export const evaluateSkillPractice = async (skillTitle: string, scenario: string, answer: string): Promise<string> => {
    const prompt = `You are an AI Mentor. The user is practicing the skill "${skillTitle}".
Scenario provided: "${scenario}".
Their answer: "${answer}".
Provide a SHORT evaluation (2-3 sentences) of their answer. Emphasize their programming/problem-solving mindset. Please respond in English.`;
    try {
        const responseText = await executeWithFallback(prompt);
        return responseText || `The approach is quite good. Pay more attention to code optimization.`;
    } catch (error) {
        console.error("AI Error:", error);
        return `Your answer has been recorded.`;
    }
};

export interface IkigaiCareerSuggestion {
    title: string;
    reason: string;
    mini_roadmap: string[];
    real_world_example: string;
}

export const suggestIkigaiCareers = async (skills: string[], riasecScores: Record<string, number>, ikigaiText: string): Promise<IkigaiCareerSuggestion[]> => {
    const sortedTraits = Object.keys(riasecScores).sort((a, b) => riasecScores[b] - riasecScores[a]);
    const top2 = sortedTraits.slice(0, 2);
    const map: Record<string, string> = { 
        R: 'Realistic', I: 'Investigative', A: 'Artistic', 
        S: 'Social', E: 'Enterprising', C: 'Conventional' 
    };
    const traits = top2.map(k => map[k]);

    const prompt = `Analyze this career orientation profile:
- Current skills (What you are good at): ${skills.join(', ')}
- Dominant RIASEC personality traits: ${traits.join(', ')}
- Additional sharing from the user (Interests, Income expectations, Social needs): "${ikigaiText}"

Based on the Ikigai model, propose exactly 3 IT (or related) job titles that fit best. Return EXACTLY ONE JSON ARRAY with the following structure:
[
  {
    "title": "Job title",
    "reason": "A brief 1-sentence explanation of why it fits their Ikigai.",
    "mini_roadmap": ["Learn basics", "Build practical project", "Apply for internship", "Start working"],
    "real_world_example": "Practical example: Building a task management app for the team."
  }
]
Please respond in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s) || rawText.match(/\{.*\}/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as IkigaiCareerSuggestion[];
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return [
            { 
                title: "Frontend Developer", 
                reason: "Fits your creative nature and skill set well.",
                mini_roadmap: ["HTML/CSS/JS", "React", "UI Optimization"],
                real_world_example: "Building a beautiful and highly interactive e-commerce website."
            },
            { 
                title: "UX/UI Designer", 
                reason: "Perfectly leverages your aesthetic sensitivity and technical foundation.",
                mini_roadmap: ["Figma", "UX Principles", "Prototyping"],
                real_world_example: "Designing an educational app interface that is easy for students to use."
            },
            { 
                title: "Data Analyst", 
                reason: "Ideal for your love of research and data analysis.",
                mini_roadmap: ["Excel/SQL", "Python", "Dashboards"],
                real_world_example: "Analyzing revenue data to help executives make informed decisions."
            }
        ];
    }
};

export interface RiasecCard {
    id: string;
    text: string;
}

export const generateIkigaiQuestions = async (skills: string[]): Promise<{ love: string, money: string }> => {
    const prompt = `You are an Ikigai Career Coach. The user has these skills: ${skills.join(', ')}.
Generate 2 SHORT questions (1 line each) to ask them:
1. About Love (What you love): Based on the skills above, ask what aspect of the work they enjoy doing the most.
2. About Money (What you can be paid for): Ask about their starting salary expectations or desired stability in the industry related to these skills.
Return EXACTLY ONE JSON OBJECT with the structure:
{
  "love": "Question about what they love...",
  "money": "Question about income expectations..."
}
Please respond in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s) || rawText.match(/\{.*\}/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText);
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return {
            love: `With skills like ${skills.join(', ')}, what type of work makes you feel the most excited and engaged?`,
            money: `What are your starting salary expectations when applying these skills in the real world?`
        };
    }
};

export const generateDynamicRIASECCards = async (skills: string[]): Promise<RiasecCard[]> => {
    const prompt = `Based on the skill set: [${skills.join(', ')}]. Generate 6 real-world work scenarios representing the 6 personality types R, I, A, S, E, C in the RIASEC model. The scenarios must be DIRECTLY TIED to the skill set above, highly practical, and engaging. They must follow these frameworks:
- R (Realistic): Working directly with machines, coding, bug fixing, hands-on tasks rather than meetings.
- I (Investigative): Spending hours reading documentation, deeply researching an algorithm/problem.
- A (Artistic): Freeform design, breaking the rules, creative UI/UX.
- S (Social): Mentoring, training, helping colleagues or new interns.
- E (Enterprising): Pitching, defending ideas, seeking investment, managing.
- C (Conventional): Writing documentation/APIs, standardizing processes, carefully organizing folder structures.

Return EXACTLY ONE JSON ARRAY, with no extra text or markdown blocks, in the structure:
[
  { "id": "R", "text": "Scenario for group R (Realistic/Technical/Hands-on)" },
  { "id": "I", "text": "Scenario for group I (Investigative/Analytical/Research)" },
  { "id": "A", "text": "Scenario for group A (Artistic/Creative/Unconventional)" },
  { "id": "S", "text": "Scenario for group S (Social/Communicative/Mentoring)" },
  { "id": "E", "text": "Scenario for group E (Enterprising/Management/Persuasion)" },
  { "id": "C", "text": "Scenario for group C (Conventional/Organization/Documentation)" }
]
Please respond in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s) || rawText.match(/\{.*\}/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as RiasecCard[];
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return [
            { id: 'R', text: 'Burying your head in the computer to fix bugs or manually wire up servers instead of attending meetings.' },
            { id: 'I', text: 'Spending 3 hours just reading documentation to find the most optimal algorithm.' },
            { id: 'A', text: 'Freely designing an unconventional UI/UX interface that defies standard conventions.' },
            { id: 'S', text: 'Guiding and training new interns joining the team.' },
            { id: 'E', text: 'Directly pitching and persuading investors to fund the project.' },
            { id: 'C', text: 'Writing API documentation and reorganizing the entire codebase folder structure for the team.' }
        ];
    }
};

export interface DualRoadmapsResponse {
    option1: {
        title: string;
        description: string;
        milestones: Milestone[];
    };
    option2: {
        title: string;
        description: string;
        milestones: Milestone[];
    };
}

export const generateDualRoadmaps = async (
    goal: string, 
    skills: string[], 
    riasecScores: Record<string, number>, 
    ikigaiText: string,
    contextTriangle: { time: string, academic: string, budget: string }
): Promise<DualRoadmapsResponse> => {
    const prompt = `You are an excellent AI Career Coach. Please design TWO (2) Career Roadmaps in standard JSON format for the goal "${goal}".
Analysis data:
- Current skills: ${skills.join(', ')}
- RIASEC Personality: ${JSON.stringify(riasecScores)}
- Ikigai Text: "${ikigaiText}"
- Context Triangle (Reality):
  + Time available: ${contextTriangle.time}
  + Academic status: ${contextTriangle.academic}
  + Resources (Financial): ${contextTriangle.budget}

Requirement: Option 1 can focus on a safe, core technical roadmap. Option 2 can be bolder, more niche, or heavily utilize AI.
Return EXACTLY ONE JSON OBJECT with the structure:
{
  "option1": {
    "title": "Roadmap 1 Title",
    "description": "Short description of roadmap 1",
    "milestones": [
      {
        "id": "m1",
        "title": "Milestone Title (e.g., Milestone 1: Foundations)",
        "goal": "Short goal for this milestone",
        "skills": [
          { "title": "Skill Name (e.g., ReactJS)" }
        ]
      }
    ]
  },
  "option2": {
    "title": "Roadmap 2 Title",
    "description": "Short description of roadmap 2",
    "milestones": [ /* Similar structure to option1 */ ]
  }
}
Please respond in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s) || rawText.match(/\{.*\}/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as DualRoadmapsResponse;
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return {
            option1: {
                title: "Standard Roadmap",
                description: "Steady steps focusing on core technical foundations.",
                milestones: getMockMilestones(goal)
            },
            option2: {
                title: "AI Breakthrough Roadmap",
                description: "Maximizing AI tools to accelerate speed and bypass manual steps.",
                milestones: getMockMilestones(goal)
            }
        };
    }
};

export const refineRoadmap = async (currentMilestones: Milestone[], feedback: string): Promise<Milestone[] | null> => {
    const prompt = `The user wants to adjust the current roadmap with this feedback: "${feedback}".
Current Roadmap: ${JSON.stringify(currentMilestones)}

Based on the feedback, update the content of this roadmap (add/remove milestones or change the skills/timelines to learn). Return a NEW Milestone JSON ARRAY. Do not use markdown blocks, just return JSON. Please ensure all content is in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s) || rawText.match(/\{.*\}/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as Milestone[];
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return null;
    }
};

const getMockMilestones = (career: string): Milestone[] => {
    return [
        {
            id: 'm1', title: 'Milestone 1: Ready for Internship', status: 'completed', progress: 100,
            start_date: '01/09/2026', end_date: '15/11/2026', goal: `Build foundations for ${career}`,
            user_notes: 'Completed basics',
            skills: [
                {
                    id: 's1', title: 'HTML / CSS / JavaScript', category: 'Core Tech', status: 'completed',
                    goal: 'Understand the core concepts', user_notes: '', ai_practice_scenario: 'Please describe how you apply this knowledge in practice.',
                    sub_tasks: [{ id: 'st1', text: 'Master theory', is_completed: true, completion_note: 'Learned' }]
                },
                {
                    id: 's1b', title: 'Git & GitHub', category: 'Tool', status: 'completed',
                    goal: 'Source code management', user_notes: '', ai_practice_scenario: '',
                    sub_tasks: []
                }
            ]
        },
        {
            id: 'm2', title: 'Milestone 2: Junior', status: 'in-progress', progress: 35,
            start_date: '16/11/2026', end_date: '15/03/2027', goal: 'Apply to projects',
            user_notes: 'Working on projects',
            skills: [
                {
                    id: 's2', title: 'ReactJS / VueJS', category: 'Core Tech', status: 'in-progress',
                    goal: 'Build smooth interfaces', user_notes: '', ai_practice_scenario: 'How do you optimize rendering performance in your project?',
                    sub_tasks: [{ id: 'st2', text: 'Performance optimization', is_completed: false, completion_note: '' }]
                },
                {
                    id: 's2b', title: 'Tailwind CSS', category: 'UI', status: 'planned',
                    goal: 'Rapid styling', user_notes: '', ai_practice_scenario: '',
                    sub_tasks: []
                }
            ]
        },
        {
            id: 'm3', title: 'Milestone 3: AI Era', status: 'planned', progress: 0,
            start_date: '16/03/2027', end_date: '15/08/2027', goal: 'AI Integration',
            user_notes: '',
            skills: [
                {
                    id: 's3', title: 'ChatGPT / Cursor', category: 'AI-Era Competency', status: 'planned',
                    goal: 'Use AI tools effectively', user_notes: '', ai_practice_scenario: 'How do you write a prompt for an AI to generate bug-free code?',
                    sub_tasks: [{ id: 'st3', text: 'Prompt Mastery', is_completed: false, completion_note: '' }]
                }
            ]
        }
    ];
}


// --- NEW ONBOARDING REDESIGN FUNCTIONS ---

export interface SkillQuestion {
    skill: string;
    question: string;
}

export const generateAssessmentQuestions = async (skillsText: string): Promise<SkillQuestion[]> => {
    const prompt = `The user entered the following skills: "${skillsText}".
If there are more than 5 skills, pick the top 5 most important/core skills. For each skill, generate 1 short, practical situational question (max 2 sentences) to assess their proficiency in a real-world scenario.
Return EXACTLY ONE JSON ARRAY of objects with this structure:
[
  { "skill": "Skill Name", "question": "Question text here..." }
]
Please respond in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(rawText) as SkillQuestion[];
    } catch (error) {
        console.error("AI Error:", error);
        // Fallback for demo
        const fallbackSkills = skillsText.split(',').map(s => s.trim()).slice(0, 5);
        return fallbackSkills.map(s => ({
            skill: s,
            question: `Can you describe your most complex practical experience working with ${s}?`
        }));
    }
};

export interface SkillFeedback {
    skill: string;
    feedback: string;
}

export const evaluateAssessmentAnswers = async (answers: {skill: string, answer: string}[]): Promise<SkillFeedback[]> => {
    const prompt = `Act as a technical expert. The user provided answers for several skills.
Data:
${JSON.stringify(answers, null, 2)}

Provide an EXTREMELY SHORT evaluation (1-2 sentences) for EACH answer. Praise if correct, give constructive feedback if wrong.
Return EXACTLY ONE JSON ARRAY of objects with this structure:
[
  { "skill": "Skill Name", "feedback": "Evaluation feedback here..." }
]
Please respond in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(rawText) as SkillFeedback[];
    } catch (error) {
        console.error("AI Error:", error);
        return answers.map(a => ({
            skill: a.skill,
            feedback: "Your answer has been recorded and evaluated as practically solid."
        }));
    }
};

export const generateDynamicRIASECCardsV2 = async (profileData: { skills: string, hobbies: string, income: string, extra: string, testResults: SkillFeedback[] }): Promise<RiasecCard[]> => {
    const prompt = `Based on the user's profile:
- Skills: ${profileData.skills}
- Hobbies: ${profileData.hobbies}
- Desired Income: ${profileData.income}
- Extra Info: ${profileData.extra}
- Test Feedbacks: ${JSON.stringify(profileData.testResults.map(t => t.skill + ': ' + t.feedback))}

Generate 6 real-world work scenarios representing the 6 personality types R, I, A, S, E, C in the RIASEC model. They must be highly personalized to the user's data above.
- R (Realistic): Working directly with machines, coding, hands-on tasks.
- I (Investigative): Deeply researching an algorithm/problem.
- A (Artistic): Freeform design, creative solutions.
- S (Social): Mentoring, training, helping colleagues.
- E (Enterprising): Pitching, managing, seeking investment.
- C (Conventional): Writing documentation, standardizing processes.

Return EXACTLY ONE JSON ARRAY in the structure:
[
  { "id": "R", "text": "Scenario for group R..." },
  { "id": "I", "text": "Scenario for group I..." },
  { "id": "A", "text": "Scenario for group A..." },
  { "id": "S", "text": "Scenario for group S..." },
  { "id": "E", "text": "Scenario for group E..." },
  { "id": "C", "text": "Scenario for group C..." }
]
Please respond in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(rawText) as RiasecCard[];
    } catch (error) {
        console.error("AI Error:", error);
        return [
            { id: 'R', text: 'Burying your head in the computer to fix bugs or manually wire up servers.' },
            { id: 'I', text: 'Spending 3 hours just reading documentation to find the most optimal algorithm.' },
            { id: 'A', text: 'Freely designing an unconventional UI/UX interface.' },
            { id: 'S', text: 'Guiding and training new interns joining the team.' },
            { id: 'E', text: 'Directly pitching and persuading investors.' },
            { id: 'C', text: 'Writing API documentation and reorganizing the folder structure.' }
        ];
    }
};

export interface CareerGoalResponse {
    title: string;
    suitabilityReason: string;
    jobExample: string;
    estimatedTime: string;
    milestones: Milestone[];
}

export const generateCareerGoals = async (allData: any): Promise<CareerGoalResponse[]> => {
    const prompt = `You are a world-class AI Career Coach.
User Profile:
- Skills & Test Results: ${JSON.stringify(allData.step2Data)}
- Hobbies: ${allData.step1Data.hobbies}
- Desired Income: ${allData.step1Data.income}
- Extra Info: ${allData.step1Data.extra}
- RIASEC Scores: ${JSON.stringify(allData.step3Data.riasecScores)}
- Context Triangle: Time: ${allData.step3Data.time}, Academic: ${allData.step3Data.academic}, Budget: ${allData.step3Data.budget}

Based on this deep profile, propose EXACTLY TWO (2) highly personalized IT Career Goals (one safe/standard, one bolder/niche). 
For EACH goal, generate a detailed roadmap of Milestones (like ready for internship, junior, AI integration).
Return EXACTLY ONE JSON ARRAY of objects with this structure (ensure JSON is valid):
[
  {
    "title": "Goal Title (e.g., Fullstack AI Developer)",
    "suitabilityReason": "Why this fits their profile (1-2 sentences).",
    "jobExample": "Practical job example (1 sentence).",
    "estimatedTime": "Estimated total time (e.g., 6-8 months).",
    "milestones": [
      {
        "id": "m1",
        "title": "Milestone Title",
        "status": "planned",
        "progress": 0,
        "start_date": "MM/YYYY",
        "end_date": "MM/YYYY",
        "goal": "Milestone goal",
        "user_notes": "",
        "skills": [
          {
            "id": "s1",
            "title": "Skill name",
            "category": "Core",
            "status": "planned",
            "goal": "Skill goal",
            "user_notes": "",
            "ai_practice_scenario": "1 practice scenario",
            "sub_tasks": [
               { "id": "st1", "text": "Subtask name", "is_completed": false, "completion_note": "" }
            ]
          }
        ]
      }
    ]
  }
]
Please respond in English. DO NOT wrap in markdown, just output the raw JSON array.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(rawText) as CareerGoalResponse[];
    } catch (error) {
        console.error("AI Error:", error);
        return [
            {
                title: "Frontend React Developer",
                suitabilityReason: "Matches your strong foundation in UI and logic.",
                jobExample: "Building dynamic dashboards for fintech startups.",
                estimatedTime: "3-5 months",
                milestones: getMockMilestones("Frontend Developer")
            },
            {
                title: "AI-Integrated UX Engineer",
                suitabilityReason: "Capitalizes on your creativity and desire to automate tasks.",
                jobExample: "Designing and implementing generative AI interfaces.",
                estimatedTime: "6-8 months",
                milestones: getMockMilestones("AI UX Engineer")
            }
        ];
    }
};

export const refineCareerGoals = async (currentGoals: CareerGoalResponse[], feedback: string): Promise<CareerGoalResponse[] | null> => {
    const prompt = `The user wants to adjust their career goals with this feedback: "${feedback}".
Current Goals: ${JSON.stringify(currentGoals)}

Based on the feedback, update the content of these goals (e.g., change the roadmap, shift the focus, adjust timelines). Return a NEW JSON ARRAY of CareerGoalResponse. Do not use markdown blocks, just return JSON. Please ensure all content is in English.`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\[.*\]/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(rawText) as CareerGoalResponse[];
    } catch (error) {
        console.error("AI Error:", error);
        // Fallback mock data for refine
        return [
            {
                title: "Refined: Senior Custom Developer",
                suitabilityReason: "Updated based on your recent feedback: " + feedback,
                jobExample: "Building advanced tools tailored to specific requirements.",
                estimatedTime: "4-6 months",
                milestones: getMockMilestones("Senior Developer")
            },
            {
                title: "Refined: Specialized Architect",
                suitabilityReason: "A more focused path adapting to your timeline and preferences.",
                jobExample: "Designing scalable system architectures.",
                estimatedTime: "8-12 months",
                milestones: getMockMilestones("Architect")
            }
        ];
    }
};
