const db = require('../utils/db');
db.query('SELECT id, "orderNumber", "customOrder" FROM "Order" WHERE "customOrder" IS NOT TRUE LIMIT 10')
  .then(rows => {
    console.log('REGULAR ORDERS:', rows);
  })
  .catch(err => {
    console.error('QUERY FAILED:', err);
  })
  .finally(() => {
    db.closeDb();
  });
