import fs from 'fs';

let sql = fs.readFileSync('db/schema.sql', 'utf8');
sql = sql.replace(/CREATE TABLE IF NOT EXISTS /g, 'CREATE TABLE ');
sql = sql.replace(/\bsource\b/g, '"SOURCE"');
fs.writeFileSync('db/schema.sql', sql);
