const fs = require('fs');
const path = require('path');

// Target number of skills for each milestone by index
const targetSkillCounts = [5, 3, 4, 6, 3, 5, 4, 7, 5, 4, 3, 6]; 

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

// Mutate data
data.milestones.forEach((ms, msIdx) => {
  let skillCount = 0;
  ms.categories.forEach(c => {
    skillCount += c.skills.length;
  });
  
  const targetCount = targetSkillCounts[msIdx % targetSkillCounts.length];
  
  if (skillCount < targetCount) {
    const missing = targetCount - skillCount;
    const targetCat = ms.categories[ms.categories.length - 1];
    if (!targetCat) return;
    
    for (let i = 0; i < missing; i++) {
      targetCat.skills.push({
        id: `sk-rnd-${ms.id}-${i}`,
        name: `Dynamic Skill ${skillCount + i + 1}`,
        icon: "Hexagon",
        levelPercentage: ms.overallProgress === 100 ? 100 : (ms.overallProgress > 0 ? 50 : 0),
        subTopics: [
          {
            id: `sub-rnd-${ms.id}-${i}`,
            title: `Advanced Practice ${skillCount + i + 1}`,
            description: "Advanced practice for comprehensive coverage.",
            isCompleted: ms.overallProgress === 100,
            assessmentScore: ms.overallProgress === 100 ? 80 : 0
          }
        ]
      });
    }
  }
});

const newJsonStr = JSON.stringify(data, null, 2);
// 1. Write back to TS
fs.writeFileSync(tsFilePath, prefix + newJsonStr + ';\n');

// 2. Write back to server JSON
const jsonFilePath = path.join(__dirname, 'server/data/roadmapData.json');
fs.writeFileSync(jsonFilePath, newJsonStr, 'utf8');

console.log('Successfully added varying skills to mockRoadmapData.ts and roadmapData.json');
