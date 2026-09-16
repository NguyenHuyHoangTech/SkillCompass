const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/mockRoadmapData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Find the start of the actual object, which is after "export const initialMockRoadmap: UserRoadmap = {"
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

// Ensure every milestone has at least 3 skills
data.milestones.forEach((ms, msIdx) => {
  let skillCount = 0;
  ms.categories.forEach(c => {
    skillCount += c.skills.length;
  });
  
  if (skillCount < 3) {
    const missing = 3 - skillCount;
    // Add to the last category
    const targetCat = ms.categories[ms.categories.length - 1];
    if (!targetCat) return; // shouldn't happen
    
    for (let i = 0; i < missing; i++) {
      targetCat.skills.push({
        id: `sk-dummy-${ms.id}-${i}`,
        name: `Additional Skill ${i + 1}`,
        icon: "Star",
        levelPercentage: ms.overallProgress === 100 ? 100 : (ms.overallProgress > 0 ? 50 : 0),
        subTopics: [
          {
            id: `sub-dummy-${ms.id}-${i}`,
            title: `Practice Topic ${i + 1}`,
            description: "Additional practice to master this stage.",
            isCompleted: ms.overallProgress === 100,
            assessmentScore: ms.overallProgress === 100 ? 85 : 0
          }
        ]
      });
    }
  }
});

const newJsonStr = JSON.stringify(data, null, 2);
fs.writeFileSync(filePath, prefix + newJsonStr + ';\n');
console.log('Successfully updated mockRoadmapData.ts');
