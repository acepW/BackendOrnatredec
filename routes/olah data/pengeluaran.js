const express = require("express");
const router = express.Router();
const { createPengeluaran, reportPerbulan } = require("../../controllers/olah data/pengeluaran");
const protect = require('../../middlewares/authMiddleware'); // Pastikan path ini sesuai

// Route untuk membuat pengeluaran baru
router.post("/createPengeluaran", protect(['admin']), createPengeluaran);

// Route untuk mendapatkan laporan pengeluaran dan transaksi per bulan
router.get("/report", reportPerbulan);

module.exports = router;
