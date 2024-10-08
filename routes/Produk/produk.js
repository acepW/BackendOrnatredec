const express = require("express");
const router = express.Router();

const controllerProduk = require("../../controllers/Produk/produk");

router.post("/produk", protect(['super admin', 'admin']), controllerProduk.createProduk);
router.get("/getProduk", protect(['super admin', 'admin']), controllerProduk.getProduk);
router.put("/editProduk/:id", protect(['super admin', 'admin']), controllerProduk.editProduk);

module.exports = router;
//ee