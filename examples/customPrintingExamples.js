/**
 * CUSTOM PRINTING SOLUTION - PRACTICAL EXAMPLES
 * حل عملي لاستخدام نظام التصاميم المخصصة
 */

import CustomOrderManager from '@/utils/customOrderManager.js';

// ═══════════════════════════════════════════════════════════
// مثال 1: إنشاء طلب مخصص جديد بتصاميم متعددة
// ═══════════════════════════════════════════════════════════

const createCustomOrder = () => {
  try {
    const newOrder = CustomOrderManager.createOrder({
      orderId: 'CO-' + Math.floor(1000 + Math.random() * 9000),
      productType: 'tshirt',
      color: 'black',
      quantity: 5,
      designs: [
        // تصميم الصدر
        {
          sideId: 'front',
          sideName: 'الصدر / Front Chest',
          imagePath: '/uploads/designs/front-logo.png',
          imageData: {
            width: 800,
            height: 600,
            format: 'png',
            fileSize: 45000
          },
          placement: {
            x: 264,
            y: 236,
            scale: 1.0,
            rotation: 0
          },
          status: 'pending'
        },
        // تصميم الظهر
        {
          sideId: 'back',
          sideName: 'الظهر / Back',
          imagePath: '/uploads/designs/back-print.png',
          imageData: {
            width: 900,
            height: 700,
            format: 'png',
            fileSize: 52000
          },
          placement: {
            x: 300,
            y: 250,
            scale: 0.95,
            rotation: 0
          },
          status: 'pending'
        },
        // تصميم الكم الأيسر
        {
          sideId: 'left_sleeve',
          sideName: 'الكم الأيسر / Left Sleeve',
          imagePath: '/uploads/designs/left-sleeve.png',
          imageData: {
            width: 400,
            height: 300,
            format: 'png',
            fileSize: 25000
          },
          placement: {
            x: 100,
            y: 120,
            scale: 0.8,
            rotation: 0
          },
          status: 'pending'
        }
      ],
      customerInfo: {
        name: 'محمد أحمد',
        email: 'mohamed@example.com',
        phone: '0612345678',
        wilaya: '16 - الجزائر'
      },
      notes: 'طلب خاص - التأكد من جودة الطباعة'
    });

    console.log('✅ تم إنشاء الطلب بنجاح:', newOrder.orderId);
    return newOrder;
  } catch (error) {
    console.error('❌ خطأ في إنشاء الطلب:', error.message);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════
// مثال 2: الحصول على تصميم معين بناءً على الجهة
// ═══════════════════════════════════════════════════════════

const getSpecificDesign = (order, sideId) => {
  const design = CustomOrderManager.getDesignBySide(order, sideId);
  
  if (!design) {
    console.warn(`⚠️ لم يتم العثور على تصميم للجهة: ${sideId}`);
    return null;
  }

  console.log(`📍 تصميم ${design.sideName}:`);
  console.log(`   - الصورة: ${design.imagePath}`);
  console.log(`   - الموضع: X=${design.placement.x}, Y=${design.placement.y}`);
  console.log(`   - الحجم: ${Math.round(design.placement.scale * 100)}%`);
  console.log(`   - الحالة: ${design.status}`);
  
  return design;
};

// ═══════════════════════════════════════════════════════════
// مثال 3: تحديث موضع تصميم معين
// ═══════════════════════════════════════════════════════════

const updateDesignPosition = (order, sideId, newX, newY, newScale = 1.0) => {
  try {
    const updatedOrder = CustomOrderManager.updateDesign(
      order,
      sideId,
      {
        placement: {
          x: newX,
          y: newY,
          scale: newScale,
          rotation: 0
        }
      }
    );

    console.log(`✅ تم تحديث موضع التصميم:`);
    console.log(`   - الجهة: ${sideId}`);
    console.log(`   - الموضع الجديد: X=${newX}, Y=${newY}`);
    console.log(`   - الحجم الجديد: ${Math.round(newScale * 100)}%`);
    
    return updatedOrder;
  } catch (error) {
    console.error(`❌ خطأ في التحديث: ${error.message}`);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════
// مثال 4: تغيير حالة التصميم (موافقة أو رفض)
// ═══════════════════════════════════════════════════════════

const approveDesign = (order, sideId) => {
  try {
    const updatedOrder = CustomOrderManager.updateDesign(
      order,
      sideId,
      { status: 'approved' }
    );
    console.log(`✅ تم الموافقة على تصميم: ${sideId}`);
    return updatedOrder;
  } catch (error) {
    console.error(`❌ خطأ: ${error.message}`);
    return null;
  }
};

const rejectDesign = (order, sideId, reason = '') => {
  try {
    const updatedOrder = CustomOrderManager.updateDesign(
      order,
      sideId,
      { status: 'rejected' }
    );
    console.log(`❌ تم رفض تصميم: ${sideId}`);
    if (reason) console.log(`   السبب: ${reason}`);
    return updatedOrder;
  } catch (error) {
    console.error(`❌ خطأ: ${error.message}`);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════
// مثال 5: إضافة تصميم جديد لجهة إضافية
// ═══════════════════════════════════════════════════════════

const addNewDesign = (order, newDesignData) => {
  try {
    const updatedOrder = CustomOrderManager.addDesign(order, newDesignData);
    console.log(`✅ تم إضافة تصميم جديد: ${newDesignData.sideName}`);
    return updatedOrder;
  } catch (error) {
    console.error(`❌ خطأ في الإضافة: ${error.message}`);
    return null;
  }
};

// مثال على الاستخدام:
// const additionalDesign = {
//   sideId: 'right_sleeve',
//   sideName: 'الكم الأيمن',
//   imagePath: '/uploads/designs/right-sleeve.png',
//   placement: { x: 100, y: 120, scale: 0.8 }
// };
// const updatedOrder = addNewDesign(order, additionalDesign);

// ═══════════════════════════════════════════════════════════
// مثال 6: حذف تصميم من الطلب
// ═══════════════════════════════════════════════════════════

const deleteDesign = (order, sideId) => {
  try {
    const updatedOrder = CustomOrderManager.removeDesign(order, sideId);
    console.log(`🗑️ تم حذف تصميم: ${sideId}`);
    return updatedOrder;
  } catch (error) {
    console.error(`❌ خطأ في الحذف: ${error.message}`);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════
// مثال 7: الحصول على ملخص الطلب
// ═══════════════════════════════════════════════════════════

const getOrderSummary = (order) => {
  const summary = CustomOrderManager.generateSummary(order);
  
  console.log('\n📊 ملخص الطلب:');
  console.log(`   رقم الطلب: ${summary.orderId}`);
  console.log(`   عدد التصاميم: ${summary.totalDesigns}`);
  console.log(`   الحالة:`);
  console.log(`     - قيد الانتظار: ${summary.statusCounts.pending}`);
  console.log(`     - موافق عليه: ${summary.statusCounts.approved}`);
  console.log(`     - مرفوض: ${summary.statusCounts.rejected}`);
  console.log(`   \n   التصاميم:`);
  
  summary.designsBySide.forEach(design => {
    console.log(`     - ${design.name} (${design.side}): ${design.status} - ${design.imageSize}`);
  });
  
  return summary;
};

// ═══════════════════════════════════════════════════════════
// مثال 8: تصدير الطلب إلى قاعدة البيانات
// ═══════════════════════════════════════════════════════════

const saveOrderToDatabase = async (order) => {
  try {
    const jsonData = CustomOrderManager.toJSON(order);
    
    // إرسال إلى API
    const response = await fetch('/api/custom-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData
    });

    if (!response.ok) {
      throw new Error(`خطأ في السيرفر: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ تم حفظ الطلب في قاعدة البيانات');
    console.log(`   معرف الطلب: ${result.id}`);
    
    return result;
  } catch (error) {
    console.error('❌ خطأ في الحفظ:', error.message);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════
// مثال 9: استرجاع الطلب من قاعدة البيانات
// ═══════════════════════════════════════════════════════════

const loadOrderFromDatabase = async (orderId) => {
  try {
    const response = await fetch(`/api/custom-orders/${orderId}`);
    
    if (!response.ok) {
      throw new Error(`الطلب غير موجود: ${response.status}`);
    }

    const jsonData = await response.json();
    const order = CustomOrderManager.fromJSON(JSON.stringify(jsonData));
    
    console.log(`✅ تم استرجاع الطلب: ${order.orderId}`);
    return order;
  } catch (error) {
    console.error('❌ خطأ في استرجاع الطلب:', error.message);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════
// مثال 10: عملية كاملة من الإنشاء إلى الحفظ
// ═══════════════════════════════════════════════════════════

const completeWorkflow = async () => {
  console.log('🚀 بدء عملية كاملة للطلب المخصص\n');

  // 1. إنشاء طلب جديد
  let order = createCustomOrder();
  if (!order) return;

  // 2. عرض ملخص الطلب
  getOrderSummary(order);

  // 3. الحصول على تصميم معين
  console.log('\n📍 استرجاع تصميم الصدر:');
  getSpecificDesign(order, 'front');

  // 4. تحديث موضع التصميم
  console.log('\n📝 تحديث موضع تصميم الظهر:');
  order = updateDesignPosition(order, 'back', 310, 260, 1.05);

  // 5. الموافقة على تصاميم
  console.log('\n✅ الموافقة على التصاميم:');
  order = approveDesign(order, 'front');
  order = approveDesign(order, 'back');

  // 6. عرض الملخص المحدث
  console.log('\n📊 الملخص المحدث:');
  getOrderSummary(order);

  // 7. حفظ في قاعدة البيانات
  console.log('\n💾 حفظ الطلب:');
  await saveOrderToDatabase(order);

  // 8. استرجاع من قاعدة البيانات
  console.log('\n📥 استرجاع الطلب:');
  const loadedOrder = await loadOrderFromDatabase(order.orderId);
  
  if (loadedOrder) {
    getOrderSummary(loadedOrder);
  }

  console.log('\n✨ انتهت العملية بنجاح!\n');
};

// ═══════════════════════════════════════════════════════════
// تصدير الدوال للاستخدام
// ═══════════════════════════════════════════════════════════

export {
  createCustomOrder,
  getSpecificDesign,
  updateDesignPosition,
  approveDesign,
  rejectDesign,
  addNewDesign,
  deleteDesign,
  getOrderSummary,
  saveOrderToDatabase,
  loadOrderFromDatabase,
  completeWorkflow
};

// الاستخدام في المكونات:
// import { createCustomOrder, getOrderSummary } from '@/examples/customPrintingExamples.js';
// const order = createCustomOrder();
// const summary = getOrderSummary(order);
