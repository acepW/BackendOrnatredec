const express = require("express");
const router = express.Router();
const { createPengeluaran, reportPerbulan } = require("../../controllers/olah data/pengeluaran");
const protect = require('../../middlewares/authMiddleware'); // Pastikan path ini sesuai

router.post("/createPengeluaran", protect(['admin']), createPengeluaran);
router.get("/report",reportPerbulan);

module.exports = router;
