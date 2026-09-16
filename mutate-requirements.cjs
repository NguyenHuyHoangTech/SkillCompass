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

// 2. Add requirements to every skill
data.milestones.forEach((ms) => {
  ms.categories.forEach(c => {
    c.skills.forEach(skill => {
      // Add realistic sounding requirements based on the skill name
      skill.requirements = [
        `Hoàn thành 100% bài tập thực hành về ${skill.name}`,
        `Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)`,
        `Áp dụng thành công vào ít nhất 1 dự án thực tế`
      ];
    });
  });
});

const newJsonStr = JSON.stringify(data, null, 2);

// 3. Write back to TS
fs.writeFileSync(tsFilePath, prefix + newJsonStr + ';\n');

// 4. Write back to server JSON
const jsonFilePath = path.join(__dirname, 'server/data/roadmapData.json');
fs.writeFileSync(jsonFilePath, newJsonStr, 'utf8');

console.log('Successfully added requirements to all skills.');
