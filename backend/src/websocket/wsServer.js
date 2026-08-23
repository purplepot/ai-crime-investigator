import { WebSocketServer } from 'ws';

let wss = null;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket.');
    ws.on('close', () => console.log('Client disconnected.'));
  });
};

export const broadcast = (message) => {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
};
