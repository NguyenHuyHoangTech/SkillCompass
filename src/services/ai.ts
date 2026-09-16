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
            const modelNameStr = m.name?.replace(/^models\//, '') || '';
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

export interface SkillOverviewResponse {
    market_level_evaluation: string;
    technical_assessment_question: string;
    ikigai_questions: {
        love: string;
        money: string;
    }
}

export const analyzeUserSkillsOverview = async (skills: string[]): Promise<SkillOverviewResponse> => {
    const prompt = `Bạn là một chuyên gia hướng nghiệp và chuyên gia kỹ thuật. Người dùng vừa cung cấp danh sách kỹ năng của họ. 
DỮ LIỆU ĐẦU VÀO:
- Kỹ năng người dùng: [${skills.join(', ')}]
NHIỆM VỤ:
1. Đánh giá sơ bộ mức độ hiện tại của bộ kỹ năng này trên thị trường (Ví dụ: Fresher, Junior, Mid, Senior...).
2. Tạo ra 1 câu hỏi test kỹ năng thực chiến (dạng tình huống) dựa trên bộ kỹ năng họ vừa nhập. Đừng giải đáp, chỉ hỏi.
3. Đưa ra 2 câu hỏi định hướng theo triết lý Ikigai:
   - love: Sở thích (Bạn thích gì nhất trong những thứ đã học?)
   - money: Thu nhập (Bạn kỳ vọng được trả lương/làm việc như thế nào?)

TRẢ VỀ ĐÚNG MỘT JSON OBJECT theo cấu trúc (không dùng code block markdown, chỉ JSON thuần tuý):
{
    "market_level_evaluation": "Đánh giá của bạn...",
    "technical_assessment_question": "Câu hỏi thực chiến...",
    "ikigai_questions": {
        "love": "Câu hỏi sở thích...",
        "money": "Câu hỏi thu nhập..."
    }
}`;

    try {
        const response = await _ai.models.generateContent({
            model: _modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as SkillOverviewResponse;
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            market_level_evaluation: "⚠️ AI đang quá tải (Quota). Dựa trên kỹ năng, bạn đang ở mức Fresher/Junior đầy tiềm năng.",
            technical_assessment_question: `Bạn sẽ áp dụng ${skills.join(', ')} vào một dự án thực tế như thế nào?`,
            ikigai_questions: {
                love: "Bạn thích nhất kỹ năng nào trong số các kỹ năng trên?",
                money: "Bạn kỳ vọng mức lương bao nhiêu cho vị trí này?"
            }
        };
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
    const prompt = `Bạn là một chuyên gia tâm lý hướng nghiệp và phân tích dữ liệu nghề nghiệp. 

DỮ LIỆU ĐẦU VÀO:
- Kỹ năng ban đầu & Kết quả trả lời bài test kỹ năng/Ikigai của người dùng: ${JSON.stringify(previousData)}
- Câu trả lời bài test RIASEC của người dùng (Sở thích học tập/làm việc): ${JSON.stringify(riasecAnswers)}

NHIỆM VỤ:
1. Phân tích nhóm tính cách RIASEC nổi trội nhất của người dùng (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).
2. Tổng hợp toàn bộ dữ liệu (Kỹ năng + Ikigai + RIASEC).
3. Đề xuất 3 mục tiêu nghề nghiệp (Career Goals) phù hợp nhất tổng hòa được cả 3 yếu tố trên.

YÊU CẦU OUTPUT:
Trả về ĐÚNG MỘT JSON OBJECT theo cấu trúc (không dùng code block markdown, chỉ JSON thuần tuý):
{
    "dominant_riasec": "Tên nhóm tính cách nổi trội nhất...",
    "personality_analysis": "Nhận xét tổng quan về tính cách và tiềm năng...",
    "career_goals": [
        {
            "title": "Tên nghề nghiệp 1",
            "description": "Mô tả ngắn gọn",
            "why_it_fits": "Lý do phù hợp dựa trên 3 yếu tố trên"
        }
    ]
}`;

    try {
        const response = await _ai.models.generateContent({
            model: _modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as ComprehensiveCareerAnalysisResponse;
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return null;
    }
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
    const prompt = `Bạn là một Career Coach đồng hành cùng người dùng để chốt lộ trình sự nghiệp.

DỮ LIỆU ĐẦU VÀO:
- 3 mục tiêu đã đề xuất ở bước trước: ${JSON.stringify(suggestedGoals)}
- Lựa chọn hoặc câu hỏi thắc mắc của người dùng hiện tại: "${userFeedback}"

NHIỆM VỤ:
- Nếu người dùng chọn 1 mục tiêu cụ thể: Xác nhận mục tiêu đó và chuyển sang giai đoạn chốt.
- Nếu người dùng còn phân vân hoặc đặt câu hỏi: Phân tích ưu/nhược điểm của từng hướng đi dựa trên dữ liệu kỹ năng và Ikigai của họ, giúp họ đưa ra quyết định cuối cùng.

YÊU CẦU OUTPUT:
Trả về ĐÚNG MỘT JSON OBJECT theo cấu trúc (không dùng code block markdown, chỉ JSON thuần tuý):
{
    "status": "confirmed" hoặc "analyzing",
    "response_message": "Câu trả lời gửi đến người dùng (Xác nhận mục tiêu hoặc phân tích ưu nhược điểm...)",
    "selected_goal": "Tên mục tiêu đã chốt (nếu status là confirmed, ngược lại để null)"
}`;

    try {
        const response = await _ai.models.generateContent({
            model: _modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as CareerGoalConsultationResponse;
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return null;
    }
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
    const prompt = `Bạn là một Kiến trúc sư phát triển năng lực cá nhân (L&D Expert). Mục tiêu cuối cùng của người dùng đã được chốt.

DỮ LIỆU ĐẦU VÀO:
- Mục tiêu cuối cùng đã chọn: "${finalGoal}"
- Xuất phát điểm hiện tại của người dùng (Kỹ năng, Ikigai, RIASEC): ${JSON.stringify(baselineProfile)}

NHIỆM VỤ:
Xây dựng một lộ trình (Roadmap) hành động chi tiết từ vạch xuất phát hiện tại đến khi đạt được mục tiêu cuối cùng. 
Roadmap cần bao gồm:
1. Giai đoạn ngắn hạn (0 - 3 tháng): Cần bù đắp lỗ hổng kỹ năng gì ngay lập tức?
2. Giai đoạn trung hạn (3 - 6 tháng): Dự án thực tế cần làm, chứng chỉ hoặc kiến thức nâng cao cần học.
3. Giai đoạn dài hạn (6 - 12+ tháng): Cách định vị bản thân để đạt mục tiêu cuối.
Trình bày theo các bước rõ ràng, dễ thực thi.

YÊU CẦU OUTPUT:
Trả về ĐÚNG MỘT JSON OBJECT theo cấu trúc (không dùng code block markdown, chỉ JSON thuần tuý):
{
    "goal": "Tên mục tiêu...",
    "short_term": {
        "phase": "Ngắn hạn (0 - 3 tháng)",
        "duration": "0-3 tháng",
        "focus": "Mục tiêu trọng tâm...",
        "action_items": ["Hành động 1...", "Hành động 2..."]
    },
    "medium_term": {
        "phase": "Trung hạn (3 - 6 tháng)",
        "duration": "3-6 tháng",
        "focus": "Mục tiêu trọng tâm...",
        "action_items": ["Hành động 1...", "Hành động 2..."]
    },
    "long_term": {
        "phase": "Dài hạn (6 - 12+ tháng)",
        "duration": "6-12+ tháng",
        "focus": "Mục tiêu trọng tâm...",
        "action_items": ["Hành động 1...", "Hành động 2..."]
    },
    "advice": "Lời khuyên tổng kết..."
}`;

    try {
        const response = await _ai.models.generateContent({
            model: _modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as DetailedRoadmapResponse;
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return null;
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

export interface ChatGeneratedSkill {
    title: string;
    description: string;
    icon: string;
    subTopics: { title: string }[];
}

export interface ChatGenerateSkillsResponse {
    chat_response: string;
    proposed_skills: ChatGeneratedSkill[];
}

export const generateAndChatSkills = async (
    milestoneTitle: string,
    unlearnedSkillsContext: any[],
    userMessage: string,
    chatHistory: { sender: string; text: string }[]
): Promise<ChatGenerateSkillsResponse | null> => {
    const prompt = `Bạn là một Chuyên gia Đào tạo (L&D Expert).
Bối cảnh: Người dùng đang ở giai đoạn (milestone) "${milestoneTitle}" và có một số kỹ năng chưa học (hoặc cần được bổ sung).
Dữ liệu các kỹ năng chưa học (hoặc cần thay thế) hiện tại: ${JSON.stringify(unlearnedSkillsContext)}
Lịch sử chat gần đây: ${JSON.stringify(chatHistory)}
Tin nhắn hiện tại của người dùng: "${userMessage}"

NHIỆM VỤ:
1. Trả lời người dùng dưới vai trò một chuyên gia đào tạo, tư vấn về những kỹ năng họ nên bổ sung hoặc thay thế trong giai đoạn này.
2. Dựa trên lịch sử trò chuyện và yêu cầu hiện tại, đề xuất một danh sách các kỹ năng mới. Hãy đảm bảo mỗi kỹ năng đều có ít nhất 3 mục nhỏ (subTopics). Dùng icon FontAwesome phù hợp (VD: fa-server, fa-code).

TRẢ VỀ ĐÚNG MỘT JSON OBJECT theo cấu trúc:
{
    "chat_response": "Câu trả lời gửi cho người dùng...",
    "proposed_skills": [
        {
            "title": "Tên kỹ năng",
            "description": "Mô tả ngắn gọn",
            "icon": "fa-star",
            "subTopics": [
                { "title": "Mục nhỏ 1" },
                { "title": "Mục nhỏ 2" }
            ]
        }
    ]
}`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\{.*\}/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(rawText) as ChatGenerateSkillsResponse;
    } catch (error) {
        console.error("AI Error:", error);
        
        // Mock fallback response
        let mockResponse = "Tôi đã cập nhật danh sách kỹ năng dựa trên yêu cầu của bạn!";
        if (!userMessage) {
            mockResponse = "Chào bạn! Dựa vào giai đoạn hiện tại, tôi đề xuất một vài kỹ năng quan trọng dưới đây. Bạn có muốn điều chỉnh hay thêm bớt gì không?";
        } else if (userMessage.toLowerCase().includes("thêm")) {
            mockResponse = "Đồng ý, tôi đã bổ sung thêm kỹ năng theo ý bạn.";
        } else if (userMessage.toLowerCase().includes("xóa") || userMessage.toLowerCase().includes("bỏ")) {
            mockResponse = "Tôi đã loại bỏ kỹ năng không cần thiết theo yêu cầu.";
        }

        return {
            chat_response: mockResponse,
            proposed_skills: [
                {
                    title: "Advanced System Architecture",
                    description: "Design highly scalable, fault-tolerant systems using modern architectural patterns.",
                    icon: "fa-server",
                    subTopics: [
                        { title: "Core Concepts of Advanced System Architecture" },
                        { title: "Advanced Patterns & Best Practices" },
                        { title: "Real-world Implementation Project" },
                        { title: "Debugging and Troubleshooting" }
                    ]
                },
                {
                    title: "Performance Optimization",
                    description: "Identify bottlenecks and optimize frontend/backend performance at scale.",
                    icon: "fa-bolt",
                    subTopics: [
                        { title: "Core Concepts of Performance Optimization" },
                        { title: "Advanced Patterns & Best Practices" },
                        { title: "Real-world Implementation Project" }
                    ]
                }
            ]
        };
    }
};

export interface ChatGeneratedMilestone {
    title: string;
    description: string;
    categoriesCount: number;
}

export interface ChatGenerateRoadmapResponse {
    chat_response: string;
    proposed_milestones: ChatGeneratedMilestone[];
}

export const generateAndChatRoadmap = async (
    targetRole: string,
    currentMilestones: any[],
    userMessage: string,
    chatHistory: { sender: string; text: string }[]
): Promise<ChatGenerateRoadmapResponse | null> => {
    const prompt = `Bạn là một Chuyên gia Cố vấn Nghề nghiệp (Career Advisor).
Bối cảnh: Người dùng đang hướng tới mục tiêu "${targetRole}" và đang xem xét lộ trình hiện tại của họ.
Các chặng đường (milestones) hiện tại: ${JSON.stringify(currentMilestones)}
Lịch sử chat gần đây: ${JSON.stringify(chatHistory)}
Tin nhắn hiện tại của người dùng: "${userMessage}"

NHIỆM VỤ:
1. Trả lời người dùng dưới vai trò cố vấn, đưa ra lời khuyên về lộ trình học tập, các chặng đường tiếp theo nên bổ sung hoặc thay đổi.
2. Dựa trên lịch sử trò chuyện và yêu cầu, đề xuất một danh sách các chặng (milestones) mới.

TRẢ VỀ ĐÚNG MỘT JSON OBJECT theo cấu trúc:
{
    "chat_response": "Câu trả lời gửi cho người dùng...",
    "proposed_milestones": [
        {
            "title": "Tên chặng",
            "description": "Mô tả ngắn gọn",
            "categoriesCount": 3
        }
    ]
}`;

    try {
        const responseText = await executeWithFallback(prompt);
        let rawText = responseText;
        const match = rawText.match(/\{.*\}/s);
        if (match) rawText = match[0];
        rawText = rawText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        return JSON.parse(rawText) as ChatGenerateRoadmapResponse;
    } catch (error) {
        console.error("AI Error:", error);
        
        // Mock fallback responses for Demo
        let mockResponse = "Tôi đã điều chỉnh lộ trình theo định hướng mới của bạn!";
        let mockMilestones: ChatGeneratedMilestone[] = [
            {
                title: "Advanced React & Next.js",
                description: "Master server-side rendering, routing, and full-stack capabilities with Next.js.",
                categoriesCount: 3
            },
            {
                title: "AI & Tools Integration",
                description: "Learn to integrate generative AI models and utilize Cursor/Copilot effectively.",
                categoriesCount: 2
            },
            {
                title: "System Architecture & Scaling",
                description: "Design scalable front-end architectures and micro-frontends.",
                categoriesCount: 4
            }
        ];

        const lowerMsg = userMessage.toLowerCase();
        if (!userMessage) {
            mockResponse = "Dựa trên định hướng của bạn, tôi đề xuất các chặng đường tiếp theo. Bạn có muốn đổi sang định hướng khác như DevOps, Mobile, hay Data không?";
        } else if (lowerMsg.includes("devops")) {
            mockResponse = "Tuyệt vời, chuyển sang hướng DevOps. Tôi đã lên lộ trình bao gồm Docker, Kubernetes và CI/CD.";
            mockMilestones = [
                { title: "Containerization with Docker", description: "Learn to build and run containers efficiently.", categoriesCount: 3 },
                { title: "Orchestration with Kubernetes", description: "Deploy and manage containerized applications at scale.", categoriesCount: 4 },
                { title: "CI/CD Pipelines", description: "Automate testing and deployment workflows.", categoriesCount: 2 }
            ];
        } else if (lowerMsg.includes("mobile")) {
            mockResponse = "Chuyển sang hướng Mobile Development. Tôi đề xuất React Native hoặc Flutter cho nền tảng di động đa hệ.";
            mockMilestones = [
                { title: "Mobile UI/UX Design", description: "Understand mobile-first design principles and components.", categoriesCount: 2 },
                { title: "React Native Framework", description: "Build cross-platform applications using React.", categoriesCount: 4 },
                { title: "App Store Deployment", description: "Learn how to publish apps to Google Play and App Store.", categoriesCount: 2 }
            ];
        } else if (lowerMsg.includes("data") || lowerMsg.includes("ai")) {
            mockResponse = "Theo hướng Data & AI. Các chặng này tập trung vào Data Engineering và Machine Learning Models.";
            mockMilestones = [
                { title: "Python for Data Science", description: "Master Pandas, NumPy and Data Visualization.", categoriesCount: 3 },
                { title: "Machine Learning Foundations", description: "Learn core ML algorithms and Scikit-Learn.", categoriesCount: 3 },
                { title: "Deep Learning & LLMs", description: "Integrate large language models into applications.", categoriesCount: 3 }
            ];
        } else if (lowerMsg.includes("thêm")) {
            mockResponse = "Tôi đã thêm một chặng đặc biệt vào cuối lộ trình theo ý bạn.";
            mockMilestones.push({
                title: "Specialization & Soft Skills",
                description: "Improve leadership, communication, and specialized domains.",
                categoriesCount: 2
            });
        } else if (lowerMsg.includes("xóa") || lowerMsg.includes("bớt")) {
            mockResponse = "Tôi đã rút gọn lộ trình lại cho tinh gọn hơn.";
            mockMilestones = mockMilestones.slice(0, 2);
        } else {
            const shortText = userMessage.length > 15 ? userMessage.substring(0, 15) + '...' : userMessage;
            
            const randomRoadmaps = [
                [
                    { title: `Khóa học chuyên sâu: ${shortText}`, description: "Nội dung được tinh chỉnh tự động theo yêu cầu riêng biệt của bạn.", categoriesCount: 3 },
                    { title: "Nền tảng Cốt lõi (Review)", description: "Củng cố kiến thức nền tảng trước khi bước vào thực hành chuyên sâu.", categoriesCount: 2 },
                    { title: "Dự án Thực tế (Capstone)", description: "Áp dụng toàn bộ kiến thức vào một dự án thực tế có độ khó cao.", categoriesCount: 4 }
                ],
                [
                    { title: "Phân tích Yêu cầu Hệ thống", description: "Hiểu rõ bài toán và thu thập yêu cầu hệ thống.", categoriesCount: 2 },
                    { title: `Kiến trúc cho ${shortText}`, description: "Thiết kế kiến trúc tổng thể dựa trên yêu cầu mới.", categoriesCount: 4 },
                    { title: "Tối ưu hóa Hiệu suất", description: "Đảm bảo hệ thống chạy mượt mà và mở rộng tốt.", categoriesCount: 3 }
                ],
                [
                    { title: "Security & Authentication", description: "Bảo mật ứng dụng và quản lý danh tính người dùng.", categoriesCount: 3 },
                    { title: `Tích hợp ${shortText}`, description: "Phát triển các module theo chuẩn bảo mật cao nhất.", categoriesCount: 3 },
                    { title: "Testing & QA", description: "Tự động hóa kiểm thử để đảm bảo chất lượng code.", categoriesCount: 2 }
                ],
                [
                    { title: `Nhập môn ${shortText}`, description: "Làm quen với các khái niệm cơ bản nhất.", categoriesCount: 2 },
                    { title: "Thực hành Kỹ năng Cốt lõi", description: "Luyện tập với các bài tập thực tế vừa và nhỏ.", categoriesCount: 3 },
                    { title: "Phát triển Portfolio", description: "Xây dựng các sản phẩm cá nhân để trưng bày.", categoriesCount: 2 }
                ]
            ];
            
            // Randomly select one of the roadmaps
            const randomIndex = Math.floor(Math.random() * randomRoadmaps.length);
            mockMilestones = randomRoadmaps[randomIndex];
            
            const responses = [
                `Tuyệt vời! Tôi đã vẽ ra một hướng đi mới cho "${shortText}". Bạn xem thử ở cột bên phải nhé.`,
                `Đã hiểu ý bạn. Lộ trình cho "${shortText}" đã sẵn sàng.`,
                `Thú vị đấy! Dưới đây là các chặng đường tôi đề xuất dựa trên từ khóa "${shortText}".`,
                `Tôi đã cập nhật lộ trình chuyên biệt cho "${shortText}". Bạn hãy xem danh sách bên phải nhé!`
            ];
            mockResponse = responses[Math.floor(Math.random() * responses.length)];
        }

        return {
            chat_response: mockResponse,
            proposed_milestones: mockMilestones
        };
    }
};
