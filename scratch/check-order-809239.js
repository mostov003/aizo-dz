const db = require('../utils/db');
db.query('SELECT * FROM "Order" WHERE "orderNumber" = \'AZ-809239\'')
  .then(rows => {
    console.log('ORDER AZ-809239:', JSON.stringify(rows, null, 2));
  })
  .catch(err => {
    console.error('QUERY FAILED:', err);
  })
  .finally(() => {
    db.closeDb();
  });
