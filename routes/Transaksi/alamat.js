const express = require("express");
const {
    createAlamat,
    getAlamat
} = require("../../controllers/Transaksi/alamat");

const router = express.Router();

router.post("/alamat", createAlamat);
router.get("/alamat", getAlamat);

module.exports = router;
