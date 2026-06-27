# 🔗 دليل التكامل - حل التصاميم المخصصة الكامل

## 📚 محتويات الحل

هذا الحل يتضمن 5 مكونات رئيسية:

### 1. **JSON Schema** (`schemas/customOrder.schema.json`)
- تعريف البنية الكاملة للبيانات
- التحقق من صحة الإدخالات
- دعم متعدد الجهات بشكل منفصل

### 2. **Manager Class** (`utils/customOrderManager.js`)
- منطق إدارة البيانات
- دوال الإنشاء والتحديث والحذف
- التحقق التلقائي من البيانات
- معالجة الأخطاء الشاملة

### 3. **Vue Component** (`client/src/components/CustomOrderDisplayVue.vue`)
- عرض الطلبات المخصصة
- بطاقات منفصلة لكل جهة
- معاينة حية للتصاميم
- أزرار تحكم منفصلة

### 4. **Responsive CSS** (`css/custom-order-display.css`)
- تصاميم متجاوبة (responsive)
- Grid layout لمنع التداخل
- دعم جميع الأحجام (سطح مكتب، تابلت، هاتف)
- طباعة محسّنة

### 5. **أمثلة عملية** (`examples/customPrintingExamples.js`)
- حالات استخدام واقعية
- عمليات كاملة من الإنشاء إلى الحفظ
- دوال مساعدة جاهزة للاستخدام

---

## 🚀 خطوات التكامل

### الخطوة 1: إعداد المجلدات

```
mkdir -p schemas
mkdir -p utils
mkdir -p examples
mkdir -p css
```

### الخطوة 2: نسخ الملفات

```bash
# Copy all files to their locations
# The files are already in place
```

### الخطوة 3: استيراد المكونات في صفحتك

#### في ملف Vue (مثل `customize.html` أو صفحة Vue جديدة):

```vue
<template>
  <div class="customize-page">
    <!-- Other content -->
    
    <!-- عرض الطلبات المخصصة -->
    <CustomOrderDisplay
      v-if="currentCustomOrder"
      :order="currentCustomOrder"
      @edit-design="handleEditDesign"
      @delete-design="handleDeleteDesign"
      @preview-design="handlePreviewDesign"
    />
  </div>
</template>

<script>
import CustomOrderDisplayVue from '@/components/CustomOrderDisplayVue.vue';
import CustomOrderManager from '@/utils/customOrderManager.js';

export default {
  components: {
    CustomOrderDisplay: CustomOrderDisplayVue
  },
  data() {
    return {
      currentCustomOrder: null
    };
  },
  methods: {
    handleEditDesign(sideId) {
      console.log('تحرير التصميم:', sideId);
      // فتح محرر التصميم
    },
    
    handleDeleteDesign(sideId) {
      if (this.currentCustomOrder) {
        this.currentCustomOrder = CustomOrderManager.removeDesign(
          this.currentCustomOrder,
          sideId
        );
      }
    },
    
    handlePreviewDesign(sideId) {
      console.log('معاينة التصميم:', sideId);
      // فتح نافذة المعاينة
    }
  },
  mounted() {
    this.loadCustomOrder();
  },
  
  async loadCustomOrder() {
    // استرجاع الطلب من قاعدة البيانات
    try {
      const response = await fetch('/api/custom-orders/CO-2024-001');
      const orderData = await response.json();
      this.currentCustomOrder = CustomOrderManager.createOrder(orderData);
    } catch (error) {
      console.error('خطأ في تحميل الطلب:', error);
    }
  }
};
</script>

<style scoped>
/* CSS سيتم تحميله تلقائياً من CustomOrderDisplayVue */
</style>
```

### الخطوة 4: إنشاء API Endpoints

#### في `server.js`:

```javascript
// GET /api/custom-orders/:orderId
app.get('/api/custom-orders/:orderId', (req, res) => {
  try {
    const order = db.getOrder(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/custom-orders
app.post('/api/custom-orders', (req, res) => {
  try {
    const order = CustomOrderManager.createOrder(req.body);
    const saved = db.saveOrder(order);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/custom-orders/:orderId/designs/:sideId
app.patch('/api/custom-orders/:orderId/designs/:sideId', (req, res) => {
  try {
    let order = db.getOrder(req.params.orderId);
    order = CustomOrderManager.updateDesign(
      order,
      req.params.sideId,
      req.body
    );
    const saved = db.saveOrder(order);
    res.json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/custom-orders/:orderId/designs/:sideId
app.delete('/api/custom-orders/:orderId/designs/:sideId', (req, res) => {
  try {
    let order = db.getOrder(req.params.orderId);
    order = CustomOrderManager.removeDesign(order, req.params.sideId);
    const saved = db.saveOrder(order);
    res.json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### الخطوة 5: استيراد CSS

في `index.html` أو صفحتك الرئيسية:

```html
<link rel="stylesheet" href="/css/custom-order-display.css">
```

أو في ملف Vue:

```vue
<style>
@import '@/../../css/custom-order-display.css';
</style>
```

---

## 🔄 عملية استخدام كاملة

### 1. إنشاء طلب جديد

```javascript
import CustomOrderManager from '@/utils/customOrderManager.js';

const newOrder = CustomOrderManager.createOrder({
  orderId: 'CO-2024-001',
  productType: 'tshirt',
  color: 'black',
  quantity: 5,
  designs: [
    {
      sideId: 'front',
      sideName: 'الصدر / Front',
      imagePath: '/uploads/designs/front.png',
      placement: { x: 264, y: 236, scale: 1.0 }
    }
  ]
});
```

### 2. حفظ في قاعدة البيانات

```javascript
const saved = await fetch('/api/custom-orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newOrder)
});
```

### 3. استرجاع وعرض

```javascript
const loaded = await fetch('/api/custom-orders/CO-2024-001');
const order = await loaded.json();
// عرض في Vue component
this.currentCustomOrder = order;
```

### 4. تحديث تصميم معين

```javascript
let order = this.currentCustomOrder;
order = CustomOrderManager.updateDesign(order, 'front', {
  placement: { x: 300, y: 250, scale: 1.1 }
});

// حفظ التحديث
await fetch('/api/custom-orders/CO-2024-001/designs/front', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(order.designs[0])
});
```

### 5. حذف تصميم

```javascript
order = CustomOrderManager.removeDesign(order, 'front');

// حفظ الحذف
await fetch('/api/custom-orders/CO-2024-001/designs/front', {
  method: 'DELETE'
});
```

---

## ✅ قائمة التحقق

- [ ] نسخ جميع الملفات إلى المجلدات الصحيحة
- [ ] استيراد CustomOrderManager في التطبيق
- [ ] استيراد CustomOrderDisplayVue في الصفحة
- [ ] استيراد CSS في الملفات المناسبة
- [ ] إنشاء API endpoints في server.js
- [ ] اختبار الإنشاء الأساسي
- [ ] اختبار العرض على سطح المكتب
- [ ] اختبار العرض على الهاتف
- [ ] اختبار التحديث والحذف
- [ ] اختبار الحفظ في قاعدة البيانات

---

## 🐛 استكشاف الأخطاء

### المشكلة: التصاميم تتداخل
**الحل:** تأكد من استيراد `custom-order-display.css` وأنه يحتوي على `.co-design-card` و `.co-designs-grid`

### المشكلة: الصور لا تظهر
**الحل:** تأكد من أن `imagePath` صحيح و أن الملفات موجودة في `/uploads/designs/`

### المشكلة: التحقق يفشل
**الحل:** تأكد من أن البيانات تطابق الـ schema المحدد

### المشكلة: الأزرار لا تعمل
**الحل:** تأكد من أن الـ emit والمستمعين (listeners) معرفين بشكل صحيح

---

## 📞 الدعم والتطوير

### التوسعات المستقبلية:

1. **محرر تصاميم متقدم:**
   - سحب وإفلات (Drag & Drop)
   - تدوير وتكبير/تصغير
   - معاينة حية

2. **نظام الموافقة:**
   - موافقة مدير على كل تصميم
   - تعليقات وملاحظات
   - سجل الأنشطة

3. **التكاملات:**
   - تكامل مع محرك الطباعة
   - تقديرات سعر ديناميكية
   - تحديثات الحالة الفورية

4. **التقارير:**
   - تقارير الطلبات
   - إحصائيات المبيعات
   - تحليل الأداء

---

## 🎓 مراجع وموارد

- [JSON Schema Official](https://json-schema.org/)
- [Vue.js Documentation](https://vuejs.org/)
- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Responsive Design Best Practices](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

**تم تصميم هذا الحل ليكون:**
- ✅ قابل للتوسع
- ✅ سهل الصيانة
- ✅ معزول تماماً (No overlap)
- ✅ متجاوب على جميع الأجهزة
- ✅ موثق بشكل كامل
