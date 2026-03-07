require('dotenv').config();
const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');
const chatHandler = require('./api/chat');
const { handleVoiceSocket } = require('./api/voice');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.post('/api/chat', (req, res) => {
    chatHandler(req, res);
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/voice' });

wss.on('connection', (ws) => {
    handleVoiceSocket(ws);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`WebSocket voice endpoint at ws://localhost:${PORT}/voice`);
});
