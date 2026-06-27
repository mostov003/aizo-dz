/**
 * Database Helper Functions
 * استخدام pg driver للاتصال بـ PostgreSQL بشكل مباشر
 */

require('dotenv/config');
const { Pool } = require('pg');

console.log('📚 Database Module Loading...');
const dbUrl = process.env.DATABASE_URL;
console.log('DATABASE_URL:', dbUrl ? dbUrl.substring(0, 50) + '***' : 'NOT SET');

// إنشاء connection pool مباشرة
const pool = new Pool({
  connectionString: dbUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('❌ Pool error:', err.message);
});

console.log('✅ PostgreSQL Pool initialized successfully');

// Helper function to execute queries
async function query(text, params = []) {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (err) {
    console.error('❌ Query error:', err.message);
    throw err;
  }
}

// ════════════════════════════════════════════
// ORDER FUNCTIONS
// Helper to map flat database columns to nested customer object and restore shipping property
function formatDbOrder(order) {
  if (!order) return null;
  return {
    ...order,
    shipping: order.shippingCost,
    customer: {
      name: order.customerName,
      phone: order.customerPhone,
      email: order.customerEmail,
      wilaya: order.customerWilaya,
      address: order.customerAddress,
      delivery: order.delivery,
      deliveryOffice: order.deliveryOffice
    }
  };
}

async function getAllOrders() {
  try {
    const ordersSql = `
      SELECT * FROM "Order" 
      ORDER BY "createdAt" DESC
    `;
    const orders = await query(ordersSql);
    if (orders.length === 0) return [];

    const itemsSql = `SELECT * FROM "OrderItem"`;
    const items = await query(itemsSql);

    const itemsByOrderId = {};
    items.forEach(item => {
      const mappedItem = {
        id: item.productId,
        name: item.productName,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      };
      if (!itemsByOrderId[item.orderId]) {
        itemsByOrderId[item.orderId] = [];
      }
      itemsByOrderId[item.orderId].push(mappedItem);
    });

    return orders.map(order => {
      let customOrderObj = null;
      if (order.customOrder) {
        if (order.customOrderDetails) {
          customOrderObj = typeof order.customOrderDetails === 'string'
            ? JSON.parse(order.customOrderDetails)
            : order.customOrderDetails;
        } else {
          customOrderObj = true;
        }
      }

      return formatDbOrder({
        ...order,
        items: itemsByOrderId[order.id] || [],
        customOrder: customOrderObj
      });
    });
  } catch (err) {
    console.error('❌ خطأ في جلب الطلبات:', err.message);
    throw err;
  }
}

async function getOrderById(id) {
  try {
    const sql = `
      SELECT * FROM "Order" 
      WHERE id = $1 OR "orderNumber" = $1
    `;
    const result = await query(sql, [id]);
    const order = result[0];
    if (!order) return null;

    const itemsSql = `
      SELECT * FROM "OrderItem"
      WHERE "orderId" = $1
    `;
    const items = await query(itemsSql, [order.id]);
    const mappedItems = items.map(item => ({
      id: item.productId,
      name: item.productName,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.price
    }));

    let customOrderObj = null;
    if (order.customOrder) {
      if (order.customOrderDetails) {
        customOrderObj = typeof order.customOrderDetails === 'string'
          ? JSON.parse(order.customOrderDetails)
          : order.customOrderDetails;
      } else {
        customOrderObj = true;
      }
    }

    return formatDbOrder({
      ...order,
      items: mappedItems,
      customOrder: customOrderObj
    });
  } catch (err) {
    console.error('❌ خطأ في جلب الطلب:', err.message);
    throw err;
  }
}

async function getOrderByNumber(orderNumber) {
  try {
    const sql = `
      SELECT * FROM "Order" 
      WHERE "orderNumber" = $1
    `;
    const result = await query(sql, [orderNumber]);
    const order = result[0];
    if (!order) return null;

    const itemsSql = `
      SELECT * FROM "OrderItem"
      WHERE "orderId" = $1
    `;
    const items = await query(itemsSql, [order.id]);
    const mappedItems = items.map(item => ({
      id: item.productId,
      name: item.productName,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.price
    }));

    let customOrderObj = null;
    if (order.customOrder) {
      if (order.customOrderDetails) {
        customOrderObj = typeof order.customOrderDetails === 'string'
          ? JSON.parse(order.customOrderDetails)
          : order.customOrderDetails;
      } else {
        customOrderObj = true;
      }
    }

    return formatDbOrder({
      ...order,
      items: mappedItems,
      customOrder: customOrderObj
    });
  } catch (err) {
    console.error('❌ خطأ في جلب الطلب:', err.message);
    throw err;
  }
}

async function createOrder(orderData) {
  try {
    const orderNumber = orderData.id || generateOrderNumber();
    const id = require('crypto').randomBytes(8).toString('hex');
    
    const sql = `
      INSERT INTO "Order" (
        id, "orderNumber", "customerName", "customerPhone", "customerEmail",
        "customerWilaya", "customerAddress", "delivery", "deliveryOffice",
        "subtotal", "shippingCost", "total", "status", "notes", 
        "customOrder", "customOrderDetails", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
      )
      RETURNING *
    `;
    
    const hasCustomOrder = !!orderData.customOrder;
    const customOrderDetails = hasCustomOrder ? JSON.stringify(orderData.customOrder) : null;
    
    const params = [
      id,
      orderNumber,
      orderData.customer?.name || orderData.customerName || '',
      orderData.customer?.phone || orderData.customerPhone || '',
      orderData.customer?.email || orderData.customerEmail || null,
      orderData.customer?.wilaya || orderData.customerWilaya || '',
      orderData.customer?.address || orderData.customerAddress || null,
      orderData.customer?.delivery || orderData.delivery || 'Home',
      orderData.customer?.deliveryOffice || orderData.deliveryOffice || null,
      parseFloat(orderData.subtotal) || 0,
      parseFloat(orderData.shippingCost) || 0,
      parseFloat(orderData.total) || 0,
      orderData.status || 'en attente',
      orderData.notes || null,
      hasCustomOrder,
      customOrderDetails
    ];
    
    const result = await query(sql, params);
    
    // Insert items into OrderItem table
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const itemId = require('crypto').randomBytes(8).toString('hex');
        await query(
            `INSERT INTO "OrderItem" (id, "orderId", "productId", "productName", color, size, quantity, price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            itemId,
            id,
            parseInt(item.id || item.productId || 0, 10) || 0,
            item.name || item.productName || '',
            item.color || null,
            item.size || null,
            parseInt(item.quantity || 1, 10) || 1,
            parseFloat(item.price || 0) || 0
          ]
        );
      }
    }

    // Insert layers into CustomLayer table if present
    if (hasCustomOrder && orderData.customOrder.layers && Array.isArray(orderData.customOrder.layers)) {
      for (let idx = 0; idx < orderData.customOrder.layers.length; idx++) {
        const layer = orderData.customOrder.layers[idx];
        const layerId = require('crypto').randomBytes(8).toString('hex');
        await query(
            `INSERT INTO "CustomLayer" (id, "orderId", "layerIndex", "imageUrl", area, text)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            layerId,
            id,
            idx,
            layer.img || layer.imageUrl || '',
            layer.area || null,
            layer.text || null
          ]
        );
      }
    }

    return await getOrderById(id);
  } catch (err) {
    console.error('❌ خطأ في إنشاء الطلب:', err.message);
    throw err;
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    const sql = `
      UPDATE "Order" 
      SET "status" = $2, "updatedAt" = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    await query(sql, [orderId, status]);
    return await getOrderById(orderId);
  } catch (err) {
    console.error('❌ خطأ في تحديث حالة الطلب:', err.message);
    throw err;
  }
}

async function updateOrderShipping(orderId, shippingData) {
  try {
    const sql = `
      UPDATE "Order" 
      SET 
        "trackingNumber" = $2,
        "zrParcelId" = $3,
        "zrStatus" = $4,
        "status" = 'livré',
        "shippedAt" = NOW(),
        "lastSyncedAt" = NOW(),
        "updatedAt" = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    await query(sql, [
      orderId,
      shippingData.trackingNumber,
      shippingData.zrParcelId,
      shippingData.zrStatus,
    ]);
    return await getOrderById(orderId);
  } catch (err) {
    console.error('❌ خطأ في تحديث الشحن:', err.message);
    throw err;
  }
}

async function deleteOrder(orderId) {
  try {
    const sql = `
      DELETE FROM "Order" 
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await query(sql, [orderId]);
    return result[0] ? formatDbOrder(result[0]) : null;
  } catch (err) {
    console.error('❌ خطأ في حذف الطلب:', err.message);
    throw err;
  }
}

// ════════════════════════════════════════════
// LEAD FUNCTIONS
// ════════════════════════════════════════════

async function getAllLeads() {
  try {
    const sql = `
      SELECT * FROM "Lead" 
      ORDER BY "createdAt" DESC
    `;
    return await query(sql);
  } catch (err) {
    console.error('❌ خطأ في جلب الرسائل:', err.message);
    throw err;
  }
}

async function createLead(email, name, message) {
  try {
    const sql = `
      INSERT INTO "Lead" (email, name, message, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `;
    
    const result = await query(sql, [email, name || '', message || '']);
    return result[0];
  } catch (err) {
    if (err.code === '23505') { // unique constraint violation
      console.warn('⚠️ البريد موجود بالفعل');
      return null;
    }
    console.error('❌ خطأ في إنشاء رسالة:', err.message);
    throw err;
  }
}

async function deleteLead(leadId) {
  try {
    const sql = `
      DELETE FROM "Lead" 
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await query(sql, [leadId]);
    return result[0] || null;
  } catch (err) {
    console.error('❌ خطأ في حذف الرسالة:', err.message);
    throw err;
  }
}

// ════════════════════════════════════════════
// PRODUCT FUNCTIONS
// ════════════════════════════════════════════

async function getAllProducts() {
  try {
    const sql = `
      SELECT * FROM "Product" 
      ORDER BY "createdAt" DESC
    `;
    return await query(sql);
  } catch (err) {
    console.error('❌ خطأ في جلب المنتجات:', err.message);
    throw err;
  }
}

async function createProduct(productData) {
  try {
    const sql = `
      INSERT INTO "Product" (
        "productId", "name", "price", "description", "image",
        "sizes", "colors", "customizable", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
      )
      RETURNING *
    `;
    
    const params = [
      productData.productId || 0,
      productData.name || '',
      productData.price || 0,
      productData.description || null,
      productData.image || null,
      JSON.stringify(productData.sizes || []),
      JSON.stringify(productData.colors || []),
      productData.customizable || false,
    ];
    
    const result = await query(sql, params);
    return result[0];
  } catch (err) {
    console.error('❌ خطأ في إنشاء المنتج:', err.message);
    throw err;
  }
}

// ════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AZ-${timestamp}${random}`;
}

// Close database connection gracefully
async function closeDb() {
  await pool.end();
  console.log('✅ Database connection closed');
}

module.exports = {
  pool,
  query,
  // Order functions
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  createOrder,
  updateOrderStatus,
  updateOrderShipping,
  deleteOrder,
  // Lead functions
  getAllLeads,
  createLead,
  deleteLead,
  // Product functions
  getAllProducts,
  createProduct,
  // Utility
  generateOrderNumber,
  closeDb,
  closePrisma: closeDb, // for backward compatibility
};
