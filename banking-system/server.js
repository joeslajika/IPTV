const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/banking-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/crypto', require('./routes/crypto'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/approvals', require('./routes/approvals'));
app.use('/api/currencies', require('./routes/currencies'));

// WebSocket for Real-time Updates
wss.on('connection', (ws) => {
  console.log('👤 New WebSocket client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    // Broadcast to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
  
  ws.on('close', () => console.log('👤 Client disconnected'));
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Banking System Operational ✅' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🏦 Banking System Server running on port ${PORT}`);
});

module.exports = { app, server, wss };
