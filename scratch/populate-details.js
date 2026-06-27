const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    const ordersPath = path.join(__dirname, '../db/orders.json');
    if (!fs.existsSync(ordersPath)) {
      console.log('orders.json not found!');
      return;
    }
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    console.log(`Loaded ${orders.length} orders from orders.json`);
    
    let updated = 0;
    for (const order of orders) {
      if (order.customOrder && typeof order.customOrder === 'object') {
        const orderId = order.id;
        const customOrderDetails = JSON.stringify(order.customOrder);
        
        // Find if this order exists in DB by orderNumber or id
        const checkRes = await pool.query('SELECT id FROM "Order" WHERE "orderNumber" = $1 OR id = $1', [orderId]);
        if (checkRes.rows.length > 0) {
          const dbId = checkRes.rows[0].id;
          await pool.query('UPDATE "Order" SET "customOrderDetails" = $1 WHERE id = $2', [customOrderDetails, dbId]);
          updated++;
        }
      }
    }
    console.log(`Updated ${updated} custom orders with full details in database.`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

run();
