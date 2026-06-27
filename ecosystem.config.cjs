/**
 * PM2 Ecosystem Configuration — إعداد PM2 للإنتاج
 * 
 * الاستخدام:
 *   pm2 start ecosystem.config.cjs
 *   pm2 restart aizo-dz
 *   pm2 logs aizo-dz
 *   pm2 stop aizo-dz
 */

module.exports = {
  apps: [
    {
      name: 'aizo-dz',
      script: 'server.js',
      
      // بيئة الإنتاج
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },

      // إعادة التشغيل التلقائي
      autorestart: true,
      watch: false, // لا تستخدم watch في الإنتاج
      max_restarts: 10,
      restart_delay: 5000, // 5 ثوانٍ بين محاولات إعادة التشغيل

      // حدود الذاكرة — يعيد التشغيل إذا تجاوز 512MB
      max_memory_restart: '512M',

      // Logs — إدارة السجلات
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      merge_logs: true,
      log_type: 'json',

      // عدد العمليات — "1" للتطبيقات البسيطة
      // استخدم "max" لاستغلال كل أنوية المعالج (Cluster Mode)
      instances: 1,
      exec_mode: 'fork',
    }
  ]
};
