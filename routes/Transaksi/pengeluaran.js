const express = require("express");
const router = express.Router();
const { createPengeluaran,reportPerbulan} = require("../../controllers/olah data/pengeluaran"); // Pastikan path ini sesuai

// Route untuk membuat pengeluaran baru
router.post("/create", createPengeluaran);

// Route untuk mendapatkan laporan pengeluaran dan transaksi per bulan
router.get("/report",reportPerbulan);

module.exports = router;
