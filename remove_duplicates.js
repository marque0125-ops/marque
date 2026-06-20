const fs = require('fs');
const lines = fs.readFileSync('src/data/mockData.ts', 'utf8').split('\n');

// 0-indexed: line 1466 is index 1465. Line 2801 is index 2800.
// We want to remove lines 1466 to 2801 (inclusive), which correspond to indices 1465 to 2800.
const newLines = [
  ...lines.slice(0, 1465), // keep up to line 1465 (index 1464)
  ...lines.slice(2801)     // keep from line 2802 (index 2801)
];

fs.writeFileSync('src/data/mockData.ts', newLines.join('\n'));
console.log('Removed unwanted mock data.');
