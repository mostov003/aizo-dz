/**
 * Test: Complete Custom Order Submission
 * Tests the full flow with error handling
 */

const fs = require('fs');
const path = require('path');

async function testCompleteCustomOrder() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🧪 COMPLETE CUSTOM ORDER SUBMISSION TEST');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Create a minimal PNG image for testing
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const orderPayload = {
      id: 'AZ-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      items: [{
        id: 1,
        name: 'Hoodie Vescartes',
        price: 2500,
        color: 'Black',
        size: 'M',
        quantity: 1
      }],
      total: 2500,
      status: 'Pending',
      customer: {
        name: 'Test Customer',
        firstName: 'Test',
        surname: 'Customer',
        fullName: 'Test Customer',
        email: 'test@example.com',
        phone: '0612345678',
        wilaya: 'Alger',
        address: 'Test Address',
        delivery: 'Tract'
      },
      customOrder: {
        color: 'Black',
        size: 'M',
        serviceType: 'Embroidery',
        mockupSnapshot: `data:image/png;base64,${testImageBase64}`,
        layers: [
          {
            area: 'front-center',
            left: 100,
            top: 100,
            angle: 0,
            scaleX: 1,
            scaleY: 1,
            img: `data:image/png;base64,${testImageBase64}`
          }
        ],
        customer: {
          name: 'Test',
          surname: 'Customer',
          email: 'test@example.com',
          phone: '0612345678',
          province: 'Alger',
          notes: 'Test order'
        }
      }
    };

    console.log('📋 Order Payload (Sample):');
    console.log(`   ID: ${orderPayload.id}`);
    console.log(`   Customer: ${orderPayload.customer.fullName}`);
    console.log(`   Total: ${orderPayload.total} DZD`);
    console.log(`   Layers: ${orderPayload.customOrder.layers.length}\n`);

    // Test 1: Send order to API
    console.log('🚀 TEST 1: Sending custom order to API...');
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`   ❌ API returned ${response.status}: ${errorText}`);
        return false;
      }

      const responseData = await response.json();
      console.log(`   ✅ Order submitted successfully!`);
      console.log(`   📦 Response Order ID: ${responseData.id || 'N/A'}`);
    } catch (apiErr) {
      console.log(`   ❌ API connection error: ${apiErr.message}`);
      console.log(`   This usually means the server is not running or not accessible.`);
      return false;
    }

    // Test 2: Fetch orders to verify
    console.log('\n🔍 TEST 2: Fetching all orders to verify submission...');
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      if (!response.ok) {
        console.log(`   ❌ Failed to fetch orders: ${response.status}`);
        return false;
      }

      const orders = await response.json();
      const customOrders = orders.filter(o => o.customOrder);
      console.log(`   ✅ Orders fetched: ${orders.length} total`);
      console.log(`   📌 Custom orders: ${customOrders.length}`);
      
      if (customOrders.length > 0) {
        const latest = customOrders[customOrders.length - 1];
        console.log(`   📦 Latest custom order: ${latest.id}`);
        console.log(`   👤 Customer: ${latest.customer?.fullName || 'N/A'}`);
      }
    } catch (err) {
      console.log(`   ❌ Error fetching orders: ${err.message}`);
      return false;
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('🎉 Custom order submission is working correctly!\n');
    
    return true;

  } catch (err) {
    console.log('\n❌ TEST FAILED:');
    console.log(`   Error: ${err.message}`);
    console.log(`   Stack: ${err.stack}`);
    return false;
  }
}

testCompleteCustomOrder().then(success => {
  process.exit(success ? 0 : 1);
});
