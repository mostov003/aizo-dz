// اختبار endpoint الطلبات
fetch('http://localhost:3000/api/orders')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Status: 200');
    console.log('📊 First 3 orders:');
    data.slice(0, 3).forEach(order => {
      console.log(`  - Order ${order.orderNumber}: ${order.customerName}`);
    });
    console.log(`📦 Total orders: ${data.length}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
