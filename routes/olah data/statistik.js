const express = require('express');
const router = express.Router();
const {getYearlyStatistics} = require('../../controllers/olah data/statistik');
//lll
// Route untuk mendapatkan statistik tahunan
router.get('/statistics/yearly/:year', getYearlyStatistics);
module.exports = router;
