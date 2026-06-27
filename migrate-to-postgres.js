/**
 * Database Migration Script
 * نقل البيانات من JSON إلى PostgreSQL
 * 
 * استخدم: node migrate-to-postgres.js
 */

// تحميل .env أولاً
const fs = require('fs');
const path = require('path');

// قراءة .env يدويّاً
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && value) {
        process.env[key.trim()] = value;
      }
    }
  }
}

// تأكد من تعيين DATABASE_URL
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://aizo:CHANGE_THIS_STRONG_PASSWORD@localhost:5432/aizo_dz";
}

console.log('✅ DATABASE_URL loaded:', process.env.DATABASE_URL.substring(0, 50) + '***');

const { prisma } = require('./utils/db');

const DB_DIR = path.join(__dirname, 'db');
const ORDERS_FILE = path.join(DB_DIR, 'orders.json');
const LEADS_FILE = path.join(DB_DIR, 'leads.json');
const PRODUCTS_FILE = path.join(DB_DIR, 'custom_products.json');

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
async function migrateOrders() {
  console.log('\n📦 جاري نقل الطلبات...');
  const orders = readJsonFile(ORDERS_FILE);
  
  let successCount = 0;
  let errorCount = 0;

  for (const order of orders) {
    try {
      await prisma.order.create({
        data: {
          orderNumber: order.id || generateOrderNumber(),
          customerName: order.customer?.name || order.customerName || 'Unknown',
          customerPhone: order.customer?.phone || order.customerPhone || '',
          customerEmail: order.customer?.email || order.customerEmail,
          customerWilaya: order.customer?.wilaya || order.wilaya || '',
          customerAddress: order.customer?.address || order.address,
          delivery: order.customer?.delivery || order.delivery || 'Home',
          deliveryOffice: order.customer?.deliveryOffice,
          
          subtotal: order.subtotal || 0,
          shippingCost: order.shippingCost || 0,
          total: order.total || 0,
          
          status: order.status || 'en attente',
          notes: order.notes,
          customOrder: !!order.customOrder,
          customOrderDetails: order.customOrder ? order.customOrder : null,
          
          trackingNumber: order.trackingNumber,
          zrParcelId: order.zrParcelId,
          zrStatus: order.zrStatus,
          
          createdAt: order.createdAt || new Date(),
          shippedAt: order.shippedAt,
          lastSyncedAt: order.lastSyncedAt,
          
          items: {
            create: (order.items || []).map(item => ({
              productId: item.id || 0,
              productName: item.name || '',
              color: item.color,
              size: item.size,
              quantity: item.quantity || 1,
              price: item.price || 0,
            })),
          },
          
          customLayers: order.customOrder?.layers
            ? {
                create: order.customOrder.layers.map((layer, idx) => ({
                  layerIndex: idx,
                  imageUrl: layer.img || layer.imageUrl || '',
                  area: layer.area,
                  text: layer.text,
                })),
              }
            : undefined,
        },
      });
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
async function migrateLeads() {
  console.log('\n📧 جاري نقل الرسائل...');
  const leads = readJsonFile(LEADS_FILE);
  
  let successCount = 0;
  let errorCount = 0;

  for (const lead of leads) {
    try {
      await prisma.lead.create({
        data: {
          email: lead.email,
          name: lead.name,
          message: lead.message,
        },
      });
      successCount++;
      console.log(`  ✅ تم نقل البريد: ${lead.email}`);
    } catch (err) {
      if (err.code === 'P2002') {
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
async function migrateProducts() {
  console.log('\n🛍️ جاري نقل المنتجات...');
  const products = readJsonFile(PRODUCTS_FILE);
  
  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      await prisma.product.create({
        data: {
          productId: product.productId || Math.random() * 10000,
          name: product.name || '',
          price: product.price || 0,
          description: product.description,
          image: product.image,
          sizes: product.sizes || [],
          colors: product.colors || [],
          customizable: product.customizable || false,
        },
      });
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
  const line = '═'.repeat(50);
  console.log(`\n${line}`);
  console.log('  🚀 بدء نقل البيانات إلى PostgreSQL');
  console.log(`${line}`);

  try {
    await migrateOrders();
    await migrateLeads();
    await migrateProducts();
    
    console.log(`\n${line}`);
    console.log('  ✅ انتهى النقل بنجاح!');
    console.log(`${line}\n`);
  } catch (err) {
    console.error('\n❌ خطأ عام:', err);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
runMigration();
