const express = require("express");
const {
    createTransaksi,
    getAllTransaksi,
    getTransaksiById
} = require("../../controllers/Transaksi/transaksi");

const router = express.Router();

router.post("/transaksi", createTransaksi);
router.get("/transaksi", getAllTransaksi);
router.get("/transaksi/:id", getTransaksiById);

module.exports = router;
