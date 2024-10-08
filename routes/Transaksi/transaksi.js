const express = require("express");
const {
    createTransaksi,
    getAllTransaksi,
    getTransaksiById
} = require("../../controllers/Transaksi/transaksi");

const router = express.Router();
const  protect  = require('../../middlewares/authMiddleware');

router.post("/transaksi",protect(['user']), createTransaksi);
router.get("/transaksi", getAllTransaksi);
router.get("/transaksi/:id", getTransaksiById);

module.exports = router;
 