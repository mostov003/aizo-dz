/**
 * Database Migration Script using pg driver
 * نقل البيانات من JSON إلى PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv/config');

// قراءة DATABASE_URL من .env أو استخدام قيمة افتراضية
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  databaseUrl = "postgresql://aizo:CHANGE_THIS_STRONG_PASSWORD@localhost:5432/aizo_dz";
}

console.log('✅ DATABASE_URL:', databaseUrl.substring(0, 50) + '***');

const pool = new Pool({
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

// Helper function to generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AZ-${timestamp}${random}`;
}

// Migrate orders
async function migrateOrders(client) {
  console.log('\n📦 جاري نقل الطلبات...');
  const orders = readJsonFile(path.join(__dirname, 'db', 'orders.json'));
  
  let successCount = 0;
  let errorCount = 0;

  for (const order of orders) {
    try {
      const orderData = {
        id: require('crypto').randomBytes(8).toString('hex'),
        orderNumber: order.id || generateOrderNumber(),
        customerName: order.customer?.name || order.customerName || 'Unknown',
        customerPhone: order.customer?.phone || order.customerPhone || '',
        customerEmail: order.customer?.email || order.customerEmail,
        customerWilaya: order.customer?.wilaya || order.wilaya || '',
        customerAddress: order.customer?.address || order.address,
        delivery: order.customer?.delivery || order.delivery || 'Home',
        deliveryOffice: order.customer?.deliveryOffice || null,
        subtotal: order.subtotal || 0,
        shippingCost: order.shippingCost || 0,
        total: order.total || 0,
        status: order.status || 'en attente',
        notes: order.notes || null,
        customOrder: !!order.customOrder,
        trackingNumber: order.trackingNumber || null,
        zrParcelId: order.zrParcelId || null,
        zrStatus: order.zrStatus ? JSON.stringify(order.zrStatus) : null,
        createdAt: new Date(order.createdAt || Date.now()),
        updatedAt: new Date(order.updatedAt || Date.now()),
        shippedAt: order.shippedAt ? new Date(order.shippedAt) : null,
        lastSyncedAt: order.lastSyncedAt ? new Date(order.lastSyncedAt) : null,
      };

      await client.query(
        `INSERT INTO "Order" (id, "orderNumber", "customerName", "customerPhone", "customerEmail", "customerWilaya", "customerAddress", delivery, "deliveryOffice", subtotal, "shippingCost", total, status, notes, "customOrder", "customOrderDetails", "trackingNumber", "zrParcelId", "zrStatus", "createdAt", "updatedAt", "shippedAt", "lastSyncedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
        [
          orderData.id, orderData.orderNumber, orderData.customerName, orderData.customerPhone, orderData.customerEmail,
          orderData.customerWilaya, orderData.customerAddress, orderData.delivery, orderData.deliveryOffice,
          orderData.subtotal, orderData.shippingCost, orderData.total, orderData.status, orderData.notes,
          orderData.customOrder, order.customOrder ? JSON.stringify(order.customOrder) : null, orderData.trackingNumber, orderData.zrParcelId, orderData.zrStatus,
          orderData.createdAt, orderData.updatedAt, orderData.shippedAt, orderData.lastSyncedAt,
        ]
      );

      // Insert items
      for (const item of (order.items || [])) {
        await client.query(
          `INSERT INTO "OrderItem" (id, "orderId", "productId", "productName", color, size, quantity, price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            require('crypto').randomBytes(8).toString('hex'),
            orderData.id,
            item.id || 0,
            item.name || '',
            item.color || null,
            item.size || null,
            item.quantity || 1,
            item.price || 0,
          ]
        );
      }

      // Insert custom layers
      if (order.customOrder?.layers) {
        for (let idx = 0; idx < order.customOrder.layers.length; idx++) {
          const layer = order.customOrder.layers[idx];
          await client.query(
            `INSERT INTO "CustomLayer" (id, "orderId", "layerIndex", "imageUrl", area, text)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              require('crypto').randomBytes(8).toString('hex'),
              orderData.id,
              idx,
              layer.img || layer.imageUrl || '',
              layer.area || null,
              layer.text || null,
            ]
          );
        }
      }

      successCount++;
      console.log(`  ✅ تم نقل الطلب: ${order.id}`);
    } catch (err) {
      errorCount++;
      console.error(`  ❌ خطأ في الطلب ${order.id}:`, err.message);
    }
  }
  
  console.log(`\n📊 نتائج نقل الطلبات:`);
  console.log(`   ✅ نجح: ${successCount}`);
  console.log(`   ❌ فشل: ${errorCount}`);
}

// Migrate leads
async function migrateLeads(client) {
  console.log('\n📧 جاري نقل الرسائل...');
  const leads = readJsonFile(path.join(__dirname, 'db', 'leads.json'));
  
  let successCount = 0;
  let errorCount = 0;

  for (const lead of leads) {
    try {
      await client.query(
        `INSERT INTO "Lead" (id, email, name, message) VALUES ($1, $2, $3, $4)`,
        [require('crypto').randomBytes(8).toString('hex'), lead.email, lead.name || null, lead.message || null]
      );
      successCount++;
      console.log(`  ✅ تم نقل البريد: ${lead.email}`);
    } catch (err) {
      if (err.code === '23505') {
        console.log(`  ⚠️ البريد موجود بالفعل: ${lead.email}`);
      } else {
        errorCount++;
        console.error(`  ❌ خطأ:`, err.message);
      }
    }
  }
  
  console.log(`\n📊 نتائج نقل الرسائل:`);
  console.log(`   ✅ نجح: ${successCount}`);
  console.log(`   ❌ فشل: ${errorCount}`);
}

// Migrate products
async function migrateProducts(client) {
  console.log('\n🛍️ جاري نقل المنتجات...');
  const products = readJsonFile(path.join(__dirname, 'db', 'custom_products.json'));
  
  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      await client.query(
        `INSERT INTO "Product" (id, productId, name, price, description, image, sizes, colors, customizable)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          require('crypto').randomBytes(8).toString('hex'),
          product.productId || Math.random() * 10000,
          product.name || '',
          product.price || 0,
          product.description || null,
          product.image || null,
          JSON.stringify(product.sizes || []),
          JSON.stringify(product.colors || []),
          product.customizable || false,
        ]
      );
      successCount++;
      console.log(`  ✅ تم نقل المنتج: ${product.name}`);
    } catch (err) {
      errorCount++;
      console.error(`  ❌ خطأ:`, err.message);
    }
  }
  
  console.log(`\n📊 نتائج نقل المنتجات:`);
  console.log(`   ✅ نجح: ${successCount}`);
  console.log(`   ❌ فشل: ${errorCount}`);
}

// Main migration function
async function runMigration() {
  const client = await pool.connect();
  
  try {
    const line = '═'.repeat(50);
    console.log(`\n${line}`);
    console.log('🚀 بدء نقل البيانات إلى PostgreSQL');
    console.log(`${line}`);

    await migrateOrders(client);
    await migrateLeads(client);
    await migrateProducts(client);
    
    console.log(`\n${line}`);
    console.log('✅ انتهى النقل بنجاح!');
    console.log(`${line}\n`);
  } catch (err) {
    console.error('\n❌ خطأ عام:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
runMigration().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
