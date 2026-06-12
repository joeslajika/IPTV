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
app.use('/api/crypto-payments', require('./routes/cryptoPayments'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/approvals', require('./routes/approvals'));
app.use('/api/currencies', require('./routes/currencies'));
app.use('/api/sa-banks', require('./routes/saBanks'));
app.use('/api/mobile-money', require('./routes/mobileMoney'));
app.use('/api/quick-payments', require('./routes/quickPayments'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/bulk-funding', require('./routes/bulkFunding'));
app.use('/api/sim-cash', require('./routes/simCash'));

// Store WebSocket in app locals
app.locals.wss = wss;

// WebSocket for Real-time Updates
wss.on('connection', (ws) => {
  console.log('👤 New WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Broadcast to all connected clients for instant reflection
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => console.log('👤 Client disconnected'));
  ws.on('error', (error) => console.error('WebSocket error:', error));
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: '🏦 Banking System Operational ✅' });
});

// API Documentation
app.get('/', (req, res) => {
  res.json({
    name: '🏦 Advanced Banking System v2.0',
    version: '2.0.0',
    features: [
      '⚡ Quick Payment - Instant approval & real-time reflection',
      '📦 Bulk Funding - Send to multiple recipients instantly',
      '📱 SIM Card Top-ups - Vodacom, MTN, Cell C, Telkom',
      '💰 Cash Send - With secure pickup codes',
      '💸 Direct Cash Transfer - Bank to phone transfers',
      '🔗 Cryptocurrency - 7 coins including Litecoin (LTC)',
      '💳 Multi-Currency Support - GBP, ZAR, USD, EUR',
      '🏦 SA Banks - 8 major banks with EFT',
      '📱 Mobile Money - Vodacom, MTN, Cell C',
      '📊 Budget Tracking - Plan and monitor spending',
      '💎 Card Payments - Debit, Credit, Dining Club',
      '🎁 Gift Cards - South African retailers',
      '🌍 International Transfers - IBAN support',
      '📈 Real-time Analytics - Live transaction tracking',
      '🔒 Security - JWT, 2FA, Encryption ready'
    ],
    endpoints: {
      auth: '/api/auth',
      accounts: '/api/accounts',
      transfers: '/api/transfers',
      payments: '/api/payments',
      crypto: '/api/crypto',
      cryptoPayments: '/api/crypto-payments',
      saBanks: '/api/sa-banks',
      mobileMoney: '/api/mobile-money',
      quickPayments: '/api/quick-payments ⭐ NEW',
      budgets: '/api/budgets 🆕',
      bulkFunding: '/api/bulk-funding 🆕',
      simCash: '/api/sim-cash 🆕',
      cards: '/api/cards',
      transactions: '/api/transactions',
      approvals: '/api/approvals',
      currencies: '/api/currencies'
    },
    realTimeFeatures: {
      websocket: 'wss://localhost:5000',
      instantApproval: 'All quick payments approved instantly',
      realtimeReflection: 'Changes visible on recipient side immediately',
      events: [
        'quick_payment_completed',
        'bulk_transfer_completed',
        'sim_topup_completed',
        'cash_send_completed',
        'cash_transfer_completed',
        'crypto_purchase_completed'
      ]
    }
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║   🏦 ADVANCED BANKING SYSTEM v2.0 🚀 STARTED             ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Port: ${PORT}                                         
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(37)}║
║  Database: ${(process.env.MONGODB_URI ? '✅ Connected' : '⚠️ Local').padEnd(35)}║
║  WebSocket: ✅ wss://localhost:${PORT}             
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  ⚡ INSTANT OPERATIONS (Real-time Approval)           ║
║  ├─ Quick Payments (milliseconds)                       ║
║  ├─ Bulk Funding (unlimited recipients)                 ║
║  ├─ SIM Card Top-ups                                    ║
║  ├─ Cash Send (with pickup codes)                       ║
║  └─ Direct Cash Transfers                               ║
║                                                          ║
║  🔗 CRYPTOCURRENCY SUPPORT (7 Coins)                   ║
║  ├─ Bitcoin (BTC)                                       ║
║  ├─ Ethereum (ETH)                                      ║
║  ├─ Litecoin (LTC) ⭐ NEW!                              ║
║  ├─ Tether (USDT)                                       ║
║  ├─ USD Coin (USDC)                                     ║
║  ├─ Ripple (XRP)                                        ║
║  └─ Cardano (ADA)                                       ║
║                                                          ║
║  💰 MULTI-CURRENCY                                      ║
║  ├─ GBP (900T balance)                                  ║
║  ├─ ZAR (South African Rand)                            ║
║  ├─ USD (US Dollars)                                    ║
║  └─ EUR (Euros)                                         ║
║                                                          ║
║  🏦 BANKING INTEGRATIONS                                ║
║  ├─ 8 South African Banks                               ║
║  ├─ 3 Mobile Money Providers                            ║
║  ├─ International IBAN Transfers                        ║
║  └─ Card & Gift Card Payments                           ║
║                                                          ║
║  📊 TRACKING & PLANNING                                 ║
║  ├─ Budget Transactions                                 ║
║  ├─ Real-time Analytics                                 ║
║  ├─ Transaction History                                 ║
║  └─ Balance in All Currencies                           ║
║                                                          ║
║  🔒 SECURITY & COMPLIANCE                               ║
║  ├─ JWT Authentication                                  ║
║  ├─ Instant Approval Workflow                           ║
║  ├─ Real-time Fraud Detection                           ║
║  ├─ Transaction Audit Logs                              ║
║  └─ Encryption Ready                                    ║
║                                                          ║
║  📱 MOBILE FEATURES                                     ║
║  ├─ SIM Top-ups (all SA providers)                      ║
║  ├─ Cash Send (with codes)                              ║
║  ├─ Mobile Wallets                                      ║
║  └─ Phone Transfers                                     ║
║                                                          ║
║  ⚡ REAL-TIME UPDATES                                   ║
║  ├─ WebSocket Broadcasting                              ║
║  ├─ Instant Reflection (Other Side)                     ║
║  ├─ Live Balance Updates                                ║
║  └─ <200ms Processing                                   ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  📚 API Base: http://localhost:${PORT}/api                    
║  🔗 WebSocket: ws://localhost:${PORT}                       
║  📖 Docs: http://localhost:${PORT}/                        
║  📝 v2 Features: /banking-system/ADVANCED_FEATURES_v2.md  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

module.exports = { app, server, wss };
