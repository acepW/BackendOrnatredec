const express = require("express");
const {
    createProduk
} = require("../controllers/produk");

const router = express.Router();

router.post("/produk", createProduk);

module.exports = router;
