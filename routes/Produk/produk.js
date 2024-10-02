const express = require("express");
const router = express.Router();

const controllerProduk = require("../../controllers/Produk/produk");

router.post("/produk",controllerProduk.upload.single('foto_produk'),controllerProduk.createProduk);
router.get("/getProduk", controllerProduk.getProduk);
router.get("/getProdukId/:id", controllerProduk.getProdukbyId);
router.put("/editProduk/:id", protect(['super admin', 'admin']), controllerProduk.editProduk);
router.get("/filterKategori", controllerProduk.filterKategoriProduk);

module.exports = router;
