# Enhanced Payment Options Documentation

## 🇿🇦 South African Bank Transfers

### Transfer to SA Bank Account
**POST** `/api/sa-banks/transfer-sa-bank`

```json
{
  "fromAccountId": "account-id",
  "toAccountNumber": "12345678901",
  "toBankCode": "ABSA|FNB|STANDARD|NEDBANK|CAPITEC|INVESTEC|BIDVEST|AFRICAN_BANK",
  "toAccountHolder": "John Doe",
  "amount": 5000,
  "reference": "INV001",
  "purpose": "Invoice payment"
}
```

**Supported Banks:**
- ABSA (ABSA Group Limited)
- FNB (First National Bank)
- STANDARD (Standard Bank)
- NEDBANK (Nedbank)
- CAPITEC (Capitec Bank)
- INVESTEC (Investec Bank)
- BIDVEST (Bidvest Bank)
- AFRICAN_BANK (African Bank)

**Response:**
```json
{
  "success": true,
  "transactionId": "uuid",
  "status": "processing",
  "amount": 5000,
  "currency": "ZAR",
  "toBank": "ABSA Group Limited",
  "estimatedDelivery": "24-48 business hours",
  "message": "✅ Transfer initiated to South African bank"
}
```

**Features:**
- ✅ Direct bank-to-bank transfers
- ✅ Automatic SWIFT code routing
- ✅ Real-time confirmation
- ✅ Transaction reference tracking
- ✅ 24-48 hour delivery

---

## 📱 Mobile Money Wallet Transfers

### Send to Mobile Wallet
**POST** `/api/mobile-money/send-wallet`

```json
{
  "fromAccountId": "account-id",
  "phoneNumber": "0712345678",
  "provider": "VODACOM|MTN|CELL_C",
  "amount": 500,
  "reference": "Wallet topup"
}
```

**Supported Providers:**
- **VODACOM M-Pesa** (Fee: 2%)
  - Prefix: 0739
  - Min: R10, Max: R500,000
  
- **MTN Mobile Money** (Fee: 1.8%)
  - Prefix: 0786
  - Min: R10, Max: R500,000
  
- **CellC Moola** (Fee: 2%)
  - Prefix: 0835
  - Min: R10, Max: R500,000

**Response:**
```json
{
  "success": true,
  "transactionId": "uuid",
  "status": "completed",
  "provider": "Vodacom M-Pesa",
  "phoneNumber": "0712345678",
  "amount": 500,
  "fee": 10,
  "total": 510,
  "currency": "ZAR",
  "processingTime": "245ms",
  "message": "✅ Sent R500.00 to 0712345678 via Vodacom M-Pesa"
}
```

**Features:**
- ✅ Instant mobile wallet top-up
- ✅ Automatic fee calculation
- ✅ Phone number validation
- ✅ Real-time processing
- ✅ Support for major SA providers

---

## 🔗 Cryptocurrency Trading

### Buy Cryptocurrency
**POST** `/api/crypto-payments/buy`

```json
{
  "fromAccountId": "account-id",
  "cryptoType": "BTC|ETH|USDT|USDC|XRP|ADA",
  "fiatAmount": 5000,
  "fiatCurrency": "USD|GBP|ZAR|EUR",
  "walletAddress": "0x1234567890..."
}
```

**Supported Cryptocurrencies:**
- **BTC** - Bitcoin (8 decimals)
- **ETH** - Ethereum (18 decimals)
- **USDT** - Tether (6 decimals)
- **USDC** - USD Coin (6 decimals)
- **XRP** - Ripple (6 decimals)
- **ADA** - Cardano (6 decimals)

**Response:**
```json
{
  "success": true,
  "transactionId": "uuid",
  "status": "completed",
  "purchased": {
    "amount": "0.15234567",
    "type": "BTC",
    "symbol": "BTC"
  },
  "paid": {
    "amount": 5000,
    "currency": "USD"
  },
  "exchangeRate": "32,850.45",
  "newBalance": {
    "USD": 12000,
    "BTC": 1.25
  },
  "message": "✅ Successfully purchased 0.15234567 BTC"
}
```

**Features:**
- ✅ Real-time exchange rates
- ✅ Multiple cryptocurrencies
- ✅ Auto wallet linking
- ✅ Instant transaction completion
- ✅ Portfolio balancing

---

### Sell Cryptocurrency
**POST** `/api/crypto-payments/sell`

```json
{
  "fromAccountId": "account-id",
  "cryptoType": "BTC|ETH|USDT|USDC|XRP|ADA",
  "cryptoAmount": 0.5,
  "fiatCurrency": "USD|GBP|ZAR|EUR"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "uuid",
  "status": "completed",
  "sold": {
    "amount": "0.5",
    "type": "BTC",
    "symbol": "BTC"
  },
  "received": {
    "amount": "16,425.23",
    "currency": "USD"
  },
  "exchangeRate": "32,850.45",
  "newBalance": {
    "USD": 21425.23,
    "BTC": 0.75
  },
  "message": "✅ Successfully sold 0.5 BTC for 16,425.23 USD"
}
```

---

### Get Crypto Exchange Rates
**GET** `/api/crypto-payments/rates?fiatCurrency=USD`

**Response:**
```json
{
  "success": true,
  "baseCurrency": "USD",
  "rates": {
    "BTC": { "name": "Bitcoin", "rate": "32850.45", "currency": "USD" },
    "ETH": { "name": "Ethereum", "rate": "1850.20", "currency": "USD" },
    "USDT": { "name": "Tether", "rate": "1.00", "currency": "USD" },
    "USDC": { "name": "USD Coin", "rate": "1.00", "currency": "USD" },
    "XRP": { "name": "Ripple", "rate": "2.45", "currency": "USD" },
    "ADA": { "name": "Cardano", "rate": "0.95", "currency": "USD" }
  }
}
```

---

### Get Supported Cryptocurrencies
**GET** `/api/crypto-payments/supported`

**Response:**
```json
{
  "success": true,
  "count": 6,
  "cryptocurrencies": [
    {
      "code": "BTC",
      "name": "Bitcoin",
      "symbol": "BTC",
      "decimals": 8,
      "requiredConfirmations": 3
    },
    {
      "code": "ETH",
      "name": "Ethereum",
      "symbol": "ETH",
      "decimals": 18,
      "requiredConfirmations": 12
    }
  ]
}
```

---

## 🏦 Complete Payment Workflow

### Example: Buy Crypto with SA Bank Funds

```javascript
// 1. Get account balance
GET /api/accounts/{accountId}/balances
// Returns: GBP: 900T, ZAR: 100,000, USD: 50,000

// 2. Check crypto rates
GET /api/crypto-payments/rates?fiatCurrency=USD

// 3. Buy cryptocurrency
POST /api/crypto-payments/buy
{
  "fromAccountId": "account-id",
  "cryptoType": "BTC",
  "fiatAmount": 5000,
  "fiatCurrency": "USD"
}

// 4. Monitor real-time update via WebSocket
// Event: crypto_purchase_completed

// 5. Check updated balance
GET /api/accounts/{accountId}/balances
// Returns: USD: 45,000, BTC: 0.15234567
```

---

## 💳 Integrated Payment System

### All Payment Methods Available

```
┌─────────────────────────────────────────────┐
│        🏦 BANKING SYSTEM PAYMENTS          │
├─────────────────────────────────────────────┤
│                                             │
│  💰 Fiat Transfers                         │
│  ├─ Instant (GBP, ZAR, USD, EUR)          │
│  ├─ International (IBAN)                   │
│  └─ SA Banks (EFT) - 24-48 hours          │
│                                             │
│  📱 Mobile Money                            │
│  ├─ Vodacom M-Pesa                        │
│  ├─ MTN Mobile Money                       │
│  └─ CellC Moola                           │
│                                             │
│  🔗 Cryptocurrency                         │
│  ├─ Bitcoin (BTC)                         │
│  ├─ Ethereum (ETH)                        │
│  ├─ Tether (USDT)                         │
│  ├─ USD Coin (USDC)                       │
│  ├─ Ripple (XRP)                          │
│  └─ Cardano (ADA)                         │
│                                             │
│  💳 Card Payments                          │
│  ├─ Debit Cards                           │
│  ├─ Credit Cards                          │
│  ├─ Dining Club                           │
│  └─ Gift Cards (SA)                       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ⚡ Real-Time WebSocket Events

```javascript
// Crypto Purchase
{
  "type": "crypto_purchase_completed",
  "cryptoType": "BTC",
  "amount": 0.15234567,
  "fiatAmount": 5000,
  "timestamp": "2026-06-12T10:30:00Z"
}

// SA Bank Transfer
{
  "type": "sa_bank_transfer_initiated",
  "bank": "ABSA Group Limited",
  "amount": 5000,
  "toAccount": "12345678901",
  "estimatedDelivery": "24-48 hours"
}

// Mobile Money Transfer
{
  "type": "mobile_wallet_transfer_completed",
  "provider": "Vodacom M-Pesa",
  "phoneNumber": "0712345678",
  "amount": 500,
  "fee": 10
}
```

---

## 🔒 Security Features for Payments

✅ JWT token required for all transactions
✅ Transaction approval workflow
✅ Real-time fraud detection
✅ Multi-step verification
✅ Audit logging
✅ Rate limiting (100 requests/minute)
✅ Input validation
✅ HTTPS only in production
✅ PCI compliance ready
✅ 2FA support

---

## 💡 Integration Tips

1. **Real-time Balance Updates**: Always use WebSocket for live balance changes
2. **Exchange Rates**: Cache rates for 5 minutes to reduce API calls
3. **Fee Calculation**: Always calculate fees before displaying total to user
4. **Phone Validation**: Validate phone numbers before sending to mobile money
5. **Crypto Confirmations**: Wait for minimum confirmations before marking complete

