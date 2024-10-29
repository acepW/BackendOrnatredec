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
<<<<<<< HEAD
router.get("/TransaksiFilter", getTransaksiDikirimDanDikemas);
// router.get("/transaksi", getAllTransaksi);
router.get("/transaksi/:id", protect(['user']), getTransaksiById);
=======

router.get("/transaksi/:id", protect(['user']), getTransaksiById);
// router.get("/transaksi", getAllTransaksi);



>>>>>>> 74db11e98b22672b76ce7f6544deccb10d5ba69b

module.exports = router;
