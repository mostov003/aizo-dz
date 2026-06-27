const fs = require('fs');
const path = require('path');

const orders = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/orders.json'), 'utf8'));
const customOrders = orders.filter(o => o.customOrder);
console.log(`JSON orders count: ${orders.length}`);
console.log(`JSON custom orders count: ${customOrders.length}`);
if (customOrders.length > 0) {
  console.log('JSON custom order sample:', JSON.stringify(customOrders[customOrders.length - 1], null, 2));
}
