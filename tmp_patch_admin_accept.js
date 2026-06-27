const fs = require('fs');
const path = 'admin.html';
const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);
const patches = [
  { index: 2329, from: "              + '    <button class=\"dropdown-item\" onclick=\"window.changeOrderStatus(\\'" + order.id + "\\', \\\'en attente\\\')\">✓ قبول الطلب / Accept</button>'", to: "              + '    <button class=\"dropdown-item\" onclick=\"window.changeOrderStatus(\\'" + order.id + "\\', \\\'confirmé\\\')\">✓ قبول الطلب / Accept</button>'" },
  { index: 2549, from: "              + '    <button class=\"dropdown-item\" onclick=\"window.changeOrderStatus(\\'" + order.id + "\\', \\\'en attente\\\')\">✓ قبول الطلب / Accept</button>'", to: "              + '    <button class=\"dropdown-item\" onclick=\"window.changeOrderStatus(\\'" + order.id + "\\', \\\'confirmé\\\')\">✓ قبول الطلب / Accept</button>'" }
];
for (const patch of patches) {
  if (lines[patch.index] === patch.from) {
    lines[patch.index] = patch.to;
  } else {
    console.error('Mismatch at line', patch.index + 1);
    console.error('Current:', lines[patch.index]);
    process.exit(1);
  }
}
fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('patched', patches.length, 'lines');
