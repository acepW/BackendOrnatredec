const express = require("express");
const router = express.Router();
const ControllerReport = require('../../controllers/Forum/report');

router.post('/report', protect(['user']) ,ControllerReport);

module.exports = router;