const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  try {
    console.log('Altering table Order to add customOrderDetails jsonb...');
    const res = await pool.query('ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customOrderDetails" jsonb');
    console.log('Success:', res);
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    await pool.end();
  }
}

test();
