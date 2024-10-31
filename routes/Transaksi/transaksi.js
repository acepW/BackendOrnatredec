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
router.get("/TransaksiFilter", getTransaksiDikirimDanDikemas);
// router.get("/transaksi", getAllTransaksi);
router.get("/transaksi/:id", protect(['user']), getTransaksiById);

router.get("/transaksi/:id", protect(['user']), getTransaksiById);
// router.get("/transaksi", getAllTransaksi);

>>>>>>> 9ce65e3f6bcc8f8aaa4a8c4f8e058251d0a46fe8
module.exports = router;
