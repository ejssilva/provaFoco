const Database = require('better-sqlite3');
const db = new Database('sqlite.db');

try {
  const q = db.prepare('SELECT id FROM questions LIMIT 1').get();
  console.log('First question ID:', q ? q.id : 'None');
} catch (e) {
  console.log('Error:', e.message);
}
