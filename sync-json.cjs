const fs = require('fs');
const path = require('path');

// 1. Read from mockRoadmapData.ts
const tsFilePath = path.join(__dirname, 'src/data/mockRoadmapData.ts');
const tsContent = fs.readFileSync(tsFilePath, 'utf8');

const targetStr = 'export const initialMockRoadmap: UserRoadmap = ';
const startIdx = tsContent.indexOf(targetStr) + targetStr.length;
const jsonStr = tsContent.substring(startIdx, tsContent.lastIndexOf('}') + 1);

let data;
try {
  data = JSON.parse(jsonStr);
} catch (e) {
  console.error("Failed to parse TS JSON string", e);
  process.exit(1);
}

// 2. Write to roadmapData.json
const jsonFilePath = path.join(__dirname, 'server/data/roadmapData.json');
fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully synced server JSON with TS mock data.');
