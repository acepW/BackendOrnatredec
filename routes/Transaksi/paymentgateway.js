const express = require("express");
const {
    createPaymentGateway,
    savePaymentData
} = require("../../controllers/Transaksi/paymentgateway");
const protect = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/paymentgateway', protect(['user']), createPaymentGateway);
router.post('/paymentgateway/save', savePaymentData); // Tambahkan ini

module.exports = router;
