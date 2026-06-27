const db = require('c:/Users/pc/Desktop/aizo-dz/utils/db');
db.query('SELECT COUNT(*) FROM "Order" WHERE "customOrder" = true AND "customOrderDetails" IS NULL')
  .then(rows => {
    console.log('COUNT NULL:', rows);
  })
  .catch(err => {
    console.error('QUERY FAILED:', err);
  })
  .finally(() => {
    db.closeDb();
  });
