import { GoogleGenAI } from '@google/genai';

// Initialize the API with the provided key or environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6JDlnH8wQy06XFKjWScBEUvJunwZkBJsEFIAiU21keBhw';
const ai = new GoogleGenAI({ apiKey: apiKey });
const modelName = 'gemini-3.6-flash';

export const generateAssessmentQuestion = async (skill: string): Promise<string> => {
    const prompt = `Bạn là một chuyên gia tuyển dụng và kỹ thuật. Hãy đưa ra 1 câu hỏi tình huống thực tế NGẮN GỌN (tối đa 2 câu) để kiểm tra năng lực của một ứng viên về kỹ năng "${skill}". Câu hỏi cần sát với thực tế đi làm, không hỏi lý thuyết suông.`;
    
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
    const prompt = `Đóng vai chuyên gia kỹ thuật. Ứng viên vừa trả lời câu hỏi về kỹ năng "${skill}" như sau: "${answer}". 
Hãy đánh giá câu trả lời này cực kỳ NGẮN GỌN (1-2 câu). Khen ngợi nếu đúng, góp ý nếu sai. Giọng điệu chuyên nghiệp, mang tính xây dựng.`;
    
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        return response.text || "Câu trả lời của bạn đã được ghi nhận và đánh giá tốt.";
    } catch (error) {
        console.error("AI Error:", error);
        return "Cảm ơn bạn đã chia sẻ. Kinh nghiệm của bạn rất hữu ích.";
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

export interface CareerSuggestion {
    title: string;
    reason: string;
}

export const suggestCareers = async (skills: string[], riasecTraits: string[]): Promise<CareerSuggestion[]> => {
    const prompt = `Người dùng hiện có kỹ năng: [${skills.join(', ')}]. Theo mô hình RIASEC, họ thuộc nhóm tính cách ${riasecTraits.join(' và ')}. Hãy đề xuất đúng 3 vị trí công việc IT (hoặc liên quan) phù hợp nhất. Trả về ĐÚNG MỘT MẢNG JSON, không có text thừa hay markdown block, theo cấu trúc:
[
  {
    "title": "Tên công việc",
    "reason": "Giải thích ngắn gọn trong 1 câu vì sao phù hợp."
  }
]`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText) as CareerSuggestion[];
        return data;
    } catch (error) {
        console.error("AI Error:", error);
        return [
            { title: "Frontend Developer", reason: "Phù hợp với tính sáng tạo và kỹ năng của bạn." },
            { title: "UX/UI Designer", reason: "Tận dụng tốt sự nhạy bén về thẩm mỹ và kỹ thuật." },
            { title: "Data Analyst", reason: "Thích hợp với việc nghiên cứu và phân tích số liệu." }
        ];
    }
};

export interface RiasecCard {
    id: string;
    text: string;
}

export const generateDynamicRIASECCards = async (skills: string[]): Promise<RiasecCard[]> => {
    const prompt = `Dựa vào bộ kỹ năng: [${skills.join(', ')}]. Hãy sinh ra 6 tình huống làm việc thực tế đại diện cho 6 nhóm tính cách R, I, A, S, E, C trong mô hình RIASEC. Các tình huống phải GẮN LIỀN với bộ kỹ năng trên, cực kỳ thực tế và hấp dẫn. Trả về ĐÚNG MỘT MẢNG JSON, không có text thừa hay markdown block, theo cấu trúc:
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
            { id: 'R', text: 'Thích cắm mặt vào máy tính fix bug hoặc tự tay làm thay vì họp hành.' },
            { id: 'I', text: 'Sẵn sàng dành 3 tiếng đồng hồ chỉ để đọc tài liệu và tìm ra giải pháp tối ưu nhất.' },
            { id: 'A', text: 'Thích tự do thiết kế phá cách mà không theo quy chuẩn gò bó nào.' },
            { id: 'S', text: 'Có khả năng đi hướng dẫn và training lại cho các bạn mới vào team.' },
            { id: 'E', text: 'Tự tin trực tiếp đi thuyết trình và bảo vệ ý tưởng trước ban giám đốc.' },
            { id: 'C', text: 'Thích ngồi viết tài liệu quy trình chuẩn và sắp xếp lại cấu trúc công việc cho team.' }
        ];
    }
};

const getMockMilestones = (career: string): Milestone[] => {
    return [
        {
            id: 'm1', title: 'Mốc 1: Sẵn sàng Thực tập', status: 'completed', progress: 100,
            start_date: '01/09/2026', end_date: '15/11/2026', goal: `Nền tảng cho ${career}`,
            user_notes: 'Hoàn thành cơ bản',
            skills: [
                {
                    id: 's1', title: 'Kiến thức cốt lõi', category: 'Core Tech', status: 'completed',
                    goal: 'Hiểu bản chất', user_notes: '', ai_practice_scenario: 'Hãy mô tả cách bạn vận dụng kiến thức này vào thực tế.',
                    sub_tasks: [{ id: 'st1', text: 'Nắm vững lý thuyết', is_completed: true, completion_note: 'Đã học' }]
                }
            ]
        },
        {
            id: 'm2', title: 'Mốc 2: Junior', status: 'in-progress', progress: 35,
            start_date: '16/11/2026', end_date: '15/03/2027', goal: 'Áp dụng vào project',
            user_notes: 'Đang làm dự án',
            skills: [
                {
                    id: 's2', title: 'Thực hành nâng cao', category: 'Core Tech', status: 'in-progress',
                    goal: 'Làm mượt mà', user_notes: '', ai_practice_scenario: 'Làm sao để tối ưu hoá tốc độ xử lý trong project?',
                    sub_tasks: [{ id: 'st2', text: 'Tối ưu hiệu năng', is_completed: false, completion_note: '' }]
                }
            ]
        },
        {
            id: 'm3', title: 'Mốc 3: AI Era', status: 'planned', progress: 0,
            start_date: '16/03/2027', end_date: '15/08/2027', goal: 'Tích hợp AI',
            user_notes: '',
            skills: [
                {
                    id: 's3', title: 'AI Tools', category: 'AI-Era Competency', status: 'planned',
                    goal: 'Sử dụng công cụ AI', user_notes: '', ai_practice_scenario: 'Làm thế nào để prompt cho AI tự sinh ra code không bị lỗi?',
                    sub_tasks: [{ id: 'st3', text: 'Thành thạo Prompt', is_completed: false, completion_note: '' }]
                }
            ]
        }
    ];
}
