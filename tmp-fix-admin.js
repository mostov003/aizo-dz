const fs = require('fs');
const path = 'admin.html';
const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);
const locations = [2329, 2549];
for (const idx of locations) {
  const line = lines[idx];
  if (!line.includes("en attente")) {
    throw new Error(`Expected en attente at line ${idx + 1}, found: ${line}`);
  }
  lines[idx] = line.replace("en attente", "confirmé");
}
fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Patched lines:', locations.map(i => i+1).join(', '));
