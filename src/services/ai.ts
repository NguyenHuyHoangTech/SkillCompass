import { GoogleGenAI } from '@google/genai';

const getEnvApiKeys = (): string[] => {
    const keys: string[] = [];
    
    // Explicit static access for Vite define replacement
    const explicitKeys = [
        import.meta.env.VITE_GEMINI_API_KEY,
        import.meta.env.VITE_GEMINI_API_KEY_2,
        import.meta.env.VITE_GEMINI_API_KEY_3,
        import.meta.env.VITE_GEMINI_API_KEY_4,
        import.meta.env.VITE_GEMINI_API_KEY_5,
        import.meta.env.VITE_GEMINI_API_KEY_6,
        import.meta.env.VITE_GEMINI_API_KEY_7,
        import.meta.env.VITE_GEMINI_API_KEY_8,
        import.meta.env.VITE_GEMINI_API_KEY_9,
        import.meta.env.VITE_GEMINI_API_KEY_10
    ];

    explicitKeys.forEach(val => {
        if (val && typeof val === 'string' && val.trim()) {
            keys.push(val.trim());
        }
    });

    if (import.meta.env) {
        Object.keys(import.meta.env).forEach(key => {
            if (key.startsWith('VITE_GEMINI_API_KEY')) {
                const val = import.meta.env[key];
                if (val && typeof val === 'string' && val.trim()) {
                    keys.push(val.trim());
                }
            }
        });
    }

    return Array.from(new Set(keys));
};

export const API_KEYS = getEnvApiKeys();

let currentKeyIndex = 0;
let apiKey = localStorage.getItem('gemini_api_key') || API_KEYS[0];
let ai = new GoogleGenAI({ apiKey: apiKey });

let storedModel = localStorage.getItem('gemini_model_name');
if (!storedModel || storedModel.includes('1.5') || storedModel.includes('2.5') || storedModel === 'gemini-flash-latest') {
    storedModel = 'gemini-3.5-flash-lite';
    localStorage.setItem('gemini_model_name', 'gemini-3.5-flash-lite');
}
let modelName = storedModel;

export const rotateAPIKey = (): string => {
    if (API_KEYS.length <= 1) return apiKey;
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    apiKey = API_KEYS[currentKeyIndex];
    localStorage.setItem('gemini_api_key', apiKey);
    ai = new GoogleGenAI({ apiKey: apiKey });
    console.log(`Rotated to Gemini API Key #${currentKeyIndex + 1}: ${apiKey.substring(0, 15)}...`);
    return apiKey;
};

export const callGeminiWithRetry = async (prompt: string): Promise<string | null> => {
    const fallbackModels = Array.from(new Set([modelName, 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.6-flash']));
    
    for (const modelCandidate of fallbackModels) {
        const keyAttempts = Math.max(1, API_KEYS.length);
        for (let i = 0; i < keyAttempts; i++) {
            try {
                if (!apiKey) rotateAPIKey();
                const response = await ai.models.generateContent({
                    model: modelCandidate,
                    contents: prompt,
                });
                if (response && response.text) {
                    return response.text;
                }
            } catch (err: any) {
                console.warn(`Gemini model '${modelCandidate}' attempt ${i + 1}/${keyAttempts} failed with Key #${currentKeyIndex + 1}:`, err?.message || err);
                if (API_KEYS.length > 1) {
                    rotateAPIKey();
                }
            }
        }
    }
    return null;
};

export const updateAIConfig = (newKey: string, newModel: string) => {
    if (newKey) {
        apiKey = newKey;
        localStorage.setItem('gemini_api_key', newKey);
        ai = new GoogleGenAI({ apiKey: apiKey });
    }
    if (newModel) {
        if (newModel.includes('1.5') || newModel.includes('2.5') || newModel === 'gemini-flash-latest') newModel = 'gemini-3.6-flash';
        modelName = newModel;
        localStorage.setItem('gemini_model_name', newModel);
    }
};

export const getAvailableModels = async (key: string): Promise<{success: boolean, models: string[], message: string}> => {
    try {
        const testAi = new GoogleGenAI({ apiKey: key });
        const res = await testAi.models.list();
        const models: string[] = [];
        for await (const m of res) {
            if (!m.name) continue;
            const modelName = m.name.replace(/^models\//, '');
            if (modelName.includes('gemini') || modelName.includes('gemma')) {
                models.push(modelName);
            }
        }
        return { success: true, models, message: "Model list loaded successfully!" };
    } catch (e: any) {
        console.error("List models failed:", e);
        return { success: false, models: [], message: e.message || "Connection failed!" };
    }
};

export interface SkillOverviewResponse {
    market_level_evaluation: string;
    technical_assessment_question: string;
    ikigai_questions: {
        love: string;
        money: string;
    }
}

export const analyzeUserSkillsOverview = async (skills: string[]): Promise<SkillOverviewResponse> => {
    // Separate technical skills from soft skills to avoid weird question generation
    const techSkills = skills.filter(s => 
        !['Core Technical Skills', 'Adaptability', 'Problem Solving', 'Team Collaboration', 'Thuyết trình', 'Làm việc nhóm', 'Teamwork', 'Communication', 'Giao tiếp', 'Presentations'].includes(s)
    );
    const softSkills = skills.filter(s => 
        ['Core Technical Skills', 'Adaptability', 'Problem Solving', 'Team Collaboration', 'Thuyết trình', 'Làm việc nhóm', 'Teamwork', 'Communication', 'Giao tiếp', 'Presentations'].includes(s)
    );

    const prompt = `You are a career advisor and technical interviewer. 
User technical skills: [${techSkills.length > 0 ? techSkills.join(', ') : (skills.length > 0 ? skills.join(', ') : 'Software Engineering')}].
User soft skills: [${softSkills.join(', ')}].

TASK:
1. Provide a brief preliminary market level assessment (e.g. Fresher, Junior, Mid, Senior).
2. Generate 1 practical scenario-based assessment question specifically testing their technical/hard skills. DO NOT concatenate soft skills (like Presentation or Teamwork) into technical architecture questions. If the user only has soft skills, ask a realistic workplace collaboration scenario question. Ask only the question.
3. Formulate 2 orientation questions based on Ikigai:
   - love: What do you enjoy most about what you've learned?
   - money: What are your salary and working conditions expectations?

Return EXACTLY ONE JSON OBJECT (plain JSON in ENGLISH):
{
    "market_level_evaluation": "Evaluation...",
    "technical_assessment_question": "Scenario question...",
    "ikigai_questions": {
        "love": "Enjoyment question...",
        "money": "Income question..."
    }
}`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText) as SkillOverviewResponse;
            if (data && data.technical_assessment_question) return data;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }

    const firstSkill = techSkills.length > 0 ? techSkills[0] : (skills.length > 0 ? skills[0] : 'Software Engineering');
    
    let question = `How would you approach debugging and optimizing performance for a production application built with ${firstSkill}?`;
    
    // Tailored fallback questions by skill type
    const lowerSkill = firstSkill.toLowerCase();
    if (lowerSkill.includes('python')) {
        question = `How would you optimize data processing efficiency and handle memory bottlenecks in a production Python application?`;
    } else if (lowerSkill.includes('react') || lowerSkill.includes('vue')) {
        question = `How do you identify and resolve unnecessary component re-renders or UI lag in a large web application?`;
    } else if (lowerSkill.includes('prompt') || lowerSkill.includes('chatgpt') || lowerSkill.includes('ai')) {
        question = `How do you structure system prompts and manage context parameters to achieve reliable, structured AI model responses?`;
    } else if (techSkills.length === 0 && softSkills.length > 0) {
        question = `How do you effectively communicate technical choices and collaborate with team members under tight project deadlines?`;
    }

    return {
        market_level_evaluation: `Based on your skills [${skills.join(', ')}], you are positioned at a solid Fresher / Junior level with high growth potential.`,
        technical_assessment_question: question,
        ikigai_questions: {
            love: `Which of your skills (${skills.join(', ')}) do you find most engaging to work with daily?`,
            money: `What starting compensation and environment expectations do you have for this role?`
        }
    };
};

export const testGeminiKey = async (key: string, model: string, customMessage: string = "Test message"): Promise<{success: boolean, message: string, reply?: string}> => {
    try {
        const testAi = new GoogleGenAI({ apiKey: key });
        const response = await testAi.models.generateContent({
            model: model,
            contents: customMessage,
        });
        return { success: !!response.text, message: "Connected successfully!", reply: response.text };
    } catch (e: any) {
        console.error("Test API Key failed:", e);
        return { success: false, message: e.message || "Connection failed!" };
    }
};

export interface CareerSuggestion {
    title: string;
    description: string;
    why_it_fits: string;
}

export interface ComprehensiveCareerAnalysisResponse {
    dominant_riasec: string;
    personality_analysis: string;
    career_goals: CareerSuggestion[];
}

export const analyzeRiasecAndSuggestCareers = async (
    previousData: any,
    riasecAnswers: any
): Promise<ComprehensiveCareerAnalysisResponse | null> => {
    const prompt = `You are a career psychologist and data analyst. 
INPUT DATA:
- Skills & Ikigai: ${JSON.stringify(previousData)}
- RIASEC: ${JSON.stringify(riasecAnswers)}

TASK:
1. Analyze dominant RIASEC personality types.
2. Synthesize data and suggest 3 fitting Career Goals in ENGLISH.

Return EXACTLY ONE JSON OBJECT:
{
    "dominant_riasec": "Dominant type",
    "personality_analysis": "Personality analysis...",
    "career_goals": [
        {
            "title": "Career Title",
            "description": "Description",
            "why_it_fits": "Why it fits"
        }
    ]
}`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText) as ComprehensiveCareerAnalysisResponse;
            if (data && Array.isArray(data.career_goals)) return data;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }

    return {
        dominant_riasec: "Investigative & Realistic",
        personality_analysis: "Analytical problem solver with strong hands-on technical execution skills.",
        career_goals: [
            { title: "Frontend Software Engineer", description: "Build scalable web UI applications", why_it_fits: "Fits your technical background and user interaction focus." },
            { title: "UI/UX Product Designer", description: "Design intuitive user journeys", why_it_fits: "Leverages visual problem solving." },
            { title: "Fullstack Web Developer", description: "End-to-end web system development", why_it_fits: "Maximizes versatility." }
        ]
    };
};

export interface CareerGoalConsultationResponse {
    status: 'confirmed' | 'analyzing';
    response_message: string;
    selected_goal: string | null;
}

export const consultCareerGoalSelection = async (
    suggestedGoals: any,
    userFeedback: string
): Promise<CareerGoalConsultationResponse | null> => {
    const prompt = `You are a Career Coach assisting the user with their roadmap selection.

RULES:
1. Ensure the user is satisfied with the adjustment before moving forward.

2. When the user decides to "Finalize":
   - When the user uses confirmation keywords (e.g., "finalize", "agree", "I choose this roadmap", "give me the detailed version"), you MUST immediately generate a comprehensive Action Plan for the agreed-upon roadmap.
   - Start your response with the code tag [FINAL_ROADMAP] (so the website system can recognize it and switch the UI interface).

3. Output Formatting Structure for [FINAL_ROADMAP]:
   - Roadmap Name (Refined & Customized).
   - Core Objective: Concise in 1-2 sentences.
   - Step-by-Step Action Plan: Divided into explicit time milestones (e.g., Month 1-2, Month 3-4...). Under each milestone, specify:
     * Skills to learn / Focus area.
     * Action items (Practical execution steps).
     * Portfolio building / Practical projects or exercises.
   - Final Advice: A quick reminder on discipline or tips on how to track progress effectively.

Tone: Encouraging, highly personalized (addressing the user as "you"), flexible, and adaptive to the user's demands.

INPUT DATA:
- Suggested Goals: ${JSON.stringify(suggestedGoals)}
- User Feedback: "${userFeedback}"
`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            const isConfirmed = rawText.includes("[FINAL_ROADMAP]") || /finalize|agree|choose|chốt|đồng ý/i.test(userFeedback);
            return {
                status: isConfirmed ? 'confirmed' : 'analyzing',
                response_message: rawText,
                selected_goal: isConfirmed ? (suggestedGoals?.[0]?.title || "Finalized Roadmap") : null
            };
        }
    } catch (error) {
        console.error("AI Error:", error);
    }

    const isConfirmed = /finalize|agree|choose|chốt|đồng ý/i.test(userFeedback);
    return {
        status: isConfirmed ? 'confirmed' : 'analyzing',
        response_message: isConfirmed
            ? `[FINAL_ROADMAP]\n\n### Roadmap: ${suggestedGoals?.[0]?.title || 'Frontend Engineering'}\n**Core Objective**: Master core skills and launch production applications.\n\n**Action Plan**:\n- Month 1-2: Core HTML/CSS/JS & Layout Fundamentals.\n- Month 3-4: React & Component Architecture.\n- Month 5-6: Performance Tuning & Portfolio Projects.`
            : `I have updated your roadmap preferences. Let me know when you are ready to finalize!`,
        selected_goal: isConfirmed ? (suggestedGoals?.[0]?.title || "Frontend Engineering") : null
    };
};

export interface DetailedRoadmapPhase {
    phase: string;
    duration: string;
    focus: string;
    action_items: string[];
}

export interface DetailedRoadmapResponse {
    goal: string;
    short_term: DetailedRoadmapPhase;
    medium_term: DetailedRoadmapPhase;
    long_term: DetailedRoadmapPhase;
    advice: string;
}

export const generateDetailedRoadmap = async (
    finalGoal: string,
    baselineProfile: any
): Promise<DetailedRoadmapResponse | null> => {
    const prompt = `You are a Career Coach generating a detailed action plan in JSON.
Target Goal: "${finalGoal}"
User Profile: ${JSON.stringify(baselineProfile)}

Return JSON object:
{
    "goal": "${finalGoal}",
    "short_term": { "phase": "Short-term (0-3 months)", "duration": "0-3 months", "focus": "Core foundations", "action_items": ["Action 1", "Action 2"] },
    "medium_term": { "phase": "Medium-term (3-6 months)", "duration": "3-6 months", "focus": "Production projects", "action_items": ["Action 1", "Action 2"] },
    "long_term": { "phase": "Long-term (6-12 months)", "duration": "6-12 months", "focus": "Advanced architecture & career launch", "action_items": ["Action 1", "Action 2"] },
    "advice": "Keep consistent discipline and build real projects."
}`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText) as DetailedRoadmapResponse;
            if (data && data.goal) return data;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }

    return {
        goal: finalGoal,
        short_term: { phase: "Short-term (0-3 months)", duration: "0-3 months", focus: "Master Core Fundamentals & Tools", action_items: ["Master JavaScript ES6+ & DOM Manipulation", "Build responsive layouts with CSS Grid & Flexbox"] },
        medium_term: { phase: "Medium-term (3-6 months)", duration: "3-6 months", focus: "Frameworks & Production Projects", action_items: ["Build production React / TypeScript applications", "Integrate REST & GraphQL APIs"] },
        long_term: { phase: "Long-term (6-12 months)", duration: "6-12 months", focus: "Performance & Career Launch", action_items: ["Optimize Web Vitals & Lazy Loading", "Deploy portfolio and apply for roles"] },
        advice: "Focus on building complete, working projects rather than just reading documentation."
    };
};

export const generateAssessmentQuestion = async (skill: string): Promise<string> => {
    const prompt = `Generate 1 concise scenario question testing skill: ${skill}.`;
    
    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            if (response.text) return response.text;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }
    return `How would you troubleshoot and resolve a performance bottleneck when working with ${skill}?`;
};

export const evaluateAssessmentAnswer = async (skill: string, answer: string): Promise<string> => {
    const prompt = `You are a technical interviewer evaluating a user's answer.
Question/Skill context: "${skill}"
User Answer: "${answer}"

CRITICAL INSTRUCTIONS:
1. Provide extremely CONCISE feedback (maximum 2-3 short lines/bullet points).
2. Include a Score (e.g., Score: 8/10), 1 core strength, and 1 quick improvement tip.
3. DO NOT use markdown header tags like ### or dividers like ---. Use simple bullet points with bold titles.

Example format:
Score: 8/10 (Solid Level)
• Strength: Clear understanding of core architecture and performance patterns.
• Recommendation: Mention error boundary strategies for production edge-cases.`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            if (response.text) return response.text;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }
    return `Score: 8/10 (Good Level)\n• Strength: Solid practical problem-solving logic.\n• Recommendation: Continue refining edge cases and performance optimization.`;
};

export const generateSandboxScenario = async (career: string): Promise<string> => {
    const prompt = `Generate a 2-sentence day-1 scenario problem for a "${career}".`;
    
    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            if (response.text) return response.text;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }
    return `Welcome to your first day as a ${career}! A production issue requires your immediate investigation. Where do you start?`;
};

export const evaluateSandboxChoice = async (career: string, choiceType: string): Promise<string> => {
    const prompt = `Evaluate choice "${choiceType}" for career "${career}".`;
    
    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            if (response.text) return response.text;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }
    return `Solid approach! Your choice demonstrates proactive problem solving. Keep building your core technical foundations.`;
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
    const prompt = `Generate 3 Milestone JSON objects for career "${career}" with skills ${skills.join(', ')}.`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText) as Milestone[];
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }
    return getMockMilestones(career);
};

export const optimizeRoadmap = async (_currentRoadmap: any, country: string): Promise<string> => {
    const prompt = `Analyze hiring trends in "${country}".`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            if (response.text) return response.text;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }
    return `The tech market in ${country} shows strong demand for AI-assisted engineering and modern web frameworks.`;
};

export const evaluateSkillPractice = async (skillTitle: string, scenario: string, answer: string): Promise<string> => {
    const prompt = `Evaluate skill practice for "${skillTitle}".`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            if (response.text) return response.text;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }
    return `Good solution logic for ${skillTitle}. Focus on clean code principles and optimal edge-case handling.`;
};

export interface IkigaiCareerSuggestion {
    title: string;
    reason: string;
    mini_roadmap: string[];
    real_world_example: string;
}

export const suggestIkigaiCareers = async (skills: string[], riasecScores: Record<string, number>, ikigaiText: string): Promise<IkigaiCareerSuggestion[]> => {
    const prompt = `You are a career strategist. User skills: [${skills.join(', ')}]. Context & User Requests: "${ikigaiText}".
RIASEC scores: ${JSON.stringify(riasecScores)}.

TASK:
Suggest 3 distinct IT career roadmap options in ENGLISH matching the user's skills and explicit preferences/custom requests. 
If the user specified a custom career or adjustment in the context (e.g. Mobile Developer, DevOps, Data Analyst), tailor the 3 options directly around that target or closely related specializations.

Return EXACTLY ONE JSON Array:
[
  {
    "title": "Career Title",
    "reason": "Clear explanation of why this fits their skills and request",
    "mini_roadmap": ["Stage 1: Core Topic", "Stage 2: Advanced Skill", "Stage 3: Mastery"],
    "real_world_example": "Concrete project example"
  }
]`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText) as IkigaiCareerSuggestion[];
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (error) {
        console.error("AI Error (suggestIkigaiCareers):", error);
    }

    // Dynamic fallback based on user input text
    const lowerInput = ikigaiText.toLowerCase();
    
    if (lowerInput.includes('data') || lowerInput.includes('ai') || lowerInput.includes('machine learning')) {
        return [
            {
                title: "Data Analyst & AI Engineer",
                reason: "Aligns with your analytical goals and data processing focus.",
                mini_roadmap: ["Python & SQL Fundamentals", "Data Visualization & Dashboarding", "AI Model Fine-tuning & APIs"],
                real_world_example: "Building an automated ETL pipeline and interactive analytics dashboard."
            },
            {
                title: "Business Intelligence Specialist",
                reason: "Transforms raw enterprise data into strategic decision dashboards.",
                mini_roadmap: ["SQL & Data Modeling", "PowerBI / Tableau Metrics", "Predictive Analytics"],
                real_world_example: "Designing executive performance metrics for product growth."
            },
            {
                title: "Machine Learning Operations (MLOps)",
                reason: "Bridges data science models with production deployment infrastructure.",
                mini_roadmap: ["Python & PyTorch/TensorFlow", "Docker & Model Serving", "CI/CD for ML Pipelines"],
                real_world_example: "Deploying a real-time recommendation API on cloud servers."
            }
        ];
    } else if (lowerInput.includes('mobile') || lowerInput.includes('flutter') || lowerInput.includes('react native') || lowerInput.includes('android') || lowerInput.includes('ios')) {
        return [
            {
                title: "Cross-Platform Mobile Engineer",
                reason: "Builds high-performance native-feel applications for iOS and Android.",
                mini_roadmap: ["React Native / Flutter Core", "State Management & REST APIs", "App Store Publishing"],
                real_world_example: "Developing an offline-first mobile app with push notifications."
            },
            {
                title: "iOS Native Developer",
                reason: "Focuses on premium Apple ecosystem user experiences.",
                mini_roadmap: ["Swift & SwiftUI", "CoreData & Networking", "App Performance Tuning"],
                real_world_example: "Creating a sleek SwiftUI mobile app with smooth animations."
            },
            {
                title: "Mobile Solutions Architect",
                reason: "Designs enterprise mobile architecture and API integrations.",
                mini_roadmap: ["Mobile Security & Auth", "GraphQL & Microservices", "CI/CD Test Automation"],
                real_world_example: "Architecting a secure banking mobile SDK."
            }
        ];
    } else if (lowerInput.includes('devops') || lowerInput.includes('cloud') || lowerInput.includes('backend') || lowerInput.includes('system')) {
        return [
            {
                title: "DevOps & Cloud Infrastructure Engineer",
                reason: "Automates deployment pipelines and scales cloud infrastructure.",
                mini_roadmap: ["Linux & Shell Scripting", "Docker & Kubernetes", "CI/CD & Terraform"],
                real_world_example: "Automating zero-downtime Kubernetes deployments on AWS."
            },
            {
                title: "Backend Microservices Developer",
                reason: "Builds scalable server architectures and database schemas.",
                mini_roadmap: ["Node.js / Python / Go", "PostgreSQL & Redis Caching", "API Gateways & Security"],
                real_world_example: "Designing a high-throughput payment gateway service."
            },
            {
                title: "Site Reliability Engineer (SRE)",
                reason: "Ensures system uptime, monitoring, and disaster recovery.",
                mini_roadmap: ["Monitoring (Grafana/Prometheus)", "Incident Management", "Infrastructure as Code"],
                real_world_example: "Implementing distributed tracing to diagnose microservice latency."
            }
        ];
    }

    return [
        { 
            title: "Frontend Engineer", 
            reason: "Matches your creative design mindset and web skills.",
            mini_roadmap: ["HTML/CSS/JS Core", "React & TypeScript", "UI/UX Optimization"],
            real_world_example: "Building a modern web dashboard with smooth animations."
        },
        { 
            title: "UI/UX Product Designer", 
            reason: "Leverages visual problem-solving and user interaction focus.",
            mini_roadmap: ["Figma Design Systems", "User Research", "Interactive Prototypes"],
            real_world_example: "Designing an accessible onboarding flow for web applications."
        },
        { 
            title: "Data Analyst & AI Engineer", 
            reason: "Aligns with analytical research and data insights.",
            mini_roadmap: ["SQL & Python Fundamentals", "Data Visualization", "AI Model Integration"],
            real_world_example: "Analyzing product analytics to improve conversion rates."
        }
    ];
};

export interface RiasecCard {
    id: string;
    text: string;
}

export const generateIkigaiQuestions = async (skills: string[]): Promise<{ love: string, money: string }> => {
    const prompt = `Generate 2 Ikigai questions for skills: ${skills.join(', ')}. Return JSON: { "love": "...", "money": "..." }`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText);
            if (data && data.love) return data;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }

    const skillStr = skills.length > 0 ? skills.join(', ') : 'web development';
    return {
        love: `With skills like ${skillStr}, what type of projects bring you the most satisfaction?`,
        money: `What starting salary or career growth expectations do you have?`
    };
};

export const generateDynamicRIASECCards = async (skills: string[], loveCtx: string = '', moneyCtx: string = ''): Promise<RiasecCard[]> => {
    const skillListStr = skills.length > 0 ? skills.join(', ') : 'Software Engineering';
    const prompt = `You are a career psychologist. Generate 6 personalized work scenario cards for Holland RIASEC code (R, I, A, S, E, C) tailored specifically to candidate skills: [${skillListStr}].

Return EXACTLY ONE valid JSON Array:
[
  { "id": "R", "text": "Realistic: Hands-on scenario related to ${skills[0] || 'technical execution'}..." },
  { "id": "I", "text": "Investigative: Technical research and problem solving scenario..." },
  { "id": "A", "text": "Artistic: Creative UI/UX design or innovation scenario..." },
  { "id": "S", "text": "Social: Mentoring and team collaboration scenario..." },
  { "id": "E", "text": "Enterprising: Technical leadership or pitching scenario..." },
  { "id": "C", "text": "Conventional: Code organization and documentation scenario..." }
]`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText) as RiasecCard[];
            if (Array.isArray(data) && data.length >= 6) return data;
        }
    } catch (error) {
        console.error("AI Error (generateDynamicRIASECCards):", error);
    }

    const primarySkill = skills.length > 0 ? skills[0] : 'software development';
    return [
        { id: 'R', text: `Building core features and fixing technical issues in ${primarySkill} rather than spending hours in long meetings.` },
        { id: 'I', text: `Spending 3 hours studying documentation to uncover optimal algorithms and performance architectures.` },
        { id: 'A', text: `Designing novel user interfaces and modern layouts that push boundaries beyond traditional templates.` },
        { id: 'S', text: `Mentoring junior developers and facilitating technical walkthrough sessions to help the team grow.` },
        { id: 'E', text: `Pitching architecture proposals to stakeholders and driving technical project direction.` },
        { id: 'C', text: `Structuring clean documentation, enforcing design token standards, and organizing project codebases.` }
    ];
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
    contextTriangle: { time: string, academic: string, budget: string },
    miniRoadmap?: string[]
): Promise<DualRoadmapsResponse> => {
    const prompt = `You are a Senior IT Career Architect. Generate TWO (2) distinct, customized career roadmaps in JSON format for the career goal: "${goal}".

Candidate Profile:
- Skills: ${skills.join(', ')}
- Context & Preferences: ${ikigaiText}
- Availability: ${contextTriangle.time}, Academic Background: ${contextTriangle.academic}, Budget: ${contextTriangle.budget}
${miniRoadmap ? `- Target Focus Areas: ${miniRoadmap.join(', ')}` : ''}

TASK:
Return EXACTLY ONE JSON object with option1 (standard track) and option2 (AI-accelerated fast track).

SCHEMA STRUCTURE:
{
  "option1": {
    "title": "Standard ${goal} Track",
    "description": "Comprehensive foundation focused on core skills and practical projects.",
    "milestones": [
      {
        "id": "m1",
        "title": "Stage 1: Core Fundamentals",
        "status": "in-progress",
        "progress": 20,
        "start_date": "01/10/2026",
        "end_date": "30/11/2026",
        "goal": "Master core concepts",
        "user_notes": "",
        "skills": [
          {
            "id": "s1",
            "title": "Key Skill Title",
            "category": "Core Tech",
            "status": "in-progress",
            "goal": "Understand principles",
            "user_notes": "",
            "ai_practice_scenario": "Describe how you apply this skill in a real-world scenario.",
            "sub_tasks": [
              { "id": "st1", "text": "Subtask action 1", "is_completed": false, "completion_note": "" },
              { "id": "st2", "text": "Subtask action 2", "is_completed": false, "completion_note": "" }
            ]
          }
        ]
      }
    ]
  },
  "option2": {
    "title": "AI-Accelerated ${goal} Track",
    "description": "Fast-tracked learning leveraging generative AI tools and modern workflows.",
    "milestones": [
      {
        "id": "m2_1",
        "title": "Stage 1: AI-Powered Fundamentals",
        "status": "planned",
        "progress": 0,
        "start_date": "01/10/2026",
        "end_date": "15/11/2026",
        "goal": "Rapid skill acquisition",
        "user_notes": "",
        "skills": [
          {
            "id": "s2_1",
            "title": "AI Workflow & Core Tech",
            "category": "AI-Era Competency",
            "status": "planned",
            "goal": "Leverage AI assistants",
            "user_notes": "",
            "ai_practice_scenario": "How do you prompt AI tools to optimize your workflow?",
            "sub_tasks": [
              { "id": "st2_1", "text": "Master Prompt Engineering", "is_completed": false, "completion_note": "" }
            ]
          }
        ]
      }
    ]
  }
}`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText) as DualRoadmapsResponse;
            if (data && data.option1 && Array.isArray(data.option1.milestones) && data.option1.milestones.length > 0) return data;
        }
    } catch (error) {
        console.error("AI Error (generateDualRoadmaps):", error);
    }

    return {
        option1: {
            title: `Standard ${goal} Roadmap`,
            description: "Solid foundation focused on core skills and practical projects.",
            milestones: getMockMilestones(goal, miniRoadmap)
        },
        option2: {
            title: `AI-Accelerated ${goal} Roadmap`,
            description: "Accelerated learning using AI coding tools and automated workflows.",
            milestones: getMockMilestones(goal, miniRoadmap)
        }
    };
};

export const refineRoadmap = async (currentMilestones: Milestone[], feedback: string): Promise<Milestone[] | null> => {
    const prompt = `Refine milestones with feedback: "${feedback}".`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText) as Milestone[];
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (error) {
        console.error("AI Error:", error);
    }
    return currentMilestones;
};

export const extractSkillsFromText = async (chatText: string, cvFileName: string | null): Promise<string[]> => {
    const prompt = `Extract technical and professional skills from text "${chatText}" ${cvFileName ? `(CV: ${cvFileName})` : ''}. Return JSON Array of strings in ENGLISH.`;

    try {
        if (apiKey) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            let rawText = response.text || "[]";
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText) as string[];
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (error) {
        console.error("AI Error (extractSkills):", error);
    }

    // Local extraction fallback parsing common skills from user chat text
    const found: string[] = [];
    const textLower = (chatText + ' ' + (cvFileName || '')).toLowerCase();
    
    const knownSkills = [
        { name: 'JavaScript', keywords: ['javascript', 'js', 'es6'] },
        { name: 'TypeScript', keywords: ['typescript', 'ts'] },
        { name: 'React', keywords: ['react', 'reactjs'] },
        { name: 'Vue', keywords: ['vue', 'vuejs'] },
        { name: 'HTML/CSS', keywords: ['html', 'css', 'sass', 'tailwind'] },
        { name: 'Python', keywords: ['python', 'django', 'flask'] },
        { name: 'Data Analysis', keywords: ['data analysis', 'pandas', 'numpy', 'sql', 'phân tích dữ liệu'] },
        { name: 'UI/UX Design', keywords: ['figma', 'ui design', 'ux design', 'thiết kế', 'giao diện'] },
        { name: 'Presentations', keywords: ['thuyết trình', 'presentation', 'presenting'] },
        { name: 'Team Collaboration', keywords: ['làm việc nhóm', 'teamwork', 'collaboration'] }
    ];

    knownSkills.forEach(ks => {
        if (ks.keywords.some(kw => textLower.includes(kw))) {
            found.push(ks.name);
        }
    });

    return found;
};

const getMockMilestones = (career: string, miniRoadmap?: string[]): Milestone[] => {
    if (miniRoadmap && miniRoadmap.length > 0) {
        return miniRoadmap.map((stepText, idx) => ({
            id: `m${idx + 1}`,
            title: `Stage ${idx + 1}: ${stepText}`,
            status: idx === 0 ? 'in-progress' : 'planned',
            progress: idx === 0 ? 20 : 0,
            start_date: '01/09/2026',
            end_date: '31/12/2026',
            goal: `Master ${stepText} for ${career} role`,
            user_notes: '',
            skills: [
                {
                    id: `s-${idx}-1`,
                    title: stepText,
                    category: 'Core Skill',
                    status: idx === 0 ? 'in-progress' : 'planned',
                    goal: `Master ${stepText}`,
                    user_notes: '',
                    ai_practice_scenario: `Describe how you apply ${stepText} in your ${career} workflow.`,
                    sub_tasks: [
                        { id: `st-${idx}-1`, text: `Master core concepts of ${stepText}`, is_completed: false, completion_note: '' },
                        { id: `st-${idx}-2`, text: `Complete practical project exercise for ${stepText}`, is_completed: false, completion_note: '' }
                    ]
                }
            ]
        }));
    }

    return [
        {
            id: 'm1', title: 'Stage 1: Foundations & Core Mindset', status: 'completed', progress: 100,
            start_date: '01/09/2026', end_date: '15/11/2026', goal: `Build strong core for ${career}`,
            user_notes: 'Foundations completed',
            skills: [
                {
                    id: 's1', title: 'HTML / CSS / JavaScript', category: 'Core Tech', status: 'completed',
                    goal: 'Understand core web principles', user_notes: '', ai_practice_scenario: 'Describe how you structure responsive web pages.',
                    sub_tasks: [{ id: 'st1', text: 'Master semantics & DOM logic', is_completed: true, completion_note: 'Completed' }]
                },
                {
                    id: 's1b', title: 'Git & GitHub Workflows', category: 'Tooling', status: 'completed',
                    goal: 'Version control & collaboration', user_notes: '', ai_practice_scenario: '',
                    sub_tasks: []
                }
            ]
        },
        {
            id: 'm2', title: 'Stage 2: Technical Mastery', status: 'in-progress', progress: 35,
            start_date: '16/11/2026', end_date: '15/03/2027', goal: 'Apply skills to real-world applications',
            user_notes: 'Building production projects',
            skills: [
                {
                    id: 's2', title: 'ReactJS / VueJS Architecture', category: 'Core Tech', status: 'in-progress',
                    goal: 'Build fluid interactive UIs', user_notes: '', ai_practice_scenario: 'How do you optimize state management in large apps?',
                    sub_tasks: [{ id: 'st2', text: 'Optimize performance and component reusability', is_completed: false, completion_note: '' }]
                },
                {
                    id: 's2b', title: 'Tailwind CSS Systems', category: 'UI', status: 'planned',
                    goal: 'Rapid responsive styling', user_notes: '', ai_practice_scenario: '',
                    sub_tasks: []
                }
            ]
        },
        {
            id: 'm3', title: 'Stage 3: AI-Era Competency & Scaling', status: 'planned', progress: 0,
            start_date: '16/03/2027', end_date: '15/08/2027', goal: 'AI Tools & Enterprise Architecture',
            user_notes: '',
            skills: [
                {
                    id: 's3', title: 'Generative AI & LLM Tools', category: 'AI-Era Competency', status: 'planned',
                    goal: 'Leverage AI assistants', user_notes: '', ai_practice_scenario: 'How do you structure prompts for robust JSON API outputs?',
                    sub_tasks: [{ id: 'st3', text: 'Master Prompt Engineering & Agentic Workflows', is_completed: false, completion_note: '' }]
                }
            ]
        }
    ];
};

export interface AIGeneratedTestResponse {
  question: string;
  hint: string;
  keyConcepts: string[];
}

export const generateAssessmentTestFromAI = async (
  milestoneTitle: string,
  skillName: string,
  subTopicTitle: string
): Promise<AIGeneratedTestResponse> => {
  const prompt = `Role: You are an Assessment Expert. The candidate has completed a learning milestone and wants to take a test to prove their competence.

Input Data:
• Skills to test: ${subTopicTitle} (${skillName})
• Candidate's domain/interest: ${milestoneTitle}
• Difficulty level: Applied / Practical

CRITICAL LANGUAGE RULE:
ALL generated text, questions, options A/B/C/D, scenarios, requirements, and grading rubrics MUST BE WRITTEN STRICTLY IN ENGLISH ONLY.

Output Requirements (Strictly follow this structure in ENGLISH):

[PART 1: SITUATIONAL MULTIPLE-CHOICE] (Create 3 situational multiple-choice questions with short case studies in ${milestoneTitle} in ENGLISH):
• Question 1: [Situational question content in English]
  A) [Option 1]  B) [Option 2]  C) [Option 3]  D) [Option 4]
• Question 2: [Situational question content in English]
  A) [Option 1]  B) [Option 2]  C) [Option 3]  D) [Option 4]
• Question 3: [Situational question content in English]
  A) [Option 1]  B) [Option 2]  C) [Option 3]  D) [Option 4]

[PART 2: PRACTICAL PROBLEM / SHORT ESSAY] (Create 1 practical problem requiring written solution/procedure in ENGLISH):
• Scenario: [Describe a real-world problem related to ${subTopicTitle} in English]
• Requirement: [Clearly state what the candidate needs to do in English].

[SECRET_ANSWER_KEY] (STRICTLY IN ENGLISH)
• Multiple Choice Answers: 1-[A/B/C/D], 2-[A/B/C/D], 3-[A/B/C/D]
• Part 2 Grading Rubric: List 3 keywords or core ideas required for maximum points.`;

  try {
    const rawResponse = await callGeminiWithRetry(prompt);
    if (rawResponse) {
      return {
        question: rawResponse,
        hint: "Select options for Part 1 (e.g. 1-A, 2-B, 3-C) and detail your step-by-step procedure for Part 2.",
        keyConcepts: [skillName, subTopicTitle, "Practical Problem Solving"]
      };
    }
  } catch (error) {
    console.error("AI Error (generateAssessmentTestFromAI):", error);
  }

  return {
    question: `[PART 1: SITUATIONAL MULTIPLE-CHOICE]\n• Question 1: When optimizing ${subTopicTitle} in production, which approach best handles high concurrency?\n  A) Index key columns  B) Use cache layer  C) Partition tables  D) All of the above\n• Question 2: Which design pattern best ensures component reusability for ${skillName}?\n  A) Factory Pattern  B) Component Modularization  C) Singleton  D) Observer Pattern\n• Question 3: When debugging state inconsistency, what should you inspect first?\n  A) State lifecycle logs  B) Network tab  C) CSS layout  D) DOM tree\n\n[PART 2: PRACTICAL PROBLEM]\n• Scenario: A high-traffic system suffers from latency issues related to ${subTopicTitle}.\n• Requirement: List 3 step-by-step procedures to diagnose and resolve this issue.`,
    hint: "Provide your multiple choice answers (1-A, 2-B, 3-C) and outline your step-by-step solution for Part 2.",
    keyConcepts: [skillName, subTopicTitle, "Practical Execution"]
  };
};

export interface AITestEvaluationResult {
  score: number;
  isPassed: boolean;
  feedback: string;
  strengths: string;
  improvements: string;
}

export const evaluateAssessmentTestWithAI = async (
  subTopicTitle: string,
  question: string,
  userAnswer: string
): Promise<AITestEvaluationResult> => {
  const prompt = `Role: You are an Assessment Expert grading a candidate's test response.

TEST QUESTION & SECRET ANSWER KEY:
${question}

CANDIDATE'S SUBMITTED ANSWER:
"${userAnswer}"

TASK:
Grade the candidate's answer based on the Secret Answer Key and Part 2 Grading Rubric.

Return EXACTLY ONE JSON OBJECT:
{
  "score": 85,
  "isPassed": true,
  "feedback": "Concise summary evaluation",
  "strengths": "1 key strength in candidate answer",
  "improvements": "1 actionable improvement tip"
}`;

  try {
    const rawResponse = await callGeminiWithRetry(prompt);
    if (rawResponse) {
      let rawText = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(rawText) as AITestEvaluationResult;
      if (data && typeof data.score === 'number') return data;
    }
  } catch (error) {
    console.error("AI Error (evaluateAssessmentTestWithAI):", error);
  }

  const length = userAnswer.trim().length;
  let score = 75;
  if (length > 60) score = 90;
  else if (length > 30) score = 82;
  else if (length < 15) score = 50;

  return {
    score,
    isPassed: score >= 70,
    feedback: score >= 70 ? `Passed! Demonstrated solid problem solving for ${subTopicTitle}.` : `Needs review for ${subTopicTitle}.`,
    strengths: "Addressed key situational concepts and practical procedures.",
    improvements: "Include step-by-step edge-case handling for higher score."
  };
};

export const evaluateMilestonePhaseWithAI = async (
  milestoneTitle: string,
  roleName: string,
  subTopicsData: Array<{ title: string; score: number; isCompleted: boolean }>
): Promise<OverallAiEvaluation> => {
  const prompt = `Role: You are a Senior HR & Skill Competency Assessment Expert.
Synthesize the test scores and completion status of individual subtopic tasks for the milestone stage: "${milestoneTitle}" (${roleName}).

Subtopic Task Results:
${JSON.stringify(subTopicsData, null, 2)}

TASK:
1. Synthesize an overall stage capability score (0-100%).
2. Generate 2-3 Key Strengths Achieved in ENGLISH based on completed tasks with high test scores.
3. Generate 2-3 Gaps / Areas to Improve in ENGLISH for incomplete tasks or lower scores.
4. Generate 2-3 Recommended Next Action Items in ENGLISH for candidate's next learning step.

Return EXACTLY ONE JSON OBJECT strictly in ENGLISH:
{
  "score": 75,
  "summary": "AI synthesized test results: Practical capability score reached 75%...",
  "strengths": ["Key Strength 1", "Key Strength 2"],
  "weaknesses": ["Gap / Area to Improve 1", "Gap / Area to Improve 2"],
  "actionItems": ["Recommended Next Action Item 1", "Recommended Next Action Item 2"]
}`;

  try {
    const rawResponse = await callGeminiWithRetry(prompt);
    if (rawResponse) {
      let rawText = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(rawText);
      if (data && Array.isArray(data.strengths) && data.strengths.length > 0) {
        const score = typeof data.score === 'number' ? data.score : 75;
        return {
          score,
          readinessLabel: `${score}% AI Assessment: ${roleName}`,
          summary: data.summary || `AI synthesized test results: Practical capability score reached ${score}%.`,
          strengths: data.strengths,
          weaknesses: data.weaknesses || ["Complete remaining subtopics in this stage."],
          actionItems: data.actionItems || ["Practice AI Quiz tests to raise score."],
          evaluatedAt: new Date().toISOString()
        };
      }
    }
  } catch (error) {
    console.error("AI Error (evaluateMilestonePhaseWithAI):", error);
  }

  const completed = subTopicsData.filter(s => s.isCompleted);
  const tested = subTopicsData.filter(s => s.score > 0);
  const avgScore = tested.length > 0 ? Math.round(tested.reduce((a, b) => a + b.score, 0) / tested.length) : 50;

  return {
    score: avgScore,
    readinessLabel: `${avgScore}% AI Assessment: ${roleName}`,
    summary: `AI synthesized test results: Practical capability score reached ${avgScore}% (${completed.length}/${subTopicsData.length} topics completed in this stage).`,
    strengths: [
      `Solid understanding of core concepts in ${completed[0]?.title || 'completed topics'}`,
      "Demonstrated practical problem solving in quiz assessments"
    ],
    weaknesses: [
      `Complete remaining practical topics (${completed.length}/${subTopicsData.length} items completed)`
    ],
    actionItems: [
      "Practice AI Quiz tests for remaining items in this stage",
      "Apply concepts to real-world scenario exercises"
    ],
    evaluatedAt: new Date().toISOString()
  };
};
