/**
 * 🧪 اختبار رفع الصور وظهورها في الداشبورد
 * Test image upload and display in dashboard
 */

const fs = require('fs');
const path = require('path');

// Create a simple test image (100x100 PNG with red color)
const createSimpleImage = () => {
  // Create a minimal PNG: 1x1 red pixel
  // PNG header + IHDR chunk + IDAT chunk + IEND chunk
  const pngData = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,  // PNG signature
    0x00, 0x00, 0x00, 0x0d,                           // IHDR chunk size
    0x49, 0x48, 0x44, 0x52,                           // IHDR
    0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0x64,  // 100x100
    0x08, 0x02, 0x00, 0x00, 0x00,                     // 8-bit RGB
    0x4d, 0x57, 0xc2, 0x0c,                           // CRC
    0x00, 0x00, 0x00, 0x48,                           // IDAT chunk size
    0x49, 0x44, 0x41, 0x54,                           // IDAT
    0x78, 0x9c, 0xed, 0xc1, 0x01, 0x0d, 0x00, 0x00,  // zlib header + compressed data
    0x00, 0xc2, 0xa0, 0xf5, 0x4f, 0xed, 0x61, 0x0d,  // compressed red pixels
    0xa0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0xff, 0xff, 0x03, 0x00, 0x00,
    0x60, 0x00, 0x60, 0xb2, 0x20, 0xdc, 0x5b,          // CRC
    0x00, 0x00, 0x00, 0x00,                           // IEND chunk size
    0x49, 0x45, 0x4e, 0x44,                           // IEND
    0xae, 0x42, 0x60, 0x82                            // IEND CRC
  ]);

  return pngData;
};

// Create test image
const testImagePath = path.join(__dirname, 'test-upload.png');
const imageBuffer = createSimpleImage();
fs.writeFileSync(testImagePath, imageBuffer);

console.log('✅ Test image created:');
console.log(`   Path: ${testImagePath}`);
console.log(`   Size: ${imageBuffer.length} bytes`);

// Convert to base64
const base64 = imageBuffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64}`;

console.log('\n📝 Data URL (first 100 chars):');
console.log(`   ${dataUrl.substring(0, 100)}...`);

// Create test order
const testOrder = {
  id: 'AZ-' + Math.floor(100000 + Math.random() * 900000),
  date: new Date().toISOString(),
  items: [{
    id: 1,
    name: 'T-Shirt',
    price: 5000,
    color: 'Black',
    size: 'M',
    quantity: 1
  }],
  total: 5000,
  status: 'Pending',
  customer: {
    name: 'Test Customer',
    firstName: 'Test',
    surname: 'Customer',
    fullName: 'Test Customer',
    email: 'test@example.com',
    phone: '0123456789',
    wilaya: 'Alger',
    address: 'Alger',
    delivery: 'Tract'
  },
  customOrder: {
    color: 'Black',
    size: 'M',
    serviceType: 'DTG',
    mockupSnapshot: dataUrl,  // Include the base64 image
    layers: [
      {
        area: 'Center',
        left: 240,
        top: 260,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
        img: dataUrl  // Include the base64 image in layer
      }
    ],
    customer: {
      name: 'Test',
      surname: 'Customer',
      email: 'test@example.com',
      phone: '0123456789',
      province: 'Alger',
      notes: 'Test order for image upload'
    }
  }
};

// Save test order
console.log('\n📦 Creating test order:');
console.log(`   Order ID: ${testOrder.id}`);
console.log(`   Customer: ${testOrder.customer.fullName}`);
console.log(`   Items: ${testOrder.items.length}`);
console.log(`   Layers: ${testOrder.customOrder.layers.length}`);

// Save as JSON for manual testing
const jsonPath = path.join(__dirname, 'test-order-upload.json');
fs.writeFileSync(jsonPath, JSON.stringify(testOrder, null, 2));
console.log(`   Saved to: ${jsonPath}`);

// Display curl command for manual testing
console.log('\n🧪 To test manually, use this curl command:');
console.log(`\ncurl -X POST http://localhost:3000/api/orders \\`);
console.log(`  -H "Content-Type: application/json" \\`);
console.log(`  -d '${JSON.stringify(testOrder)}'`);

console.log('\n✅ Setup complete! Now you can:');
console.log('1. Use the curl command above to create the test order');
console.log('2. Go to admin.html and check if the image appears');
console.log('3. Click on the custom order to view the design');

module.exports = { testOrder, testImagePath, dataUrl };
