const express = require("express");
const router = express.Router();
const ControllerReport = require('../../controllers/Forum/report');
const  protect  = require('../../middlewares/authMiddleware');
const { getReport } = require("../../controllers/olah data/pengeluaran");

router.post('/report', protect(['user']), ControllerReport.buatReport);
router.get('/getReport', ControllerReport.getReport)
router.get('/ambilPengeluaran', getReport )

module.exports = router;