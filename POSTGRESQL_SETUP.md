# PostgreSQL Migration Guide

## 🎯 خطوات إعداد PostgreSQL

### الخطوة 1️⃣: إنشاء قاعدة البيانات

**الخيار A: استخدام Railway (مجاني - الموصى به)**
1. اذهب إلى https://railway.app
2. سجل دخول أو أنشئ حساب
3. انقر على "New Project" → Select "Provision PostgreSQL"
4. انسخ الـ Connection String
5. الصق الـ Connection String في `.env` بدلاً من `DATABASE_URL`

**الخيار B: استخدام PostgreSQL محلي**
1. ثبت PostgreSQL من: https://www.postgresql.org/download/windows/
2. افتح pgAdmin (يأتي مع PostgreSQL)
3. انشئ database جديد باسم `aizo_db`
4. الـ Connection String:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/aizo_db"
   ```
5. ضع كلمة المرور التي استخدمتها عند التثبيت

### الخطوة 2️⃣: تشغيل Migrations

```bash
cd c:\Users\pc\Desktop\aizo-dz

# إنشاء جداول قاعدة البيانات
npx prisma migrate dev --name init

# أو فقط:
npx prisma db push
```

### الخطوة 3️⃣: نقل البيانات من JSON

```bash
# تشغيل سكريبت النقل
node migrate-to-postgres.js
```

سيقوم الـ script بـ:
- ✅ نقل جميع الطلبات
- ✅ نقل جميع الرسائل
- ✅ نقل جميع المنتجات

---

## 📝 تعديل API Endpoints

جميع API endpoints الحالية تستخدم JSON Files. قمت بإنشاء helper functions في `utils/db.js`.

### مثال: تحويل API endpoint

**قبل (JSON Files):**
```javascript
app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  res.json(orders);
});
```

**بعد (PostgreSQL + Prisma):**
```javascript
const { getAllOrders } = require('./utils/db');

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## 🔧 Prisma Commands

```bash
# عرض Prisma Studio (واجهة رسومية لقاعدة البيانات)
npx prisma studio

# إنشاء migration جديد
npx prisma migrate dev --name add_new_field

# تطبيق migrations
npx prisma db push

# مسح وإعادة إنشاء قاعدة البيانات (تنويه: سيحذف البيانات!)
npx prisma migrate reset
```

---

## 📚 Available Database Functions

في `utils/db.js` متوفرة الدوال التالية:

### Orders
- `getAllOrders()` - جلب جميع الطلبات
- `getOrderById(id)` - جلب طلب معين
- `getOrderByNumber(orderNumber)` - جلب طلب برقم الطلب
- `createOrder(orderData)` - إنشاء طلب جديد
- `updateOrderStatus(orderId, status)` - تحديث حالة الطلب
- `updateOrderShipping(orderId, shippingData)` - تحديث معلومات الشحن
- `deleteOrder(orderId)` - حذف طلب

### Leads
- `getAllLeads()` - جلب جميع الرسائل
- `createLead(email, name, message)` - إنشاء رسالة جديدة
- `deleteLead(leadId)` - حذف رسالة

### Products
- `getAllProducts()` - جلب جميع المنتجات
- `createProduct(productData)` - إنشاء منتج جديد

---

## 📊 Prisma Schema

تم إنشاء Schema كامل مع الجداول التالية:

- **Order** - جدول الطلبات
- **OrderItem** - تفاصيل المنتجات في الطلب
- **CustomLayer** - طبقات التصميم المخصص
- **Lead** - الرسائل والاستفسارات
- **Product** - المنتجات
- **ProductStock** - مخزون المنتجات
- **Setting** - الإعدادات

---

## ⚠️ ملاحظات مهمة

1. **DATABASE_URL**: يجب أن تكون موجودة في `.env` قبل تشغيل الـ server
2. **Prisma Client**: يتم إنشاء instance واحد في `utils/db.js` ويتم إعادة استخدامه
3. **Migrations**: احفظ migration files في `prisma/migrations/`
4. **JSON Files**: يمكنك الاحتفاظ بـ JSON files للنسخ الاحتياطية

---

## 🚀 تشغيل الخادم مع PostgreSQL

```bash
# بعد إعداد DATABASE_URL و تشغيل migrations:
node server.js
```

الخادم سيبدأ بـ ✅ Server Started وجاهز للعمل!

---

## 🆘 استكشاف الأخطاء

### خطأ: "ECONNREFUSED"
- قاعدة البيانات غير متصلة
- تأكد من تشغيل PostgreSQL
- تحقق من DATABASE_URL

### خطأ: "P2002: Unique constraint failed"
- محاولة إدراج بيانات مكررة
- تحقق من uniqueness constraints في Schema

### خطأ: "P2025: Record to delete not found"
- محاولة حذف سجل غير موجود
- تحقق من الـ ID

---

## 📞 للمساعدة

في حالة احتياج إلى تحويل API endpoints إضافية، راجع:
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
