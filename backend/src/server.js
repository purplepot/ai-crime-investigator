import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import casesRouter from './routes/cases.js';
import agentsRouter from './routes/agents.js';
import evidenceRouter from './routes/evidence.js';
import { initWebSocket } from './websocket/wsServer.js';
import { initializeSchema } from './db/schema.js';
import { getDb } from './db/connection.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cases', casesRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/evidence', evidenceRouter);

const server = http.createServer(app);
initWebSocket(server);

const PORT = process.env.PORT || 3001;

const start = async () => {
  await getDb(); // connect to DB
  await initializeSchema();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
