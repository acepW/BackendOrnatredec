const express = require("express");
const router = express.Router();
<<<<<<< HEAD:routes/olah data/pengeluaran.js
const { createPengeluaran, reportPerbulan } = require("../../controllers/olah data/pengeluaran");
const protect = require('../../middlewares/authMiddleware'); // Pastikan path ini sesuai
=======
const { createPengeluaran,reportPerbulan} = require("../../controllers/olah data/pengeluaran"); // Pastikan path ini sesuai
>>>>>>> dc39ca93a8993c6b142637f7dc0c532bdf537679:routes/Transaksi/pengeluaran.js

// Route untuk membuat pengeluaran baru
router.post("/createPengeluaran", protect(['admin']), createPengeluaran);

// Route untuk mendapatkan laporan pengeluaran dan transaksi per bulan
router.get("/report",reportPerbulan);

module.exports = router;
