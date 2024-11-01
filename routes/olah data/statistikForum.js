const express = require("express");
const { getForumPostStatisticsForYear } = require('../../controllers/olah data/statistikForum');

const router = express.Router();

// Route untuk mendapatkan statistik postingan per tahun (semua bulan)
router.get('/statistik/:year', getForumPostStatisticsForYear);

module.exports = router;
