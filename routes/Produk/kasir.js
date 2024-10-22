const express = require('express');
const router = express.Router();
const kasirController = require('../../controllers/Produk/kasirController');

// Route untuk membuat transaksi kasir
router.post('/produksi', kasirController.createTransaction);

module.exports = router;
