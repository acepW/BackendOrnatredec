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
// router.get("/transaksi", getAllTransaksi);
router.get("/transaksi/:id", protect(['user']), getTransaksiById);
// router.get("/Transaksi", getTransaksiFilter);
router.get("/TransaksiFilter", getTransaksiDikirimDanDikemas);
router.get("/Transaksi", getTransaksiFilter);
router.post("/troli", protect(['user']), troliProduk);

module.exports = router;
