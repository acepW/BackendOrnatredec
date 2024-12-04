const express = require("express");
const {
    createTransaksi,
    getTransaksiById,
    getTransaksiFilter,
    getTransaksiDikirimDanDikemas,
    createTransaksiKasir,
    createTransaksiSatu
} = require("../../controllers/Transaksi/transaksi");

const router = express.Router();
const protect = require('../../middlewares/authMiddleware');
const verifyToken = require("../../middlewares/auth");

router.post("/transaksi", protect(['user']), createTransaksi);
router.post("/transaksiKasir", verifyToken, createTransaksiKasir);
router.get("/Transaksi", getTransaksiFilter);
router.get("/TransaksiFilter", getTransaksiDikirimDanDikemas);
// router.get("/transaksi", getAllTransaksi);
router.get("/transaksi/:id", protect(['user']), getTransaksiById);
router.post('/transaksiSatu', protect(['user']), createTransaksiSatu);

router.get("/transaksi/:id", protect(['user']), getTransaksiById);
// router.get("/transaksi", getAllTransaksi);

module.exports = router;
