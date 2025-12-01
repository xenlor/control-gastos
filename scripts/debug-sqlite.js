const Database = require('better-sqlite3');
const path = require('path');

const sqlitePath = path.join(__dirname, '../dev.db');
console.log('Checking database at:', sqlitePath);

try {
    const sqlite = new Database(sqlitePath, { fileMustExist: true });
    const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables found:', tables);
} catch (e) {
    console.error('Error opening database:', e);
}
