#!/usr/bin/env node
const fs = require('fs');

const filepath = 'c:\\Users\\pc\\Desktop\\aizo-dz\\admin.html';
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);

// Target lines (1-indexed to 0-indexed): 2330 -> 2329, 2550 -> 2549
const lineNumbers = [2329, 2549];

for (const lineNum of lineNumbers) {
  if (lineNum >= lines.length) {
    console.error(`Line ${lineNum + 1} exceeds file length ${lines.length}`);
    continue;
  }
  const line = lines[lineNum];
  console.log(`\nLine ${lineNum + 1}:`);
  console.log(`  Contains "en attente": ${line.includes('en attente')}`);
  if (line.includes('en attente')) {
    lines[lineNum] = line.replace('en attente', 'confirmé');
    console.log(`  ✓ Replaced`);
  } else {
    console.log(`  ✗ Not found - skipping`);
  }
}

fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
console.log('\n✓ File saved');
