/**
 * Prisma Connection Test
 */

require('dotenv/config');

console.log('📋 Environment Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '***' : 'NOT SET');

try {
  console.log('\n🔧 Attempting to create PrismaClient...');
  const { PrismaClient } = require('@prisma/client');
  
  const prisma = new PrismaClient();
  
  console.log('✅ PrismaClient created successfully!');
  console.log('prisma:', typeof prisma);
  console.log('prisma.order:', typeof prisma.order);
  
  process.exit(0);
} catch (err) {
  console.error('❌ Error:', err.message);
  console.error('\n🔍 Full Error:');
  console.error(err);
  process.exit(1);
}
