import fs from 'fs';
import path from 'path';
import { getDb } from './src/db/connection.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const runSeed = async () => {
  const db = await getDb();
  const sql = fs.readFileSync('../db/seed.sql', 'utf8');
  const commands = sql.split(';').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
  
  for (const cmd of commands) {
    try {
      if (cmd.toUpperCase().includes('INSERT')) {
         await db.execute(cmd);
      } else {
         await db.query(cmd);
      }
    } catch (err) {
      if (!err.message?.includes('already exists')) {
        console.warn(`Seed command warning: ${err.message}`);
      }
    }
  }
  console.log('Seed executed successfully.');
  process.exit(0);
};

runSeed();
