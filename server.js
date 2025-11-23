require('dotenv').config();
const express = require('express');
const path = require('path');
const chatHandler = require('./api/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// API Route
app.post('/api/chat', (req, res) => {
    chatHandler(req, res);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to test the chatbot.`);
});
