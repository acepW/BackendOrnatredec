const express = require("express");
const router = express.Router();
const  protect  = require('../../middlewares/authMiddleware');
const totalSemua = require('../../controllers/olah data/olahDataTentangTotal');

router.get('/totalKeseluruhan', totalSemua)

module.exports = router;