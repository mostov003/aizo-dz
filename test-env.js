require('dotenv/config');

console.log('🔍 Testing DATABASE_URL loading:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '***' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
