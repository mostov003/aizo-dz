/**
 * Database Setup Script
 * تشغيل Prisma db push بـ Node
 */

const { execSync } = require('child_process');

console.log('🚀 جاري إنشاء جداول قاعدة البيانات...\n');

try {
  const result = execSync('npx prisma db push --accept-data-loss', {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('\n✅ تم إنشاء الجداول بنجاح!');
  console.log('📊 الآن يمكنك نقل البيانات من JSON\n');
  
  process.exit(0);
} catch (err) {
  console.error('\n❌ خطأ:', err.message);
  process.exit(1);
}
