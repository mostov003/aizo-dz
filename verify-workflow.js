#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 WORKFLOW SYSTEM VERIFICATION\n');
console.log('=' .repeat(50));

// 1. Check admin.html has the workflow code
const adminHtml = fs.readFileSync('./admin.html', 'utf8');

const checks = {
  'Workflow Step 1 header': () => adminHtml.includes('خطوة 1: القبول'),
  'Workflow Step 2 header': () => adminHtml.includes('خطوة 2: التأكيد'),
  'Workflow Step 3 header': () => adminHtml.includes('خطوة 3: الشحن'),
  'Accept button text': () => adminHtml.includes('قبول الطلب / Accept'),
  'Confirm button text': () => adminHtml.includes('تأكيد الطلب / Confirm'),
  'Shipped button text': () => adminHtml.includes('تم الشحن / Shipped'),
  'Not Shipped button text': () => adminHtml.includes('لم يتم الشحن / Not Shipped'),
  'New status mapping (en attente)': () => adminHtml.includes("'en attente'"),
  'New status mapping (confirmé)': () => adminHtml.includes("'confirmé'"),
  'New status mapping (livré)': () => adminHtml.includes("'livré'"),
  'Conditional status check': () => adminHtml.includes('if (!order.status || order.status === \'Pending\')'),
  'Filter logic for new statuses': () => adminHtml.includes('o.status === \'en attente\'')
};

let passCount = 0;
let failCount = 0;

console.log('\n📋 CODE VERIFICATION CHECKS:\n');

for (const [check, testFn] of Object.entries(checks)) {
  const passed = testFn();
  if (passed) {
    console.log(`  ✓ ${check}`);
    passCount++;
  } else {
    console.log(`  ✗ ${check}`);
    failCount++;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed`);

// 2. Check database has test order
const orders = JSON.parse(fs.readFileSync('./db/orders.json', 'utf8'));
const testOrder = orders.find(o => o.id === 'AZ-TEST-WF');

console.log('\n📦 DATABASE VERIFICATION:\n');

if (testOrder) {
  console.log(`  ✓ Test order found: ${testOrder.id}`);
  console.log(`    - Status: ${testOrder.status}`);
  console.log(`    - Customer: ${testOrder.customer.name}`);
  console.log(`    - Amount: ${testOrder.total} DZD`);
  
  if (testOrder.status === 'Pending') {
    console.log('    ✓ Status is Pending (correct)');
  }
} else {
  console.log('  ✗ Test order not found');
}

// 3. Check other orders for new status values
const ordersWithNewStatus = orders.filter(o => 
  o.status && ['en attente', 'confirmé', 'livré', 'retourné', 'annulé'].includes(o.status)
);

if (ordersWithNewStatus.length > 0) {
  console.log(`\n  ℹ Found ${ordersWithNewStatus.length} orders with new workflow statuses`);
  ordersWithNewStatus.forEach(o => {
    console.log(`    - ${o.id}: ${o.status}`);
  });
}

// 4. Summary
console.log('\n' + '='.repeat(50));
console.log('\n✅ WORKFLOW SYSTEM STATUS\n');

if (passCount === Object.keys(checks).length && testOrder && testOrder.status === 'Pending') {
  console.log('🟢 READY FOR TESTING!');
  console.log('\nTo test the workflow:');
  console.log('  1. Open: http://localhost:3000/admin.html');
  console.log('  2. Navigate to Orders panel');
  console.log('  3. Find order AZ-TEST-WF (should be at top)');
  console.log('  4. Click "الإجراءات / Actions" dropdown');
  console.log('  5. Should see: ✓ قبول (Accept) & ✗ رفض (Reject)');
  console.log('  6. Click Accept to test workflow progression');
  console.log('\nExpected workflow:');
  console.log('  Pending → en attente → confirmé → livré');
} else {
  console.log('🔴 ISSUES FOUND');
  console.log(`  - Code checks passed: ${passCount}/${Object.keys(checks).length}`);
  console.log(`  - Test order ready: ${testOrder ? 'Yes' : 'No'}`);
  console.log(`  - Test order status correct: ${testOrder && testOrder.status === 'Pending' ? 'Yes' : 'No'}`);
}

console.log('\n' + '='.repeat(50) + '\n');
