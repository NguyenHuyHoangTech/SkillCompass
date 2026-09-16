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
          title: `Nghiên cứu lý thuyết lõi về ${skill.name}`,
          description: "Tìm hiểu và nắm vững các khái niệm cơ bản, quy tắc thực hành chuẩn xác."
        },
        {
          title: `Thực hành xây dựng dự án mini ứng dụng ${skill.name}`,
          description: "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động."
        },
        {
          title: `Kiểm tra và review mã nguồn (Code/Design Review)`,
          description: "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng."
        },
        {
          title: `Thực hành tình huống thực tế do AI giả lập`,
          description: "Giải quyết bài toán mô phỏng các vấn đề thường gặp ở môi trường doanh nghiệp."
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
