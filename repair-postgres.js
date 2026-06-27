/**
 * Database Repair Script
 * updates customOrderDetails and CustomLayer imageUrl in PostgreSQL using db/orders.json
 */

const fs = require('fs');
const path = require('path');
const db = require('./utils/db');

async function repairDatabase() {
  const line = '═'.repeat(60);
  console.log(`\n${line}`);
  console.log('🔧 Starting PostgreSQL Database Repair...');
  console.log(`${line}`);

  const ordersFile = path.join(__dirname, 'db', 'orders.json');
  if (!fs.existsSync(ordersFile)) {
    console.error('❌ db/orders.json not found!');
    db.closeDb();
    return;
  }

  let orders = [];
  try {
    orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  } catch (err) {
    console.error('❌ Error parsing db/orders.json:', err.message);
    db.closeDb();
    return;
  }

  let repairedOrders = 0;
  let repairedLayers = 0;

  for (const order of orders) {
    if (!order.customOrder) continue;

    try {
      // Find the corresponding order in pg by orderNumber
      const pgOrders = await db.query('SELECT id, "customOrderDetails" FROM "Order" WHERE "orderNumber" = $1', [order.id]);
      if (pgOrders.length === 0) {
        console.warn(`  ⚠️ Order ${order.id} not found in PostgreSQL database`);
        continue;
      }

      const pgOrder = pgOrders[0];
      const customOrderDetailsStr = JSON.stringify(order.customOrder);

      // 1. Update Order customOrderDetails
      await db.query(
        'UPDATE "Order" SET "customOrderDetails" = $1, "customOrder" = true WHERE id = $2',
        [customOrderDetailsStr, pgOrder.id]
      );
      repairedOrders++;

      // 2. Update CustomLayer imageUrls
      if (order.customOrder.layers && Array.isArray(order.customOrder.layers)) {
        for (let idx = 0; idx < order.customOrder.layers.length; idx++) {
          const layer = order.customOrder.layers[idx];
          const imgUrl = layer.img || layer.imageUrl || '';
          
          // Try to update the corresponding CustomLayer row
          const updateResult = await db.query(
            'UPDATE "CustomLayer" SET "imageUrl" = $1, area = $2 WHERE "orderId" = $3 AND "layerIndex" = $4 RETURNING id',
            [imgUrl, layer.area || null, pgOrder.id, idx]
          );

          if (updateResult.length === 0) {
            // If the row doesn't exist, insert it
            const layerId = require('crypto').randomBytes(8).toString('hex');
            await db.query(
              'INSERT INTO "CustomLayer" (id, "orderId", "layerIndex", "imageUrl", area, text) VALUES ($1, $2, $3, $4, $5, $6)',
              [layerId, pgOrder.id, idx, imgUrl, layer.area || null, layer.text || null]
            );
          }
          repairedLayers++;
        }
      }

      console.log(`  ✅ Repaired Custom Order: ${order.id}`);
    } catch (err) {
      console.error(`  ❌ Error repairing order ${order.id}:`, err.message);
    }
  }

  console.log(`\n${line}`);
  console.log('🎉 Database Repair Completed Successfully!');
  console.log(`   repaired orders: ${repairedOrders}`);
  console.log(`   repaired layers: ${repairedLayers}`);
  console.log(`${line}\n`);

  db.closeDb();
}

repairDatabase().catch(err => {
  console.error('Fatal error during repair:', err);
  db.closeDb();
});
