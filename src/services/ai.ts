import { GoogleGenAI } from '@google/genai';

// Initialize the API with the provided key or environment variable
let apiKey = localStorage.getItem('gemini_api_key') || '';
let ai = new GoogleGenAI({ apiKey: apiKey });
let modelName = localStorage.getItem('gemini_model_name') || 'gemini-flash-latest';

export const updateAIConfig = (newKey: string, newModel: string) => {
    if (newKey) {
        apiKey = newKey;
        localStorage.setItem('gemini_api_key', newKey);
        ai = new GoogleGenAI({ apiKey: apiKey });
    }
    if (newModel) {
        if (newModel === 'gemini-1.5-flash') newModel = 'gemini-flash-latest';
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
        return { success: true, models, message: "Lấy danh sách model thành công!" };
    } catch (e: any) {
        console.error("List models failed:", e);
        return { success: false, models: [], message: e.message || "Kết nối thất bại!" };
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
        const response = await ai.models.generateContent({
            model: modelName,
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
        return { success: !!response.text, message: "Kết nối thành công!", reply: response.text };
    } catch (e: any) {
        console.error("Test API Key failed:", e);
        return { success: false, message: e.message || "Kết nối thất bại!" };
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
        const response = await ai.models.generateContent({
            model: modelName,
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
        const response = await ai.models.generateContent({
            model: modelName,
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
        const response = await ai.models.generateContent({
            model: modelName,
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
    const prompt = `Bạn là một chuyên gia kỹ thuật và khảo thí (Technical Examiner & Assessor) có nhiều năm kinh nghiệm. 

Hệ thống hoạt động theo quy trình tương tác với người dùng qua các kỹ năng họ nhập vào:

---
### DỮ LIỆU ĐẦU VÀO TỪ NGƯỜI DÙNG:
- Kỹ năng cần kiểm tra: ${skill}
- Câu trả lời của người dùng cho bài test: 
---

### HÃY THỰC HIỆN THEO TRẠNG THÁI SAU:

**TRẠNG THÁI 1: NẾU CHƯA CÓ CÂU TRẢ LỜI CỦA NGƯỜI DÙNG (TẠO BÀI TEST)**
Hãy đóng vai trò là giám khảo và đưa ra một bài kiểm tra ngắn gọn gồm 1-2 câu hỏi tình huống hoặc kỹ thuật thực tế nhất để kiểm tra đúng kỹ năng "${skill}" ở mức độ thực chiến. Đừng giải đáp ngay, hãy để người dùng trả lời.`;
    
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        return response.text || `Hãy chia sẻ kinh nghiệm thực tế nhất của bạn với ${skill}?`;
    } catch (error) {
        console.error("AI Error:", error);
        return `Bạn xử lý thế nào khi gặp lỗi khó trong lúc làm việc với ${skill}?`;
    }
};

export const evaluateAssessmentAnswer = async (skill: string, answer: string): Promise<string> => {
    const prompt = `Bạn là một chuyên gia kỹ thuật và khảo thí (Technical Examiner & Assessor) có nhiều năm kinh nghiệm. 

Hệ thống hoạt động theo quy trình tương tác với người dùng qua các kỹ năng họ nhập vào:

---
### DỮ LIỆU ĐẦU VÀO TỪ NGƯỜI DÙNG:
- Kỹ năng cần kiểm tra: ${skill}
- Câu trả lời của người dùng cho bài test: ${answer}
---

### HÃY THỰC HIỆN THEO TRẠNG THÁI SAU:

**TRẠNG THÁI 2: NẾU ĐÃ CÓ CÂU TRẢ LỜI CỦA NGƯỜI DÙNG (ĐÁNH GIÁ)**
Hãy phân tích câu trả lời của người dùng và trả kết quả theo cấu trúc sau:
1. Nhận định đúng / sai: Câu trả lời đang ĐÚNG hay đang SAI (hoặc chưa chính xác ở điểm nào)?
2. Xác định mức độ (Level): Đánh giá câu trả lời này đang ở mức độ nào (Ví dụ: Yếu / Sơ khai, Đạt yêu cầu / Trung bình, Khá tốt, hoặc Xuất sắc / Chuyên gia).
3. Phân tích chi tiết: 
   - Điểm đã làm tốt: Kiến thức hoặc tư duy nào trong câu trả lời chính xác?
   - Điểm còn thiếu / Lỗ hổng kiến thức: Người dùng còn hiểu lầm hoặc thiếu sót chi tiết kỹ thuật nào?
4. Lời khuyên cải thiện: Gợi ý cách sửa câu trả lời hoặc tài liệu/từ khóa kỹ thuật cần ôn tập thêm.`;
    
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        return response.text || "Câu trả lời của bạn đã được ghi nhận và đánh giá tốt.";
    } catch (error) {
        console.error("AI Error:", error);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return "⚠️ Hệ thống AI đang gặp lỗi kết nối hoặc quá tải (Quota Exceeded). Xin lỗi bạn vì sự bất tiện này! \n\nVui lòng nhấn vào nút [AI Config] ở thanh công cụ phía trên để nhập API Key của riêng bạn, hoặc đợi 1-2 phút rồi thử lại.";
    }
};

export const generateSandboxScenario = async (career: string): Promise<string> => {
    const prompt = `Bạn là quản lý trực tiếp của một "${career}". Hãy đưa ra một tình huống giả định (sandbox) cực kỳ NGẮN GỌN (khoảng 3-4 câu) mô tả một vấn đề hoặc nhiệm vụ thực tế, có phần khó nhằn mà người làm nghề này phải giải quyết ngay trong ngày làm việc đầu tiên. Ví dụ: Sếp ném cho file Excel lỗi...`;
    
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        return response.text || `Chào mừng ngày làm việc đầu tiên! Một task bất ngờ được giao cho bạn liên quan đến ${career}. Bạn sẽ xử lý nó từ đâu?`;
    } catch (error) {
        console.error("AI Error:", error);
        return "Hệ thống gặp chút sự cố, hãy giả định bạn đang phải hoàn thành một deadline gấp rút.";
    }
};

export const evaluateSandboxChoice = async (career: string, choiceType: string): Promise<string> => {
    let choiceText = "";
    switch(choiceType) {
        case 'code': choiceText = "Tự viết code/script để tự động hóa xử lý."; break;
        case 'ai': choiceText = "Dùng công cụ AI (như ChatGPT, Gemini) để giải quyết nhanh."; break;
        case 'manual': choiceText = "Làm thủ công từng bước cẩn thận bằng công cụ cơ bản."; break;
        case 'ask': choiceText = "Hỏi người giao task hoặc đồng nghiệp để làm rõ trước khi làm."; break;
        default: choiceText = choiceType;
    }

    const prompt = `Người dùng đang ứng tuyển vị trí "${career}". Đối mặt với một vấn đề khó, họ chọn cách xử lý: "${choiceText}".
Hãy đưa ra một đánh giá NGẮN GỌN (2-3 câu) về mặt tư duy nghề nghiệp của lựa chọn này. Nêu ra 1 kỹ năng hoặc tư duy mà họ CẦN BỔ SUNG trong tương lai để phát triển mạnh mẽ hơn ở vị trí này.`;
    
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        return response.text || "Lựa chọn của bạn cho thấy tư duy ứng dụng tốt. Tuy nhiên hãy luôn học hỏi kỹ năng mới.";
    } catch (error) {
        console.error("AI Error:", error);
        return "Lựa chọn này rất thực tế. Tiếp tục phát huy nhé!";
    }
};

// Interface cho cấu trúc JSON trả về
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
    const prompt = `Bạn là một AI Career Coach xuất sắc. Hãy thiết kế một bản đồ lộ trình sự nghiệp (Career Roadmap) dạng JSON chuẩn cho một người muốn trở thành "${career}".
Kỹ năng hiện tại của họ: ${skills.join(', ')}.
Nhận xét tư duy làm việc của họ: ${sandboxFeedback}.

Yêu cầu output: 
Trích xuất ĐÚNG và DUY NHẤT một mảng JSON (không có markdown \`\`\`json hoặc text thừa) chứa đúng 3 object đại diện cho 3 Milestone (Giai đoạn).
Cấu trúc JSON mỗi Milestone như sau:
{
    "id": "m1", // m1, m2, m3
    "title": "Tên giai đoạn (vd: Sẵn sàng thực tập)",
    "status": "completed", // m1: completed, m2: in-progress, m3: planned
    "progress": 100, // 100, 35, 0...
    "start_date": "01/09/2026",
    "end_date": "15/11/2026",
    "goal": "Mục tiêu chính",
    "user_notes": "Ghi chú khuyến khích",
    "skills": [ // 1-2 kỹ năng mỗi milestone
        {
            "id": "s1", 
            "title": "Tên kỹ năng",
            "category": "Core Tech hoặc AI-Era Competency",
            "status": "completed", // khớp với status của milestone
            "goal": "Mục tiêu kỹ năng",
            "user_notes": "",
            "ai_practice_scenario": "1 câu hỏi thực hành khó nhằn về kỹ năng này",
            "sub_tasks": [ // 1-2 sub task
                { "id": "st1_1", "text": "Tên subtask", "is_completed": true, "completion_note": "Pass" }
            ]
        }
    ]
}
Hãy đảm bảo nội dung Tiếng Việt, thực tế, JSON parse được trực tiếp.`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as Milestone[];
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        // Fallback data if JSON parsing fails or API fails
        return getMockMilestones(career);
    }
};

export const optimizeRoadmap = async (_currentRoadmap: any, country: string): Promise<string> => {
    const prompt = `Phân tích ngắn gọn (2-3 câu) xu hướng tuyển dụng IT hiện tại ở thị trường "${country}". Sau đó đề xuất 1 kỹ năng AI MỚI NHẤT mà ứng viên cần học để không bị đào thải. Định dạng như sau:
Phân tích: ...
Đề xuất: ...`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        return response.text || `Thị trường ${country} đang khát nhân sự tích hợp AI. Hãy học thêm về Generative AI.`;
    } catch (error) {
        console.error("AI Error:", error);
        return `Thị trường ${country} đang rất cần nhân sự chất lượng cao.`;
    }
};

export const evaluateSkillPractice = async (skillTitle: string, scenario: string, answer: string): Promise<string> => {
    const prompt = `Bạn là AI Mentor. Người dùng đang thực hành kỹ năng "${skillTitle}".
Tình huống đưa ra: "${scenario}".
Câu trả lời của họ: "${answer}".
Đánh giá câu trả lời này NGẮN GỌN (2-3 câu). Nhấn mạnh vào tư duy lập trình/giải quyết vấn đề.`;
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        return response.text || `Cách giải quyết khá tốt. Cần chú ý thêm về tối ưu hóa code.`;
    } catch (error) {
        console.error("AI Error:", error);
        return `Ghi nhận câu trả lời của bạn.`;
    }
};

export interface IkigaiCareerSuggestion {
    title: string;
    reason: string;
    mini_roadmap: string[];
    real_world_example: string;
}

export const suggestIkigaiCareers = async (skills: string[], riasecScores: Record<string, number>, ikigaiText: string): Promise<IkigaiCareerSuggestion[]> => {
    // Determine top 2 traits
    const sortedTraits = Object.keys(riasecScores).sort((a, b) => riasecScores[b] - riasecScores[a]);
    const top2 = sortedTraits.slice(0, 2);
    const map: Record<string, string> = { 
        R: 'Thực tế', I: 'Nghiên cứu', A: 'Nghệ thuật', 
        S: 'Xã hội', E: 'Dám nghĩ dám làm', C: 'Mẫu mực' 
    };
    const traits = top2.map(k => map[k]);

    const prompt = `Phân tích hồ sơ định hướng nghề nghiệp:
- Kỹ năng hiện có (What you are good at): ${skills.join(', ')}
- Nhóm tính cách RIASEC nổi trội: ${traits.join(', ')}
- Chia sẻ bổ sung từ người dùng (Sở thích, Thu nhập, Nhu cầu Xã hội): "${ikigaiText}"

Dựa trên mô hình Ikigai, hãy đề xuất đúng 3 vị trí công việc IT (hoặc liên quan) phù hợp nhất. Trả về ĐÚNG MỘT MẢNG JSON theo cấu trúc:
[
  {
    "title": "Tên công việc",
    "reason": "Giải thích ngắn gọn 1 câu vì sao phù hợp với Ikigai của họ.",
    "mini_roadmap": ["Học cơ bản", "Làm dự án thực tế", "Apply thực tập", "Đi làm"],
    "real_world_example": "Ví dụ thực tế: Làm app quản lý công việc cho nhóm."
  }
]`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as IkigaiCareerSuggestion[];
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return [
            { 
                title: "Frontend Developer", 
                reason: "Phù hợp với tính sáng tạo và kỹ năng của bạn.",
                mini_roadmap: ["HTML/CSS/JS", "React", "Tối ưu hóa UI"],
                real_world_example: "Xây dựng website bán hàng đẹp mắt và tương tác tốt."
            },
            { 
                title: "UX/UI Designer", 
                reason: "Tận dụng tốt sự nhạy bén về thẩm mỹ và kỹ thuật.",
                mini_roadmap: ["Figma", "Nguyên lý UX", "Tạo Prototype"],
                real_world_example: "Thiết kế giao diện app học tập giúp học sinh dễ sử dụng."
            },
            { 
                title: "Data Analyst", 
                reason: "Thích hợp với việc nghiên cứu và phân tích số liệu.",
                mini_roadmap: ["Excel/SQL", "Python", "Dashboard"],
                real_world_example: "Phân tích dữ liệu doanh thu giúp giám đốc đưa ra quyết định."
            }
        ];
    }
};

export interface RiasecCard {
    id: string;
    text: string;
}

export const generateIkigaiQuestions = async (skills: string[]): Promise<{ love: string, money: string }> => {
    const prompt = `Bạn là chuyên gia hướng nghiệp Ikigai. Người dùng có các kỹ năng: ${skills.join(', ')}.
Hãy tạo ra 2 câu hỏi NGẮN GỌN (mỗi câu 1 dòng) để hỏi họ:
1. Về Sở thích (What you love): Dựa vào kỹ năng trên, hỏi xem họ thích làm khía cạnh nào nhất?
2. Về Thu nhập (What you can be paid for): Hỏi về kỳ vọng mức lương hoặc sự ổn định trong ngành nghề liên quan đến kỹ năng đó?
Trả về ĐÚNG MỘT JSON OBJECT theo cấu trúc:
{
  "love": "Câu hỏi về sở thích...",
  "money": "Câu hỏi về kỳ vọng thu nhập..."
}`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText);
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return {
            love: `Với những kỹ năng như ${skills.join(', ')}, bạn cảm thấy hứng thú nhất khi làm công việc gì?`,
            money: `Bạn mong muốn mức thu nhập khởi điểm là bao nhiêu khi áp dụng những kỹ năng này?`
        };
    }
};

export const generateDynamicRIASECCards = async (skills: string[]): Promise<RiasecCard[]> => {
    const prompt = `Dựa vào bộ kỹ năng: [${skills.join(', ')}]. Hãy sinh ra 6 tình huống làm việc thực tế đại diện cho 6 nhóm tính cách R, I, A, S, E, C trong mô hình RIASEC. Các tình huống phải GẮN LIỀN với bộ kỹ năng trên, cực kỳ thực tế và hấp dẫn. Nhưng phải dựa trên các khung ý tưởng sau:
- Nhóm R (Thực tế): Làm việc trực tiếp với máy móc, code, sửa lỗi, thao tác tay chân không thích họp hành.
- Nhóm I (Nghiên cứu): Dành nhiều giờ đọc tài liệu, tìm hiểu sâu một thuật toán/vấn đề.
- Nhóm A (Nghệ thuật): Thiết kế tự do, phá cách, UI/UX sáng tạo.
- Nhóm S (Xã hội): Hướng dẫn, training, giúp đỡ đồng nghiệp, sinh viên mới.
- Nhóm E (Dám nghĩ dám làm): Thuyết trình, bảo vệ ý tưởng, kêu gọi đầu tư, quản lý.
- Nhóm C (Mẫu mực): Viết tài liệu (document/API), chuẩn hóa quy trình, sắp xếp cấu trúc thư mục cẩn thận.

Trả về ĐÚNG MỘT MẢNG JSON, không có text thừa hay markdown block, theo cấu trúc:
[
  { "id": "R", "text": "Tình huống thuộc nhóm R (Thực tế/Kỹ thuật/Thao tác tay)" },
  { "id": "I", "text": "Tình huống thuộc nhóm I (Nghiên cứu/Phân tích/Tìm tòi)" },
  { "id": "A", "text": "Tình huống thuộc nhóm A (Nghệ thuật/Sáng tạo/Phá cách)" },
  { "id": "S", "text": "Tình huống thuộc nhóm S (Xã hội/Giao tiếp/Hướng dẫn)" },
  { "id": "E", "text": "Tình huống thuộc nhóm E (Quản lý/Kinh doanh/Thuyết phục)" },
  { "id": "C", "text": "Tình huống thuộc nhóm C (Quy tắc/Tổ chức/Tài liệu)" }
]`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as RiasecCard[];
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return [
            { id: 'R', text: 'Cắm mặt vào máy tính fix bug hoặc tự tay nối dây mạng thay vì họp hành.' },
            { id: 'I', text: 'Dành 3 tiếng đồng hồ chỉ để đọc tài liệu và tìm ra thuật toán tối ưu nhất.' },
            { id: 'A', text: 'Tự do thiết kế một giao diện UI/UX phá cách mà không theo quy chuẩn nào.' },
            { id: 'S', text: 'Đi hướng dẫn và training lại cho các bạn thực tập sinh mới vào team.' },
            { id: 'E', text: 'Trực tiếp đi thuyết trình và thuyết phục nhà đầu tư rót vốn cho dự án.' },
            { id: 'C', text: 'Ngồi viết tài liệu API (Document) và sắp xếp lại cấu trúc thư mục code cho cả team.' }
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
    const prompt = `Bạn là một AI Career Coach xuất sắc. Hãy thiết kế HAI (2) bản đồ lộ trình sự nghiệp (Career Roadmap) dạng JSON chuẩn cho mục tiêu "${goal}".
Dữ liệu phân tích:
- Kỹ năng hiện tại: ${skills.join(', ')}
- Tính cách RIASEC: ${JSON.stringify(riasecScores)}
- Ikigai Text: "${ikigaiText}"
- Tam giác ngữ cảnh (Thực tế):
  + Quỹ thời gian: ${contextTriangle.time}
  + Trạng thái học vấn: ${contextTriangle.academic}
  + Nguồn lực (Tài chính): ${contextTriangle.budget}

Yêu cầu: Option 1 có thể tập trung vào lộ trình cốt lõi, an toàn. Option 2 có thể táo bạo hơn, ngách hơn, hoặc tận dụng AI nhiều hơn.
Trả về ĐÚNG MỘT JSON OBJECT theo cấu trúc:
{
  "option1": {
    "title": "Tên lộ trình 1",
    "description": "Mô tả ngắn gọn lộ trình 1",
    "milestones": [
      {
        "id": "m1",
        "title": "Tên mốc (VD: Mốc 1: Nền tảng)",
        "goal": "Mục tiêu ngắn của mốc này",
        "skills": [
          { "title": "Tên kỹ năng (VD: ReactJS)" }
        ]
      }
    ]
  },
  "option2": {
    "title": "Tên lộ trình 2",
    "description": "Mô tả ngắn gọn lộ trình 2",
    "milestones": [ /* Cấu trúc tương tự option1 */ ]
  }
}`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as DualRoadmapsResponse;
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return {
            option1: {
                title: "Lộ trình Tiêu Chuẩn",
                description: "Bước đi vững chắc, tập trung vào nền tảng kỹ thuật cốt lõi.",
                milestones: getMockMilestones(goal)
            },
            option2: {
                title: "Lộ trình Đột Phá AI",
                description: "Tận dụng tối đa công cụ AI để gia tăng tốc độ, bỏ qua các bước thủ công.",
                milestones: getMockMilestones(goal)
            }
        };
    }
};

export const refineRoadmap = async (currentMilestones: Milestone[], feedback: string): Promise<Milestone[] | null> => {
    const prompt = `Người dùng muốn điều chỉnh lộ trình hiện tại với phản hồi: "${feedback}".
Lộ trình hiện tại: ${JSON.stringify(currentMilestones)}

Dựa vào feedback, hãy cập nhật lại nội dung của lộ trình này (thêm/bớt milestone hoặc đổi kỹ năng học, đổi thời gian học). Trả về MẢNG JSON Milestone mới. Đừng dùng markdown block, chỉ trả JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
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
            id: 'm1', title: 'Mốc 1: Sẵn sàng Thực tập', status: 'completed', progress: 100,
            start_date: '01/09/2026', end_date: '15/11/2026', goal: `Xây nền tảng cho ${career}`,
            user_notes: 'Hoàn thành cơ bản',
            skills: [
                {
                    id: 's1', title: 'HTML / CSS / JavaScript', category: 'Core Tech', status: 'completed',
                    goal: 'Hiểu bản chất', user_notes: '', ai_practice_scenario: 'Hãy mô tả cách bạn vận dụng kiến thức này vào thực tế.',
                    sub_tasks: [{ id: 'st1', text: 'Nắm vững lý thuyết', is_completed: true, completion_note: 'Đã học' }]
                },
                {
                    id: 's1b', title: 'Git & GitHub', category: 'Tool', status: 'completed',
                    goal: 'Quản lý mã nguồn', user_notes: '', ai_practice_scenario: '',
                    sub_tasks: []
                }
            ]
        },
        {
            id: 'm2', title: 'Mốc 2: Junior', status: 'in-progress', progress: 35,
            start_date: '16/11/2026', end_date: '15/03/2027', goal: 'Áp dụng vào project',
            user_notes: 'Đang làm dự án',
            skills: [
                {
                    id: 's2', title: 'ReactJS / VueJS', category: 'Core Tech', status: 'in-progress',
                    goal: 'Xây dựng giao diện mượt mà', user_notes: '', ai_practice_scenario: 'Làm sao để tối ưu hoá tốc độ xử lý trong project?',
                    sub_tasks: [{ id: 'st2', text: 'Tối ưu hiệu năng', is_completed: false, completion_note: '' }]
                },
                {
                    id: 's2b', title: 'Tailwind CSS', category: 'UI', status: 'planned',
                    goal: 'Style nhanh chóng', user_notes: '', ai_practice_scenario: '',
                    sub_tasks: []
                }
            ]
        },
        {
            id: 'm3', title: 'Mốc 3: AI Era', status: 'planned', progress: 0,
            start_date: '16/03/2027', end_date: '15/08/2027', goal: 'Tích hợp AI',
            user_notes: '',
            skills: [
                {
                    id: 's3', title: 'ChatGPT / Cursor', category: 'AI-Era Competency', status: 'planned',
                    goal: 'Sử dụng công cụ AI', user_notes: '', ai_practice_scenario: 'Làm thế nào để prompt cho AI tự sinh ra code không bị lỗi?',
                    sub_tasks: [{ id: 'st3', text: 'Thành thạo Prompt', is_completed: false, completion_note: '' }]
                }
            ]
        }
    ];
}
