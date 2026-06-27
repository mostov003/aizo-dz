const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  try {
    const res = await pool.query('SELECT * FROM "CustomLayer" LIMIT 5');
    console.log('Custom layers:', res.rows);
    
    const itemsRes = await pool.query('SELECT * FROM "OrderItem" LIMIT 5');
    console.log('Order items:', itemsRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

test();
