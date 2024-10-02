const express = require("express");
const {
    createPaymentGateway
} = require("../../controllers/Transaksi/paymentgateway");

const router = express.Router();

router.post("/paymentgateway", createPaymentGateway);

module.exports = router;
