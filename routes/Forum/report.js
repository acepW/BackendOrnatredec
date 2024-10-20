const express = require("express");
const router = express.Router();
const ControllerReport = require('../../controllers/Forum/report');
const  protect  = require('../../middlewares/authMiddleware');

router.post('/report', protect(['user']), ControllerReport.buatReport);
router.get('/getReport', protect(['super admin']), ControllerReport.getReport)

module.exports = router;