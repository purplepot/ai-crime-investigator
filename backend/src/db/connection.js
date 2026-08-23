import { ExasolDriver } from '@exasol/exasol-driver-ts';
import { WebSocket } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

let driverInstance = null;

class Mutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }
  async lock() {
    return new Promise(resolve => {
      if (this.locked) {
        this.queue.push(resolve);
      } else {
        this.locked = true;
        resolve();
      }
    });
  }
  unlock() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.locked = false;
    }
  }
}
const dbMutex = new Mutex();

export const getDb = async () => {
  if (!driverInstance) {
    driverInstance = new ExasolDriver(
      (url) => new WebSocket(url, { rejectUnauthorized: false }),
      {
        host: process.env.EXASOL_HOST || 'localhost',
        port: parseInt(process.env.EXASOL_PORT || '8563', 10),
        user: process.env.EXASOL_USER || 'sys',
        password: process.env.EXASOL_PASSWORD || 'exasol'
      }
    );
    await driverInstance.connect();
    
    const originalQuery = driverInstance.query.bind(driverInstance);
    const originalExecute = driverInstance.execute.bind(driverInstance);
    
    driverInstance.query = async (...args) => {
      await dbMutex.lock();
      try { return await originalQuery(...args); }
      finally { dbMutex.unlock(); }
    };
    
    driverInstance.execute = async (...args) => {
      await dbMutex.lock();
      try { return await originalExecute(...args); }
      finally { dbMutex.unlock(); }
    };

    console.log('Connected to Exasol DB.');
  }
  return driverInstance;
};
