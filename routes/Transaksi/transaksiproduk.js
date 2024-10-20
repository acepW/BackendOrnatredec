// routes/order.js

const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/Transaksi/transaksiproduk');

// Endpoint untuk mengubah status pesanan
router.put('/status/:id', orderController.updateOrderStatus);


// Mendapatkan semua pesanan dan otomatis mengubah status dari "dipesan" ke "dikemas"
router.get('/status', orderController.getAllOrders);

// Mendapatkan pesanan berdasarkan ID dan otomatis mengubah status dari "dipesan" ke "dikemas"
router.get('/order/:id', orderController.getOrderById);

module.exports = router;
