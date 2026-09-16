import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API key found in .env");
    process.exit(1);
}
const ai = new GoogleGenAI({ apiKey });

async function translateFile(filePath) {
    console.log(`Translating ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const prompt = `Translate all Vietnamese text in the following React/TypeScript code into English. 
DO NOT change any code logic, variable names, class names, or syntax. Only translate the human-readable text strings, placeholders, and comments. 
Return the ENTIRE file content with the translations applied. Do not wrap it in markdown code blocks, just return the raw code.

Code:
${content}
`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                temperature: 0.1
            }
        });
        let result = response.text;
        if (result.startsWith('\`\`\`')) {
            result = result.replace(/^\`\`\`(tsx|typescript|javascript|ts|js)?\n/, '').replace(/\n\`\`\`$/, '');
        }
        fs.writeFileSync(filePath, result, 'utf-8');
        console.log(`Successfully translated ${filePath}`);
    } catch (e) {
        console.error(`Failed to translate ${filePath}:`, e);
    }
}

const filesToTranslate = [
    'src/pages/Onboarding.tsx',
    'src/pages/Roadmap.tsx',
    'src/components/pages/SettingsPage.tsx',
    'src/components/pages/QuizLibraryPage.tsx',
    'src/components/pages/ExercisePage.tsx',
    'src/components/pages/AllSkillsPage.tsx',
    'src/components/pages/AnalyticsPage.tsx',
    'src/components/roadmap/StarSkillModal.tsx',
    'src/components/roadmap/RoadmapHeader.tsx',
    'src/components/roadmap/IndustryRadarSection.tsx',
    'src/components/roadmap/HorizontalSubTabBar.tsx',
    'src/components/roadmap/SpiderChart.tsx',
    'src/components/roadmap/StarSphereCanvas.tsx',
    'src/components/ai/ExerciseAIChatbox.tsx',
    'src/components/ai/AIQuizModal.tsx',
    'src/components/ai/AIMilestoneEvaluator.tsx',
    'src/components/ai/AICareerChatbot.tsx'
];

async function main() {
    for (const file of filesToTranslate) {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
            await translateFile(fullPath);
        } else {
            console.log(`Skipped ${fullPath}, file not found.`);
        }
    }
}

main();
