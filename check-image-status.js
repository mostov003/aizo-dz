/**
 * 🔍 تشخيص مشكلة الصور في الداشبورد
 * Debug image display issue in custom orders
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchOrders(callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/orders',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        callback(null, JSON.parse(data));
      } catch (e) {
        callback(e);
      }
    });
  });

  req.on('error', callback);
  req.end();
}

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                  🔍 تشخيص مشكلة الصور في الطلبات المخصصة                   ║
║                     Debug Custom Order Image Display                       ║
╚════════════════════════════════════════════════════════════════════════════╝
`);

console.log('\n📋 جلب جميع الطلبات...\n');

fetchOrders((err, orders) => {
  if (err) {
    console.error('❌ خطأ:', err.message);
    process.exit(1);
  }

  console.log(`✅ تم جلب ${orders.length} طلب`);
  
  const customOrders = orders.filter(o => o.customOrder);
  console.log(`📊 عدد الطلبات المخصصة: ${customOrders.length}\n`);
  
  if (customOrders.length === 0) {
    console.log('⚠️  لا توجد طلبات مخصصة!');
    process.exit(0);
  }
  
  // Analysis
  let totalLayers = 0;
  let layersWithBase64 = 0;
  let layersWithLinks = 0;
  let missingFiles = 0;

  customOrders.forEach((order, idx) => {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`📦 الطلب ${idx + 1}: ${order.id} (${order.customOrder?.customer?.name || 'N/A'})`);
    
    const co = order.customOrder;
    
    if (co.layers && co.layers.length > 0) {
      console.log(`   التصاميم: ${co.layers.length}`);
      
      co.layers.forEach((layer, lIdx) => {
        totalLayers++;
        console.log(`\n   🎯 تصميم ${lIdx + 1}:`);
        console.log(`      • المنطقة: ${layer.area}`);
        
        if (layer.img) {
          if (layer.img.startsWith('data:')) {
            layersWithBase64++;
            console.log(`      • الصورة: Base64 (${(layer.img.length / 1024).toFixed(1)} KB) ⚠️`);
          } else if (layer.img.startsWith('/uploads/')) {
            layersWithLinks++;
            const fullPath = path.join(__dirname, layer.img);
            if (fs.existsSync(fullPath)) {
              const size = fs.statSync(fullPath).size;
              console.log(`      • الصورة: ✅ ${layer.img} (${(size / 1024).toFixed(1)} KB)`);
            } else {
              missingFiles++;
              console.log(`      • الصورة: ❌ ${layer.img} (الملف غير موجود!)`);
            }
          } else {
            console.log(`      • الصورة: ${layer.img.substring(0, 40)}...`);
          }
        } else {
          console.log(`      • الصورة: ❌ فارغة`);
        }
      });
    }
  });
  
  // Summary
  console.log(`\n\n${'═'.repeat(80)}`);
  console.log(`📊 الملخص`);
  console.log(`${'═'.repeat(80)}`);
  console.log(`\n✅ إجمالي التصاميم: ${totalLayers}`);
  console.log(`   • Base64: ${layersWithBase64} ⚠️`);
  console.log(`   • روابط: ${layersWithLinks} ✅`);
  console.log(`   • ملفات مفقودة: ${missingFiles} ❌\n`);
  
  // Check uploads dir
  const uploadsDir = path.join(__dirname, 'uploads');
  let uploadFiles = 0;
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir).filter(f => f.startsWith('design-') || f.startsWith('mockup-'));
    uploadFiles = files.length;
    console.log(`📁 ملفات في /uploads: ${files.length}`);
  }
  
  // Diagnosis
  console.log(`\n💡 التشخيص:`);
  if (layersWithBase64 > 0 && layersWithLinks === 0) {
    console.log(`⚠️  الصور لم تُحفظ كملفات - المشكلة في saveBase64Image أو مجلد /uploads`);
  } else if (missingFiles > 0) {
    console.log(`❌ بعض الملفات مفقودة من /uploads`);
  } else if (layersWithLinks === totalLayers) {
    console.log(`✅ جميع الصور محفوظة بشكل صحيح في /uploads`);
    console.log(`\n🔍 إذا لم تظهر الصور في الداشبورد، قد تكون المشكلة في:`);
    console.log(`   • reresolveAssetUrl في admin.html`);
    console.log(`   • مشكلة في عرض الصور (CSS)  `);
    console.log(`   • مشكلة في تحميل الصور من السيرفر`);
  }
  
  process.exit(0);
});
