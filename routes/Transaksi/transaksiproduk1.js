
const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/Produk/ord');

// Mendapatkan semua pesanan dan otomatis mengubah status dari "dipesan" ke "dikemas"
router.get('ord/', orderController.getAllOrders);

// Mendapatkan pesanan berdasarkan ID dan otomatis mengubah status dari "dipesan" ke "dikemas"
router.get('ord/:id', orderController.getOrderById);

module.exports = router;
