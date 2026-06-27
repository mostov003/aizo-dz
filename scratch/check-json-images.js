const fs = require('fs');
const path = require('path');
const orders = JSON.parse(fs.readFileSync('db/orders.json', 'utf8'));
const customOrders = orders.filter(o => o.customOrder);
console.log('Total custom orders in JSON:', customOrders.length);
if (customOrders.length > 0) {
  const sample = customOrders.slice(0, 3);
  sample.forEach(o => {
    console.log(`Order: ${o.id}`);
    console.log(`Mockup: ${o.customOrder.mockupSnapshot}`);
    if (o.customOrder.layers) {
      o.customOrder.layers.forEach((l, idx) => {
        console.log(`  Layer ${idx}: img=${l.img}, imageUrl=${l.imageUrl}`);
      });
    }
  });
}
