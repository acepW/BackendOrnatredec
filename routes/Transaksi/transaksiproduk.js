// routes/order.js

const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/Transaksi/transaksiproduk');

// Endpoint untuk mengubah status pesanan

router.put('/:id/status', orderController.updateOrderStatus);


// Mendapatkan semua pesanan dan otomatis mengubah status dari "dipesan" ke "dikemas"
router.get('/dipesan', orderController.getAllOrders);

// // Mendapatkan pesanan berdasarkan ID dan otomatis mengubah status dari "dipesan" ke "dikemas"
router.get('/dipesanByid/:id', orderController.getOrderById);

//router get id tanpa rubah status
router.get('/detail/:id', orderController.detail);

router.put('/status/:id', orderController.updateOrderStatus);


// Mendapatkan semua pesanan dan otomatis mengubah status dari "dikemas" ke "sedang diantar"
router.get('/dipesanAll', orderController.getAllOrdersdikemas);

// Mendapatkan pesanan berdasarkan ID dan otomatis mengubah status dari "dikemas" ke "sedang diantar"
router.get('/dipesan/order/:id', orderController.getOrderByIddikemas);

// Mendapatkan semua pesanan dan otomatis mengubah status dari "sedang diantar" ke "selesai"
// router.get('/diantar', orderController.getAllOrdersantar);

// Mendapatkan pesanan berdasarkan ID dan otomatis mengubah status dari "sedang diantar" ke "selesai"
router.get('/diantar/order/:id', orderController.getOrderByIdantar);


module.exports = router;
