const express = require("express");
const { getForumPostStatisticsForYearAll } = require('../../controllers/olah data/statistikForum');

const router = express.Router();

// Route untuk mendapatkan statistik postingan per tahun (semua bulan)
router.get('/statistik/:year', getForumPostStatisticsForYearAll);

module.exports = router;
