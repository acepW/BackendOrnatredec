const express = require("express");
const {
    createTransaksi,
    getTransaksiById,
    getTransaksiFilter,
    getTransaksiDikirimDanDikemas
} = require("../../controllers/Transaksi/transaksi");

const router = express.Router();
const protect = require('../../middlewares/authMiddleware');

router.post("/transaksi", protect(['user']), createTransaksi);
router.get("/Transaksi", getTransaksiFilter);
router.get("/TransaksiFilter", getTransaksiDikirimDanDikemas);
router.get("/transaksi/:id", protect(['user']), getTransaksiById);

module.exports = router;
