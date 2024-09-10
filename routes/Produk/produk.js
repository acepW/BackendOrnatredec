const express = require("express");
const router = express.Router();

const controllerProduk = require("../../controllers/Produk/produk");

router.post("/produk", controllerProduk.createProduk);
router.get("/getProduk", controllerProduk.getProduk);
router.put("/editProduk/:id", controllerProduk.editProduk);

module.exports = router;
