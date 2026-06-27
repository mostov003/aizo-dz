#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n' + '═'.repeat(70));
console.log('🔄 إضافة طلبات اختبار بـ Workflow Statuses');
console.log('═'.repeat(70) + '\n');

// Read current orders
const ordersPath = path.join(__dirname, 'db', 'orders.json');
const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

// Create test orders with different workflow statuses
const testOrders = [
  {
    "id": "AZ-WF-001",
    "items": [{
      "id": 1,
      "name": "T-Shirt Classic",
      "color": "أزرق",
      "size": "L",
      "quantity": 2,
      "price": 1500
    }],
    "customer": {
      "name": "محمد سعيد",
      "phone": "+213555000001",
      "email": "mohammad@example.com",
      "wilaya": "16 - الجزائر",
      "address": "شارع الشريعة",
      "delivery": "Home"
    },
    "total": 3000,
    "status": "en attente",
    "createdAt": "2026-06-15T08:00:00Z",
    "notes": "اختبار حالة en attente"
  },
  {
    "id": "AZ-WF-002",
    "items": [{
      "id": 2,
      "name": "Hoodies Premium",
      "color": "رمادي",
      "size": "M",
      "quantity": 1,
      "price": 2800
    }],
    "customer": {
      "name": "فاطمة علي",
      "phone": "+213555000002",
      "email": "fatima@example.com",
      "wilaya": "16 - الجزائر",
      "address": "شارع بن عكنون",
      "delivery": "Home"
    },
    "total": 2800,
    "status": "confirmé",
    "createdAt": "2026-06-14T10:00:00Z",
    "notes": "اختبار حالة confirmé",
    "trackingNumber": "ZR-2024-0001"
  },
  {
    "id": "AZ-WF-003",
    "items": [{
      "id": 3,
      "name": "Shoes Sports",
      "color": "أبيض",
      "size": "42",
      "quantity": 1,
      "price": 4500
    }],
    "customer": {
      "name": "عمر محمود",
      "phone": "+213555000003",
      "email": "omar@example.com",
      "wilaya": "16 - الجزائر",
      "address": "شارع الجمهورية",
      "delivery": "Home"
    },
    "total": 4500,
    "status": "livré",
    "createdAt": "2026-06-10T14:00:00Z",
    "notes": "اختبار حالة livré",
    "trackingNumber": "ZR-2024-0002",
    "deliveredAt": "2026-06-13T10:00:00Z"
  },
  {
    "id": "AZ-WF-004",
    "items": [{
      "id": 4,
      "name": "Jacket Winter",
      "color": "أسود",
      "size": "XL",
      "quantity": 1,
      "price": 5500
    }],
    "customer": {
      "name": "ليلى حسين",
      "phone": "+213555000004",
      "email": "leila@example.com",
      "wilaya": "16 - الجزائر",
      "address": "شارع الثورة",
      "delivery": "Home"
    },
    "total": 5500,
    "status": "retourné",
    "createdAt": "2026-06-08T09:00:00Z",
    "notes": "اختبار حالة retourné",
    "trackingNumber": "ZR-2024-0003",
    "returnedAt": "2026-06-12T15:00:00Z"
  },
  {
    "id": "AZ-WF-005",
    "items": [{
      "id": 5,
      "name": "Pants Casual",
      "color": "كحلي",
      "size": "32",
      "quantity": 1,
      "price": 3200
    }],
    "customer": {
      "name": "يوسف أحمد",
      "phone": "+213555000005",
      "email": "yousef@example.com",
      "wilaya": "16 - الجزائر",
      "address": "شارع الاستقلال",
      "delivery": "Home"
    },
    "total": 3200,
    "status": "annulé",
    "createdAt": "2026-06-09T11:00:00Z",
    "notes": "اختبار حالة annulé"
  }
];

// Add test orders if they don't exist
testOrders.forEach(testOrder => {
  const exists = orders.some(o => o.id === testOrder.id);
  if (!exists) {
    orders.push(testOrder);
    console.log('✓ أضيف الطلب: ' + testOrder.id + ' - الحالة: ' + testOrder.status);
  } else {
    console.log('⚠ الطلب موجود بالفعل: ' + testOrder.id);
  }
});

// Save updated orders
fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2), 'utf8');

console.log('\n✅ تم تحديث قاعدة البيانات بنجاح!');
console.log('\n📋 الطلبات المضافة:\n');

testOrders.forEach((order, idx) => {
  console.log('  ' + (idx + 1) + '. ' + order.id + ' - ' + order.status);
  console.log('     العميل: ' + order.customer.name);
  console.log('     المبلغ: ' + order.total + ' DZD\n');
});

console.log('═'.repeat(70));
console.log('\n✨ جاهز الآن لاختبار جميع حالات الـ Workflow!');
console.log('\nطلبات الاختبار:');
console.log('  • AZ-WF-001 - en attente (في الانتظار)');
console.log('  • AZ-WF-002 - confirmé (مؤكد)');
console.log('  • AZ-WF-003 - livré (مُسلّم)');
console.log('  • AZ-WF-004 - retourné (مُرجّع)');
console.log('  • AZ-WF-005 - annulé (ملغى)\n');
