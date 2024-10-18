const express = require('express');
const router = express.Router();
const statisticsController = require('../../controllers/Transaksi/statistik');

// Route untuk mendapatkan statistik bulanan
router.get('/sales/:month/:year', statisticsController.getMonthlyStatistics);

module.exports = router;
