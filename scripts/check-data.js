const Database = require('better-sqlite3');
const path = require('path');

const sqlitePath = path.join(__dirname, '../dev.db');
console.log('Checking database at:', sqlitePath);

const sqlite = new Database(sqlitePath, { fileMustExist: true });

const tables = ['Categoria', 'Gasto', 'Ingreso'];

tables.forEach(table => {
    try {
        const count = sqlite.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
        console.log(`${table}: ${count.count} rows`);
        if (count.count > 0) {
            const rows = sqlite.prepare(`SELECT * FROM ${table} LIMIT 3`).all();
            console.log(`Sample data for ${table}:`, rows);
        }
    } catch (e) {
        console.log(`${table}: Error - ${e.message}`);
    }
});
