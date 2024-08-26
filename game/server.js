const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = {}; // Store game state here

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        // Handle incoming messages (moves, game state requests, etc.)
        console.log('Received:', message);
        
        // Broadcast updated game state to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(gameState));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server is listening on port 4000');
});
