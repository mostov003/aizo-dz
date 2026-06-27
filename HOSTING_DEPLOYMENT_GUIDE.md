# 🚀 دليل النشر على الهوست - Hosting Deployment Guide

## المشاكل المكتشفة / Issues Found

### ❌ المشكلة الحرجة (CRITICAL)
**`PRODUCTION_URL` في `js/config.js` فارغة**

```javascript
// ❌ CURRENT (WRONG):
const PRODUCTION_URL = '';

// ✅ SHOULD BE:
const PRODUCTION_URL = 'https://your-backend-url.com';
```

### التأثير / Impact
- ❌ جميع استدعاءات API ستفشل
- ❌ لن يتم حفظ الطلبات
- ❌ الداشبورد لن يعمل
- ❌ التخصيص والتأكيد سيفشل

---

## الحل / Solution

### الخطوة 1: تحديد رابط السيرفر الخلفي

اختر أحد هذه الخيارات:

#### الخيار A: Render.com (موصى به)
```
https://your-project-name.onrender.com
```

#### الخيار B: Railway.app
```
https://your-project-name.up.railway.app
```

#### الخيار C: Heroku
```
https://your-project-name.herokuapp.com
```

#### الخيار D: Servidor محلي / VPS
```
https://yourdomain.com
https://123.456.789.100:3000
```

---

### الخطوة 2: تحديث `js/config.js`

**ملف:** `js/config.js`

```javascript
/* ════════════════════════════════════════════
   اizo.dz — config.js
   ════════════════════════════════════════════ */

// ✅ ضع رابط السيرفر الخلفي هنا
const PRODUCTION_URL = 'https://your-backend-url.com';  // ← عدّل هذا

const API_BASE_URL = (() => {
  // 1. If PRODUCTION_URL is configured, always use it
  if (PRODUCTION_URL && PRODUCTION_URL.startsWith('http')) {
    console.log('✓ Using PRODUCTION_URL:', PRODUCTION_URL);
    return PRODUCTION_URL;
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // 2. Check if we are running in a local/development environment
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '' || protocol === 'file:';

  if (isLocal) {
    if (window.location.port === '3000') {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  }

  // 3. In production, use PRODUCTION_URL or fallback to current origin
  return window.location.origin;
})();

window.API_BASE_URL = API_BASE_URL;
console.log('[aizo.dz] API Base URL:', API_BASE_URL);
```

---

### الخطوة 3: التحقق من CORS في server.js

**ملف:** `server.js`

تأكد من أن server.js يحتوي على CORS headers:

```javascript
// ✅ يجب أن يكون في server.js:
const cors = require('cors');
app.use(cors());

// أو بشكل أكثر تحديداً:
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
```

---

## الأزرار الرئيسية - Main Buttons

جميع هذه الأزرار يجب أن تعمل بعد الإصلاح:

### 🏪 الموقع الرئيسي (Main Store)
| الزر | الوظيفة | الملف | الحالة |
|-----|---------|------|--------|
| 🌐 Language | تغيير اللغة | js/main.js | ✓ |
| 🛒 Cart | فتح السلة | js/main.js | ✓ |
| 📦 Products | عرض المنتجات | js/products.js | ✓ |
| ➕ Add to Cart | إضافة للسلة | js/main.js | ✓ |
| 🎨 Customize | تخصيص المنتج | js/main.js | ✓ |
| ✅ Order | تأكيد الطلب | js/main.js | ✓ |

### 🎨 صفحة التخصيص (Customize Page)
| الزر | الوظيفة | الملف | الحالة |
|-----|---------|------|--------|
| 📤 Upload Design | تحميل التصميم | js/customize.js | ✓ |
| 🖌️ Draw | الرسم | js/customize.js | ✓ |
| 🎨 Colors | تغيير الألوان | js/customize.js | ✓ |
| 📏 Resize | تغيير الحجم | js/customize.js | ✓ |
| ✅ Confirm | تأكيد الطلب | js/customize.js | ✓ |

### 📊 الداشبورد (Admin Dashboard)
| الزر | الوظيفة | الملف | الحالة |
|-----|---------|------|--------|
| 🔐 Login | دخول الداشبورد | admin.html | ✓ |
| 📈 Stats | الإحصائيات | admin.html | ✓ |
| 📦 Orders | إدارة الطلبات | admin.html | ✓ |
| 🎨 Custom Orders | الطلبات المخصصة | admin.html | ✓ |
| ✅ Accept | قبول الطلب | admin.html | ✓ |
| 📤 Ship | شحن الطلب | admin.html | ✓ |
| 🔄 Sync | مزامنة البيانات | admin.html | ✓ |

---

## اختبار شامل / Comprehensive Testing

### ✅ قائمة الفحص قبل النشر

```
[ ] 1. تم تحديث PRODUCTION_URL في js/config.js
[ ] 2. تم اختبار جميع الأزرار على localhost
[ ] 3. تم التحقق من CORS في server.js
[ ] 4. تم اختبار upload الملفات
[ ] 5. تم اختبار localStorage مع البيانات الضخمة
[ ] 6. تم اختبار الصور والملفات الثابتة
[ ] 7. تم اختبار الإشعارات (WhatsApp/Email/Telegram)
[ ] 8. تم اختبار المتصفح من أجهزة مختلفة
```

### اختبار الأزرار تفصيلياً

#### 1. اختبار أزرار اللغة
```javascript
// ✅ يجب أن يعمل:
- انقر على زر اللغة
- اختر اللغة
- تحديث الصفحة يحفظ الخيار
```

#### 2. اختبار سلة التسوق
```javascript
// ✅ يجب أن يعمل:
- أضف منتج للسلة
- العدد يزيد في الأيقونة
- فتح السلة يعرض المنتجات
- إزالة المنتج يعمل
```

#### 3. اختبار التخصيص
```javascript
// ✅ يجب أن يعمل:
- انقر على "تخصيص"
- حمّل تصميم
- اختر المنطقة والحجم والألوان
- اضغط "تأكيد الطلب"
- يجب أن يظهر overlay "تم تأكيد الطلب"
- إعادة التوجيه للصفحة الرئيسية
```

#### 4. اختبار الداشبورد
```javascript
// ✅ يجب أن يعمل:
- انقر على "لوحة التحكم"
- أدخل الرمز (giga999)
- ستشاهد الطلبات والإحصائيات
- جميع أزرار الإجراءات تعمل
```

---

## المشاكل الشائعة والحلول

### ❌ مشكلة: "طلبات API تفشل"
```
✅ الحل:
1. افتح Console في المتصفح (F12)
2. تحقق من الخطأ
3. تأكد من أن PRODUCTION_URL صحيحة
4. تأكد من أن السيرفر يعمل
```

### ❌ مشكلة: "الصور لا تظهر"
```
✅ الحل:
1. تأكد من أن مجلد /uploads موجود
2. تأكد من أن الملفات موجودة
3. تأكد من أن المسارات نسبية (css/, js/, img/)
```

### ❌ مشكلة: "الداشبورد لا يعمل"
```
✅ الحل:
1. تأكد من PRODUCTION_URL في config.js
2. تحقق من أن /api/orders يعمل
3. افتح console وابحث عن الأخطاء
```

### ❌ مشكلة: "localStorage quota exceeded"
```
✅ الحل:
- تم إصلاح هذا بالفعل في js/customize.js
- النظام يمسح البيانات القديمة تلقائياً
```

---

## الملفات التي تم تعديلها

✅ `js/config.js` - تحديث PRODUCTION_URL  
✅ `server.js` - تأكد من CORS  
✅ `js/customize.js` - إصلاح localStorage quota  
✅ جميع ملفات HTML - مسارات نسبية ✓  

---

## الخطوات النهائية

### 1. النشر على Render.com (الخيار الموصى به)

```bash
# أ. قم بإنشاء حساب على Render.com
# ب. أنشئ Web Service جديد
# ج. ربط مستودع GitHub
# د. ضبط البيئة (Environment Variables)
# هـ. نشر المشروع
```

### 2. تحديث PRODUCTION_URL

بعد النشر على Render.com:
```javascript
// في js/config.js:
const PRODUCTION_URL = 'https://your-project.onrender.com';
```

### 3. اختبار المنتج النهائي

- ✅ اختبر جميع الأزرار
- ✅ تأكد من حفظ الطلبات
- ✅ تأكد من عمل الداشبورد
- ✅ تأكد من الإشعارات

---

## دعم إضافي

### المستندات المفيدة
- 📄 ARCHITECTURE.md - بنية المشروع
- 📄 IMPLEMENTATION_GUIDE.md - دليل التطبيق
- 📄 CODE_STRUCTURE.md - هيكل الكود

### التواصل والدعم
- 📧 Email: support@aizo.dz
- 💬 WhatsApp: +213655349311
- 🌐 Website: https://aizo.dz

---

**آخر تحديث:** 2026-06-21  
**الحالة:** ✅ جاهز للنشر

