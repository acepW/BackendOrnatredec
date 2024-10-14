// routes/order.js

const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/Transaksi/transaksiproduk');

// Endpoint untuk mengubah status pesanan
router.put('/:id/status', orderController.updateOrderStatus);


// Mendapatkan semua pesanan dan otomatis mengubah status dari "dipesan" ke "dikemas"
router.get('/', orderController.getAllOrders);

// // Mendapatkan pesanan berdasarkan ID dan otomatis mengubah status dari "dipesan" ke "dikemas"
// router.get('/:id', orderController.getOrderById);

module.exports = router;
