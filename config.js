/**
 * Configuration Module - إدارة الإعدادات
 * Production-Ready: جميع المفاتيح الحساسة تُقرأ حصرياً من متغيرات البيئة (.env)
 */

require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
  
  // ZR Express API Configuration
  // ⚠️ المفاتيح يجب أن تكون في ملف .env فقط — لا تضع قيم افتراضية هنا
  zr: {
    secretKey: process.env.ZR_SECRET_KEY || '',
    tenantId: process.env.ZR_TENANT_ID || '',
    baseUrl: process.env.ZR_BASE_URL || 'https://api.zrexpress.app/api/v1'
  }
};

// التحقق من المتطلبات الأساسية
if (!config.zr.secretKey || !config.zr.tenantId) {
  console.warn('⚠️ تنبيه: مفاتيح ZR Express غير متوفرة في ملف .env — خدمة الشحن لن تعمل.');
  console.warn('   يرجى ضبط ZR_SECRET_KEY و ZR_TENANT_ID في ملف .env');
}

if (config.nodeEnv === 'production' && config.allowedOrigins.includes('*')) {
  console.warn('⚠️ تنبيه: ALLOWED_ORIGINS مضبوط على "*" في بيئة الإنتاج. يُنصح بتحديد الدومينات المسموحة.');
}

console.log('✓ الإعدادات تم تحميلها بنجاح');
console.log(`  البيئة: ${config.nodeEnv} | المنفذ: ${config.port}`);

module.exports = config;
