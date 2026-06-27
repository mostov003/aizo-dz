/**
 * Simple Migration Script using native PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// قراءة DATABASE_URL من .env
const envPath = path.join(__dirname, '.env');
let databaseUrl = null;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    if (line.includes('DATABASE_URL')) {
      const [, value] = line.split('=');
      databaseUrl = value.trim().replace(/^["']|["']$/g, '');
    }
  }
}

if (!databaseUrl) {
  databaseUrl = "postgresql://aizo:CHANGE_THIS_STRONG_PASSWORD@localhost:5432/aizo_dz";
}

console.log('✅ DATABASE_URL:', databaseUrl.substring(0, 50) + '***');

const client = new Client({
  connectionString: databaseUrl,
});

// Helper function to read JSON file
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`❌ خطأ في قراءة ${filePath}:`, err.message);
    return [];
  }
}

// Main migration
async function runMigration() {
  try {
    await client.connect();
    console.log('✅ متصل بقاعدة البيانات');

    // Test connection
    const result = await client.query('SELECT NOW()');
    console.log('✅ اختبار الاتصال:', result.rows[0]);

    const line = '═'.repeat(50);
    console.log(`\n${line}`);
    console.log('🚀 بدء نقل البيانات إلى PostgreSQL');
    console.log(`${line}`);

    // Read JSON files
    const ordersPath = path.join(__dirname, 'db', 'orders.json');
    const leadsPath = path.join(__dirname, 'db', 'leads.json');
    const productsPath = path.join(__dirname, 'db', 'custom_products.json');

    const orders = readJsonFile(ordersPath);
    const leads = readJsonFile(leadsPath);
    const products = readJsonFile(productsPath);

    console.log(`\n📦 الطلبات المكتشفة: ${orders.length}`);
    console.log(`📧 الرسائل المكتشفة: ${leads.length}`);
    console.log(`🛍️ المنتجات المكتشفة: ${products.length}`);

    console.log('\n✅ تم قراءة البيانات بنجاح!');
    console.log('\n⚠️ ملاحظة: لم تتم البيانات بعد. تحتاج لتشغيل migrate-to-postgres.js باستخدام Prisma.');

  } catch (err) {
    console.error('❌ خطأ:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
