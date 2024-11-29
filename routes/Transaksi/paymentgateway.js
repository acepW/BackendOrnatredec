const express = require("express");
const {
    createPaymentGateway,
    savePaymentData
} = require("../../controllers/Transaksi/paymentgateway");

const router = express.Router();

router.post('/paymentgateway', createPaymentGateway);
router.post('/paymentgateway/save', savePaymentData); // Tambahkan ini

module.exports = router;
