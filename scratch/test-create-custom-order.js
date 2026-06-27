const fs = require('fs');
const path = require('path');
const db = require('../utils/db');

async function testNewCustomOrder() {
  const orderId = 'AZ-TEST-1234';
  
  // A tiny 1x1 transparent PNG pixel base64 as mockup and design
  const base64Png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const orderPayload = {
    id: orderId,
    orderNumber: orderId,
    date: new Date().toISOString(),
    total: 3900,
    status: 'Pending',
    customerName: 'Test Customer',
    customerPhone: '0555123456',
    customerEmail: 'test@customer.com',
    customerWilaya: '16 - Alger',
    customerAddress: '16 - Alger',
    delivery: 'Home',
    items: [{
      id: 1,
      name: 'T-Shirt Custom',
      price: 3900,
      color: 'Noir',
      size: 'L',
      quantity: 1
    }],
    customOrder: {
      color: 'Noir',
      size: 'L',
      serviceType: 'Print',
      mockupSnapshot: base64Png,
      layers: [{
        area: 'Center',
        left: 240,
        top: 260,
        angle: 15,
        scaleX: 0.5,
        scaleY: 0.5,
        img: base64Png
      }],
      customer: {
        name: 'Test',
        surname: 'Customer',
        email: 'test@customer.com',
        phone: '0555123456',
        province: '16 - Alger'
      }
    }
  };

  console.log('Sending mock order request to local server...');
  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errText}`);
    }

    const createdOrder = await response.json();
    console.log('Order created on server successfully:', createdOrder.id);

    // Verify files created in uploads/
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const mockupFile = path.join(uploadsDir, `mockup-${createdOrder.id}.png`);
    const designFile = path.join(uploadsDir, `design-${createdOrder.id}-0.png`);

    console.log('Checking mockup file existence:', fs.existsSync(mockupFile));
    console.log('Checking design file existence:', fs.existsSync(designFile));

    // Verify DB details
    const pgOrders = await db.query('SELECT * FROM "Order" WHERE id = $1', [createdOrder.id]);
    console.log('Order details in PostgreSQL:', JSON.stringify(pgOrders[0]?.customOrderDetails, null, 2));

    // Clean up
    if (fs.existsSync(mockupFile)) fs.unlinkSync(mockupFile);
    if (fs.existsSync(designFile)) fs.unlinkSync(designFile);
    await db.query('DELETE FROM "CustomLayer" WHERE "orderId" = $1', [createdOrder.id]);
    await db.query('DELETE FROM "OrderItem" WHERE "orderId" = $1', [createdOrder.id]);
    await db.query('DELETE FROM "Order" WHERE id = $1', [createdOrder.id]);
    console.log('Cleaned up test data.');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    db.closeDb();
  }
}

testNewCustomOrder();
