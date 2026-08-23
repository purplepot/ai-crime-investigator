import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeSchema = async () => {
  try {
    const db = await getDb();
    
    // 1. Run Schema
    const schemaPath = path.resolve(__dirname, '../../../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      const commands = sql.split(';').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
      
      for (const cmd of commands) {
        try {
          await db.execute(cmd);
        } catch (err) {
          if (!err.message?.includes('already exists')) {
            console.warn(`Schema warning: ${err.message}`);
          }
        }
      }
      console.log('✓ Exasol schema initialized.');
    }
    
    // 2. Run Seed
    const seedPath = path.resolve(__dirname, '../../../db/seed.sql');
    if (fs.existsSync(seedPath)) {
      const sql = fs.readFileSync(seedPath, 'utf8');
      const commands = sql.split(';').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
      
      await db.execute('OPEN SCHEMA INVESTIGATION');
      
      for (const cmd of commands) {
        try {
          await db.execute(cmd);
        } catch (err) {
          if (!err.message?.includes('already exists') && !err.message?.includes('unique constraint') && !err.message?.includes('primary key')) {
            console.warn(`Seed warning: ${err.message}`);
          }
        }
      }
      console.log('✓ Exasol seed data populated.');
    }
    
  } catch (error) {
    console.error('Error initializing DB:', error.message);
  }
};
