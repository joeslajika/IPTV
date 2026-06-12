const express = require('express');
const router = express.Router();
const bulkFundingController = require('../controllers/bulkFundingController');
const authMiddleware = require('../middleware/auth');

// Bulk funding - send to multiple recipients
router.post('/bulk-transfer', authMiddleware, bulkFundingController.bulkFunding);

// Get bulk transfer status
router.get('/status/:batchId', authMiddleware, bulkFundingController.getBulkTransferStatus);

module.exports = router;
