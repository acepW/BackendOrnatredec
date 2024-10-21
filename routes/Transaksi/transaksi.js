const express = require("express");
const {
    createTransaksi,
    // getAllTransaksi,
    getTransaksiById,
    getTransaksiFilter,
    troliProduk,
    getTransaksiDikirimDanDikemas
} = require("../../controllers/Transaksi/transaksi");

const router = express.Router();
const protect = require('../../middlewares/authMiddleware');

router.post("/transaksi", protect(['user']), createTransaksi);
// router.get("/transaksi", getAllTransaksi);
router.get("/transaksi/:id", getTransaksiById);
router.get("/Transaksi", getTransaksiFilter);
router.get("/TransaksiFilter", getTransaksiDikirimDanDikemas);
router.get("/transaksi/:id", protect(), getTransaksiById);
router.get("/Transaksi", getTransaksiFilter)


module.exports = router;
