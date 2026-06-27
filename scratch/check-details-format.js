const db = require('../utils/db');
db.query('SELECT id, "orderNumber", "customOrder", "customOrderDetails" FROM "Order" WHERE "customOrder" = true LIMIT 3')
  .then(rows => {
    console.log('RECORDS:', JSON.stringify(rows, null, 2));
  })
  .catch(err => {
    console.error('QUERY FAILED:', err);
  })
  .finally(() => {
    db.closeDb();
  });
