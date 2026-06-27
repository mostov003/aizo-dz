const http = require('http');

http.get('http://localhost:3000/api/orders', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const orders = JSON.parse(data);
      console.log('✓ API Response Status:', res.statusCode);
      console.log('✓ Total orders:', orders.length);
      if (orders.length > 0) {
        console.log('✓ First order ID:', orders[0].id);
        console.log('✓ First order status:', orders[0].status);
        console.log('\n📊 Order statuses:');
        const statuses = {};
        orders.forEach(o => {
          statuses[o.status] = (statuses[o.status] || 0) + 1;
        });
        Object.entries(statuses).forEach(([status, count]) => {
          console.log('   - ' + status + ': ' + count);
        });
      }
    } catch(err) {
      console.error('Parse error:', err.message);
    }
  });
}).on('error', err => console.error('Request error:', err.message));
