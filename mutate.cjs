const fs = require('fs');
const content = fs.readFileSync('./src/data/mockRoadmapData.ts', 'utf8');
let objStr = content.replace("import type { UserRoadmap } from '../types/roadmap';", '').replace('export const initialMockRoadmap: UserRoadmap = ', '').trim();
if(objStr.endsWith(';')) objStr = objStr.slice(0, -1);
const initialMockRoadmap = eval('(' + objStr + ')');

initialMockRoadmap.milestones.forEach((m, idx) => {
  if(idx < 3) {
     m.overallProgress = 100;
     m.categories.forEach(c => {
        c.skills.forEach(s => {
           s.levelPercentage = 100;
           s.subTopics.forEach(st => {
               st.isCompleted = true;
               st.assessmentScore = st.assessmentScore || 90;
           });
        });
     });
  }
});

const output = `import type { UserRoadmap } from '../types/roadmap';\n\nexport const initialMockRoadmap: UserRoadmap = ${JSON.stringify(initialMockRoadmap, null, 2)};\n`;
fs.writeFileSync('./src/data/mockRoadmapData.ts', output);
console.log('done');
