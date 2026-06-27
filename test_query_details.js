const db = require('c:/Users/pc/Desktop/aizo-dz/utils/db');
db.query('SELECT * FROM "Order" WHERE "orderNumber" LIKE \'%2803%\'')
  .then(rows => {
    console.log('SPECIFIC ORDER:', rows);
  })
  .catch(err => {
    console.error('QUERY FAILED:', err);
  })
  .finally(() => {
    db.closeDb();
  });
