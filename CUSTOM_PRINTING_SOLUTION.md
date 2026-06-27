# حل شامل لمشكلة تداخل التصاميم في ميزة التصميم المخصص (Custom Printing)

## 📋 نظرة عامة

هذا الحل يوفر هيكلية كاملة لإدارة تصاميم متعددة لأجزاء مختلفة من الملابس (صدر، ظهر، أكمام، جيب) بدون تداخل أو اختلاط في البيانات أو الواجهة.

---

## 🏗️ الهيكلية المقترحة

### 1. **JSON Schema** (`schemas/customOrder.schema.json`)
- تعريف البنية الكاملة للطلب المخصص
- كل تصميم له `sideId` فريد يعرّفه بوضوح
- دعم إحداثيات الموضع (X, Y) والحجم (Scale) بشكل منفصل لكل جهة
- تخزين معلومات الصورة (الحجم، الصيغة، حجم الملف)

**الحقول الرئيسية:**
```json
{
  "orderId": "CO-2024-001",
  "productType": "tshirt",
  "color": "black",
  "designs": [
    {
      "sideId": "front",        // معرف فريد للجهة
      "sideName": "الصدر",
      "imagePath": "/uploads/designs/front.png",
      "placement": {
        "x": 264,              // إحداثي X
        "y": 236,              // إحداثي Y
        "scale": 1.0,          // حجم التصميم
        "rotation": 0          // زاوية الدوران
      },
      "status": "pending"
    }
  ]
}
```

---

## 🧠 منطق إدارة البيانات (`utils/customOrderManager.js`)

### الميزات الرئيسية:

#### 1. **Validation - التحقق من البيانات**
```javascript
CustomOrderManager.validateOrder(order);
// يتحقق من:
// - عدم وجود تصاميم مكررة لنفس الجهة
// - صحة جميع الحقول المطلوبة
// - قيم الإحداثيات والحجم ضمن الحدود المقبولة
```

#### 2. **Isolation - عزل التصاميم**
```javascript
CustomOrderManager.getDesignBySide(order, 'front');
// يرجع التصميم المخصص للجهة فقط بدون تداخل مع الجهات الأخرى
```

#### 3. **Individual Updates - تحديث منفصل**
```javascript
CustomOrderManager.updateDesign(order, 'front', {
  placement: { x: 300, y: 250, scale: 1.1, rotation: 0 }
});
// يحدث فقط تصميم الصدر دون تأثير على الظهر أو الأكمام
```

#### 4. **Separate Removal - حذف منفصل**
```javascript
CustomOrderManager.removeDesign(order, 'front');
// يحذف فقط تصميم الصدر مع الحفاظ على التصاميم الأخرى
```

#### 5. **Independent Addition - إضافة مستقلة**
```javascript
CustomOrderManager.addDesign(order, {
  sideId: 'back',
  sideName: 'الظهر',
  imagePath: '/uploads/back.png',
  placement: { x: 300, y: 250, scale: 1.0 }
});
// يضيف تصميم جديد دون التأثير على التصاميم الموجودة
```

---

## 🎨 مكون Vue/React (`CustomOrderDisplayVue.vue`)

### الميزات:
- **عرض منفصل لكل جهة** - كل جهة في بطاقة منفصلة
- **معاينة حية** - عرض التصميم على الملابس
- **معلومات منفصلة** - كل جهة لها إحداثياتها وحجمها الخاص
- **أزرار تحكم منفصلة** - تحرير، معاينة، حذف لكل جهة بشكل مستقل
- **حالة منفصلة** - كل تصميم له حالته الخاصة (قيد الانتظار، موافق عليه، مرفوض)

### البطاقة (`co-design-card`):
```html
<div class="co-design-card">
  <!-- Header: الاسم والحالة -->
  <div class="co-design-card__header">
    <h3>الصدر / Front</h3>
    <span class="co-design-card__status">✅ موافق عليه</span>
  </div>

  <!-- Preview: معاينة مع التصميم -->
  <div class="co-design-card__preview-wrapper">
    <!-- صورة الملابس الأساسية -->
    <!-- التصميم المرفوع مع الإحداثيات -->
  </div>

  <!-- Info: معلومات التصميم -->
  <div class="co-design-card__info">
    <div>Position: X=264, Y=236</div>
    <div>Scale: 100%</div>
    <div>Dimensions: 800x600px</div>
  </div>

  <!-- Actions: أزرار التحكم -->
  <div class="co-design-card__actions">
    <button>✏️ تحرير</button>
    <button>👁️ معاينة</button>
    <button>🗑️ حذف</button>
  </div>
</div>
```

---

## 📱 CSS Responsive (`css/custom-order-display.css`)

### Grid Layouts:

**على سطح المكتب (Desktop):**
```css
.co-designs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}
/* عرض متعدد الأعمدة بجانب بعضها */
```

**على التابلت (Tablet - 768px وما فوق):**
```css
@media (max-width: 768px) {
  .co-designs-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
}
/* تقليل الحجم مع الحفاظ على التخطيط الأفقي */
```

**على الهاتف (Mobile - 480px وما فوق):**
```css
@media (max-width: 480px) {
  .co-designs-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
/* عمود واحد عمودياً - لا تداخل */
```

---

## ✅ كيفية منع التداخل

### 1. **في قاعدة البيانات:**
- كل تصميم له `sideId` فريد
- عدم السماح بتصاميم مكررة لنفس الجهة
- تخزين كل جهة بشكل مستقل

### 2. **في الواجهة:**
- كل جهة تظهر في بطاقة (`co-design-card`) منفصلة
- استخدام `grid` بدلاً من `position: absolute`
- بطاقات الجهات لا تتداخل بفضل `gap` والـ `grid`

### 3. **في المنطق البرمجي:**
- دوال منفصلة للتحديث والحذف والإضافة لكل جهة
- التحقق من عدم وجود تصاميم مكررة
- عزل كامل للعمليات

### 4. **في المعاينة:**
- كل `co-design-card__preview-wrapper` لديها `position: relative`
- التصميم المرفوع له `position: absolute` **داخل حاويته** فقط
- لا يمكن للتصميم أن يتجاوز حدود بطاقته

---

## 🚀 طريقة الاستخدام

### 1. **إنشاء طلب جديد:**
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
      sideName: 'الصدر',
      imagePath: '/uploads/front.png',
      placement: { x: 264, y: 236, scale: 1.0 }
    },
    {
      sideId: 'back',
      sideName: 'الظهر',
      imagePath: '/uploads/back.png',
      placement: { x: 300, y: 250, scale: 1.0 }
    }
  ]
});
```

### 2. **عرض الطلب في Vue:**
```vue
<template>
  <CustomOrderDisplayVue
    :order="customOrder"
    @edit-design="handleEditDesign"
    @delete-design="handleDeleteDesign"
  />
</template>

<script>
import CustomOrderDisplayVue from '@/components/CustomOrderDisplayVue.vue';

export default {
  components: { CustomOrderDisplayVue },
  data() {
    return {
      customOrder: {} // من قاعدة البيانات
    };
  }
};
</script>
```

### 3. **تحديث تصميم منفصل:**
```javascript
const updatedOrder = CustomOrderManager.updateDesign(
  customOrder,
  'front',
  {
    placement: { x: 300, y: 250, scale: 1.1, rotation: 0 },
    status: 'approved'
  }
);
```

---

## 📊 مثال على البيانات الكاملة

```json
{
  "orderId": "CO-2024-001",
  "productType": "tshirt",
  "color": "black",
  "quantity": 5,
  "designs": [
    {
      "sideId": "front",
      "sideName": "الصدر / Front Chest",
      "imagePath": "/uploads/designs/CO-2024-001_front.png",
      "imageData": {
        "width": 800,
        "height": 600,
        "format": "png",
        "fileSize": 45000
      },
      "placement": {
        "x": 264,
        "y": 236,
        "scale": 1.0,
        "rotation": 0
      },
      "colors": {
        "primaryColor": "#FF5733"
      },
      "uploadedAt": "2024-06-17T10:30:00Z",
      "status": "approved"
    },
    {
      "sideId": "back",
      "sideName": "الظهر / Back",
      "imagePath": "/uploads/designs/CO-2024-001_back.png",
      "imageData": {
        "width": 800,
        "height": 600,
        "format": "png",
        "fileSize": 52000
      },
      "placement": {
        "x": 300,
        "y": 250,
        "scale": 0.95,
        "rotation": 0
      },
      "uploadedAt": "2024-06-17T11:15:00Z",
      "status": "pending"
    }
  ],
  "customerInfo": {
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "0612345678",
    "wilaya": "16 - الجزائر"
  },
  "createdAt": "2024-06-17T10:30:00Z",
  "updatedAt": "2024-06-17T11:15:00Z"
}
```

---

## 🎯 الفوائد الرئيسية

| الميزة | الفائدة |
|-------|--------|
| **العزل الكامل** | كل جهة مستقلة تماماً بدون تأثير متبادل |
| **منع التداخل** | بطاقات منفصلة + CSS Grid تضمن عدم التداخل |
| **سهولة الإدارة** | دوال منفصلة لكل عملية (تحديث، حذف، إضافة) |
| **الاستجابة** | عمودي على الهاتف، أفقي على سطح المكتب |
| **التوسعية** | يمكن إضافة جهات جديدة بسهولة |
| **قابلية الصيانة** | شفرة نظيفة منظمة وموثقة |

---

## 📝 الملفات المُنشأة

1. **`schemas/customOrder.schema.json`** - JSON Schema للبيانات
2. **`utils/customOrderManager.js`** - منطق إدارة البيانات
3. **`client/src/components/CustomOrderDisplayVue.vue`** - مكون العرض
4. **`css/custom-order-display.css`** - التنسيقات Responsive
5. **`client/src/components/CustomOrderDisplay.vue`** - نسخة React (JSX)

---

## 🔧 الدعم والصيانة

- جميع الدوال موثقة بـ JSDoc
- معالجة الأخطاء الشاملة
- رسائل خطأ واضحة
- قابلة للتوسع والتخصيص

---

**تم إنشاء هذا الحل بهدف القضاء تماماً على مشكلة تداخل التصاميم وضمان عرض نظيف ومنظم.**
