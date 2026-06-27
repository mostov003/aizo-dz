# دليل استخدام مسار الشحن الجديد

## 📋 ملخص التحسينات

تم تنظيف وتحسين كود ZR للشحن بالطرق التالية:

### ✅ المزايا:

1. **أمان محسّن**
   - المفاتيح الحساسة في ملف `.env` وليس في الكود
   - ملف `.gitignore` يمنع تشارك البيانات الحساسة
   
2. **تنظيم أفضل**
   - فصل الإعدادات في `config.js`
   - مسارات الشحن في `routes/shipments.js`
   - كود الخادم الرئيسي نظيف وسهل الصيانة

3. **معالجة أخطاء محسّنة**
   - Validation middleware للتحقق من البيانات
   - رسائل خطأ واضحة بالعربية
   - تحذيرات عند عدم اكتمال الإعدادات

4. **سهولة الصيانة**
   - إضافة مسارات جديدة بسهولة
   - تحديث الإعدادات دون تعديل الكود
   - توثيق شامل

---

## 🚀 كيفية الاستخدام

### 1. التثبيت الأولي:
```bash
npm install
```

### 2. إعداد متغيرات البيئة:

انسخ ملف `.env.example` واملأ القيم:
```env
ZR_SECRET_KEY=your_actual_secret_key
ZR_TENANT_ID=your_actual_tenant_id
ZR_API_URL=https://api.zr.com/v1/shipments
PORT=3000
NODE_ENV=development
```

### 3. تشغيل الخادم:
```bash
npm start
```

---

## 📡 أمثلة الطلبات

### ✨ إنشاء شحنة جديدة

**الطلب:**
```bash
curl -X POST http://localhost:3000/api/shipments/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-2024-001",
    "customerName": "أحمد علي",
    "customerAddress": "شارع العاصمة، الجزائر",
    "customerPhone": "+213555123456",
    "weight": 1.5
  }'
```

**الرد الناجح (200):**
```json
{
  "success": true,
  "message": "تم شحن الطلب عبر ZR بنجاح",
  "data": {
    "id": "PARCEL-12345",
    "trackingNumber": "ZR123456789",
    "status": "processing"
  }
}
```

**خطأ - بيانات ناقصة (400):**
```json
{
  "success": false,
  "message": "تأكد من إرسال جميع بيانات العميل ورقم الطلب الأساسية.",
  "requiredFields": ["orderId", "customerName", "customerAddress", "customerPhone"]
}
```

**خطأ - رقم هاتف غير صحيح (400):**
```json
{
  "success": false,
  "message": "رقم الهاتف غير صحيح"
}
```

**خطأ - خادم (500):**
```json
{
  "success": false,
  "message": "حدث خطأ في الخادم أثناء محاولة الاتصال بخدمة التوصيل.",
  "error": "Network error description"
}
```

---

## 📁 هيكل المشروع الجديد

```
aizo-dz/
├── .env                  # متغيرات البيئة (حساس - لا تشارك)
├── .env.example          # قالب توثيقي
├── .gitignore            # منع تشارك ملفات حساسة
├── config.js             # إدارة الإعدادات
├── server.js             # الخادم الرئيسي
├── package.json          # المتطلبات
├── CODE_STRUCTURE.md     # هذا الملف
├── routes/
│   └── shipments.js      # مسارات الشحن
└── db/
    ├── orders.json
    ├── custom_products.json
    └── ...
```

---

## 🔍 التحقق من الإعدادات

عند تشغيل الخادم، ستظهر رسالة تحذير إذا كانت متغيرات ZR ناقصة:

```
⚠️ تحذير: متغيرات ZR API غير مكتملة. تأكد من ملف .env
```

تأكد من إكمال ملف `.env` بالقيم الصحيحة.

---

## 💡 نصائح إضافية

- **للتطوير**: استخدم `npm run dev` (أضفها إلى scripts في package.json إذا أردت)
- **للإنتاج**: استخدم `NODE_ENV=production npm start`
- **لتحديث الإعدادات**: عدّل `.env` وأعد تشغيل الخادم

---

## 📚 المراجع

- [ZR Express API Documentation](https://docs.zrexpress.app)
- [Express.js Documentation](https://expressjs.com)
- [dotenv Documentation](https://github.com/motdotla/dotenv)
