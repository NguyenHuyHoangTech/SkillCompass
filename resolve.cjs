const fs = require('fs');

const files = [
  'server/data/roadmapData.json',
  'src/App.tsx',
  'src/components/layout/SidebarNav.tsx',
  'src/components/layout/TopNavbar.tsx',
  'src/components/pages/QuizLibraryPage.tsx',
  'src/components/pages/SettingsPage.tsx',
  'src/index.css',
  'src/pages/Onboarding.tsx',
  'src/pages/Roadmap.tsx',
  'src/services/ai.ts'
];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('<<<<<<< HEAD')) continue;

    let newContent = '';
    let state = 'normal'; // normal, head, remote

    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('<<<<<<< HEAD')) {
        state = 'head';
      } else if (line.startsWith('=======')) {
        state = 'remote';
      } else if (line.startsWith('>>>>>>> ')) {
        state = 'normal';
      } else {
        if (state === 'normal' || state === 'head') {
          // Keep normal code and HEAD code
          newContent += line + (i === lines.length - 1 ? '' : '\n');
        }
      }
    }
    fs.writeFileSync(file, newContent, 'utf-8');
    console.log(`Resolved: ${file}`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
}
