const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'uploads', 'design-AZ-809239-0.png');
console.log('File path:', file);
console.log('Exists:', fs.existsSync(file));
if (fs.existsSync(file)) {
  const stats = fs.statSync(file);
  console.log('Size:', stats.size, 'bytes');
}
