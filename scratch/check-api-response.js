async function check() {
  const res = await fetch('http://localhost:3000/api/orders');
  const orders = await res.json();
  const customOrders = orders.filter(o => o.customOrder);
  console.log(`Total orders: ${orders.length}`);
  console.log(`Custom orders: ${customOrders.length}`);
  if (customOrders.length > 0) {
    console.log('Sample custom order:', JSON.stringify(customOrders[0], null, 2));
  }
}

check();
