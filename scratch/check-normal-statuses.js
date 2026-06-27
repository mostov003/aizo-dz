const db = require('../utils/db');
db.query('SELECT DISTINCT "status" FROM "Order" WHERE "customOrder" IS NOT TRUE')
  .then(rows => {
    console.log('REGULAR ORDER STATUSES IN DB:', rows);
  })
  .catch(err => {
    console.error('QUERY FAILED:', err);
  })
  .finally(() => {
    db.closeDb();
  });
