const express = require("express");
const router = express.Router();

const controllerProduk = require("../../controllers/Produk/produk");

router.post("/produk",controllerProduk.upload.single('foto_produk'),controllerProduk.createProduk);
router.get("/getProdukId/:id", controllerProduk.getProdukbyId);
router.put("/editProduk/:id", protect(['super admin', 'admin']), controllerProduk.upload.single('foto_produk'),controllerProduk.editProduk);
router.get("/filterdanGet", controllerProduk.filterKategoriProduk);
router.get("/filter",controllerProduk.getProdukFilter);

module.exports = router;
