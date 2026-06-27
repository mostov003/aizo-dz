async function check() {
  const res = await fetch('http://localhost:3000/api/orders');
  const orders = await res.json();
  console.log('First order returned from GET /api/orders:', JSON.stringify(orders[0], null, 2));
}
check();
