const express = require("express");
const { getForumPostStatisticsPerYear } = require('../../controllers/olah data/statistikForum');

const router = express.Router();

// Route untuk mendapatkan statistik postingan per tahun
router.get('/statistik/:year', getForumPostStatisticsPerYear);

module.exports = router
