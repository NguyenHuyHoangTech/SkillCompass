const fs = require('fs');
const path = require('path');

// 1. Read from mockRoadmapData.ts
const tsFilePath = path.join(__dirname, 'src/data/mockRoadmapData.ts');
let content = fs.readFileSync(tsFilePath, 'utf8');

const targetStr = 'export const initialMockRoadmap: UserRoadmap = ';
const startIdx = content.indexOf(targetStr) + targetStr.length;
const jsonStr = content.substring(startIdx, content.lastIndexOf('}') + 1);
const prefix = content.substring(0, startIdx);

let data;
try {
  data = JSON.parse(jsonStr);
} catch (e) {
  console.error("Failed to parse JSON", e);
  process.exit(1);
}

// Ensure every skill has at least 3 subTopics
data.milestones.forEach((ms) => {
  ms.categories.forEach(c => {
    c.skills.forEach((skill, skillIdx) => {
      
      const defaultTasks = [
        {
          title: `Study the core theory of ${skill.name}`,
          description: "Learn and master the fundamental concepts and established best practices."
        },
        {
          title: `Build a mini project applying ${skill.name}`,
          description: "Apply what you learned in a small project to understand how it works."
        },
        {
          title: `Review the source code (Code/Design Review)`,
          description: "Evaluate issues and identify ways to improve performance and quality."
        },
        {
          title: `Practice an AI-simulated real-world scenario`,
          description: "Solve a simulated problem based on common workplace scenarios."
        }
      ];

      while (skill.subTopics.length < 3) {
        // Pick a default task based on the current length to ensure variety
        const taskTemplate = defaultTasks[skill.subTopics.length % defaultTasks.length];
        
        skill.subTopics.push({
          id: `sub-auto-${skill.id}-${skill.subTopics.length}`,
          title: taskTemplate.title,
          description: taskTemplate.description,
          isCompleted: false,
          assessmentScore: 0
        });
      }
      
      // Also reset levelPercentage correctly according to the new cap logic
      // if not all are completed
      const completedList = skill.subTopics.filter(s => s.isCompleted);
      if (skill.subTopics.length > 0) {
        let pct = Math.round((completedList.length / skill.subTopics.length) * 100);
        if (pct === 100) pct = 99;
        skill.levelPercentage = pct;
      } else {
        skill.levelPercentage = 0;
      }
    });
  });
});

const newJsonStr = JSON.stringify(data, null, 2);

// 2. Write back to TS
fs.writeFileSync(tsFilePath, prefix + newJsonStr + ';\n');

// 3. Write back to server JSON
const jsonFilePath = path.join(__dirname, 'server/data/roadmapData.json');
fs.writeFileSync(jsonFilePath, newJsonStr, 'utf8');

console.log('Successfully added subTopics to all skills.');
