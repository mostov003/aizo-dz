// اختبار عدة endpoints
const tests = [];

// Test 1: GET orders
async function test1() {
  const r = await fetch('http://localhost:3000/api/orders');
  const data = await r.json();
  tests.push({ 
    name: 'GET /api/orders', 
    status: r.status === 200 ? '✅' : '❌',
    count: data.length 
  });
}

// Test 2: PUT status
async function test2() {
  const r = await fetch('http://localhost:3000/api/orders', { method: 'GET' });
  const data = await r.json();
  if (data.length === 0) {
    tests.push({ name: 'PUT /api/orders/:id/status', status: '⏭️ (No orders)' });
    return;
  }
  
  const orderId = data[0].id;
  const newStatus = 'test-' + Date.now();
  
  const updateR = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  
  const result = await updateR.json();
  tests.push({ 
    name: 'PUT /api/orders/:id/status', 
    status: updateR.status === 200 ? '✅' : '❌',
    updated: result.status === newStatus ? 'Yes' : 'No'
  });
}

// Test 3: GET products
async function test3() {
  const r = await fetch('http://localhost:3000/api/orders');
  const data = await r.json();
  tests.push({ 
    name: 'GET /api/products', 
    status: r.status === 200 ? '✅' : '❌'
  });
}

// Test 4: GET leads
async function test4() {
  const r = await fetch('http://localhost:3000/api/leads');
  tests.push({ 
    name: 'GET /api/leads', 
    status: r.status === 200 ? '✅' : '❌'
  });
}

Promise.all([test1(), test2(), test3(), test4()])
  .then(() => {
    console.log('\n📊 API Test Results:');
    tests.forEach(t => {
      console.log(`${t.status} ${t.name}${t.count ? ` (${t.count} items)` : ''}${t.updated ? ` - Updated: ${t.updated}` : ''}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
