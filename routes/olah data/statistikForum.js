const express = require("express");
const { getForumPostStatisticsForMonth, getForumPostStatisticsForYear, getForumPostStatisticsForYearAll } = require('../../controllers/olah data/statistikForum');

const router = express.Router();

// Route untuk mendapatkan statistik postingan per tahun (semua bulan)
router.get('/statistik/tahun/:year', getForumPostStatisticsForYearAll);

// Route untuk mendapatkan statistik postingan per tahun dengan perbandingan tahun sebelumnya
router.get('/statistik/:year', getForumPostStatisticsForYear);


// Route untuk mendapatkan statistik postingan per bulan dengan perbandingan bulan sebelumnya
router.get('/statistik/:year/:month', getForumPostStatisticsForMonth);

module.exports = router;
