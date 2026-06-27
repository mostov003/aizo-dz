/**
 * ZR Express Shipments Routes
 * مسارات الشحن عبر ZR Express
 */

const express = require('express');
const router = express.Router();
const config = require('../config');

// ══════════════════════════════════════════
// API: POST /api/shipments/create-from-order
// إنشاء شحنة من طلب موجود
// ══════════════════════════════════════════
router.post('/create-from-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'orderId is required'
      });
    }

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`🚀 شروع إنشاء شحنة للطلب: #${orderId}`);
    console.log(`${'═'.repeat(50)}`);

    // ستأتي من الـ backend - نفس البيانات من الطلب
    const shipmentData = req.body;

    // استدعاء دالة الشحن الرئيسية
    const result = await createZRShipment(shipmentData);

    console.log(`✅ تم الشحن بنجاح!`);
    console.log(`   معرّف الشحنة: ${result.zrParcelId}`);
    console.log(`   رقم التتبع: ${result.trackingNumber}\n`);

    res.json({
      success: true,
      trackingNumber: result.trackingNumber,
      zrParcelId: result.zrParcelId,
      message: 'تم إنشاء الشحنة بنجاح'
    });

  } catch (error) {
    console.error(`\n❌ خطأ في الشحن:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create shipment'
    });
  }
});

// ══════════════════════════════════════════
// الدالة الرئيسية: إنشاء شحنة ZR
// ══════════════════════════════════════════
async function createZRShipment(data) {
  console.log(`\n📋 بيانات الشحنة المستلمة:`);
  console.log(`   الطلب: ${data.orderId}`);
  console.log(`   العميل: ${data.customerName}`);
  console.log(`   الهاتف: ${data.customerPhone}`);
  console.log(`   الولاية: ${data.wilaya}`);
  console.log(`   العنوان: ${data.address}`);
  console.log(`   المبلغ: ${data.total}`);

  // التحقق من البيانات الأساسية
  if (!data.orderId || !data.customerName || !data.customerPhone || !data.wilaya || !data.address) {
    throw new Error('بيانات غير كاملة: orderId, customerName, customerPhone, wilaya, address مطلوبة');
  }

  // تنسيق رقم الهاتف
  const phone = formatPhone(data.customerPhone);
  console.log(`   الهاتف المنسق: ${phone}`);

  // استخراج رقم الولاية
  const wilayaCode = parseInt(data.wilaya.match(/\d+/)?.[0] || '16');
  console.log(`   كود الولاية: ${wilayaCode}`);

  // الحصول على معرّفات الأقاليم
  const { cityTerritoryId, districtTerritoryId } = await getTerritoryIds(wilayaCode);
  console.log(`   معرّف المدينة: ${cityTerritoryId}`);
  console.log(`   معرّف الحي: ${districtTerritoryId}`);

  // إعداد بيانات الشحنة
  const parcelPayload = {
    customer: {
      customerId: generateUUID(),
      name: data.customerName,
      phone: {
        number1: phone
      }
    },
    deliveryAddress: {
      street: data.address,
      city: data.wilaya.replace(/^\d+\s*-\s*/, ''),
      district: 'Commune',
      cityTerritoryId,
      districtTerritoryId
    },
    orderedProducts: [
      {
        productName: data.productName || 'Product',
        quantity: data.quantity || 1,
        unitPrice: data.total || 0,
        stockType: 'none'
      }
    ],
    amount: data.total || 0,
    description: `Order #${data.orderId}`,
    deliveryType: 'home',
    externalId: data.orderId
  };

  console.log(`\n📤 إرسال الشحنة إلى ZR Express...`);

  // إرسال الطلب إلى ZR Express
  const response = await fetch(`${config.zr.baseUrl}/parcels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant': config.zr.tenantId,
      'X-Api-Key': config.zr.secretKey
    },
    body: JSON.stringify(parcelPayload)
  });

  const responseText = await response.text();
  console.log(`   حالة الرد: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    console.error(`   رد الخادم:`, responseText);
    throw new Error(`ZR API Error ${response.status}: ${responseText}`);
  }

  const parcelData = JSON.parse(responseText);
  const zrParcelId = parcelData.id;

  console.log(`✓ تم إنشاء الشحنة في ZR`);
  console.log(`   ID: ${zrParcelId}`);

  // الحصول على رقم التتبع
  let trackingNumber = `ZR-${Date.now()}`;

  try {
    const detailResponse = await fetch(`${config.zr.baseUrl}/parcels/${zrParcelId}`, {
      method: 'GET',
      headers: {
        'X-Tenant': config.zr.tenantId,
        'X-Api-Key': config.zr.secretKey
      }
    });

    if (detailResponse.ok) {
      const detailData = await detailResponse.json();
      if (detailData.trackingNumber) {
        trackingNumber = detailData.trackingNumber;
        console.log(`✓ رقم التتبع: ${trackingNumber}`);
      }
    }
  } catch (err) {
    console.warn(`⚠️ تحذير: لم نتمكن من الحصول على رقم التتبع:`, err.message);
  }

  return {
    zrParcelId,
    trackingNumber
  };
}

// ══════════════════════════════════════════
// Helper Functions - دوال مساعدة
// ══════════════════════════════════════════

function formatPhone(phone) {
  if (!phone) throw new Error('رقم الهاتف مطلوب');

  let formatted = phone.trim().replace(/\s+/g, '');

  // إذا بدأ بـ 0، استبدله بـ +213
  if (formatted.startsWith('0')) {
    formatted = '+213' + formatted.substring(1);
  }
  // إذا لم يبدأ بـ +، أضف +213
  else if (!formatted.startsWith('+')) {
    formatted = '+213' + formatted;
  }

  return formatted;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let territoryCache = {};

async function getTerritoryIds(wilayaCode) {
  // التحقق من الـ cache
  if (territoryCache[wilayaCode]) {
    console.log(`   استخدام الـ cache للولاية ${wilayaCode}`);
    return territoryCache[wilayaCode];
  }

  try {
    // البحث عن الولاية
    const searchResponse = await fetch(`${config.zr.baseUrl}/territories/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant': config.zr.tenantId,
        'X-Api-Key': config.zr.secretKey
      },
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 10,
        advancedFilter: {
          logic: 'and',
          filters: [
            { field: 'code', operator: 'eq', value: wilayaCode },
            { field: 'level', operator: 'eq', value: 'wilaya' }
          ]
        }
      })
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.items && searchData.items.length > 0) {
        const cityTerritoryId = searchData.items[0].id;

        // البحث عن الحي/البلدية
        const districtResponse = await fetch(`${config.zr.baseUrl}/territories/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant': config.zr.tenantId,
            'X-Api-Key': config.zr.secretKey
          },
          body: JSON.stringify({
            pageNumber: 1,
            pageSize: 1,
            advancedFilter: {
              logic: 'and',
              filters: [
                { field: 'parentId', operator: 'eq', value: cityTerritoryId },
                { field: 'level', operator: 'eq', value: 'commune' }
              ]
            }
          })
        });

        let districtTerritoryId = 'DEFAULT-DISTRICT';
        if (districtResponse.ok) {
          const districtData = await districtResponse.json();
          if (districtData.items && districtData.items.length > 0) {
            districtTerritoryId = districtData.items[0].id;
          }
        }

        const result = { cityTerritoryId, districtTerritoryId };
        territoryCache[wilayaCode] = result;
        return result;
      }
    }

    // القيم الافتراضية
    return {
      cityTerritoryId: 'DEFAULT-CITY',
      districtTerritoryId: 'DEFAULT-DISTRICT'
    };

  } catch (err) {
    console.warn(`⚠️ تحذير: خطأ في البحث عن الأقاليم:`, err.message);
    return {
      cityTerritoryId: 'DEFAULT-CITY',
      districtTerritoryId: 'DEFAULT-DISTRICT'
    };
  }
}

module.exports = router;

