const express = require("express");
const router = express.Router();

const controllerProduk = require("../../controllers/Produk/produk");
const  protect  = require('../../middlewares/authMiddleware');

<<<<<<< HEAD
router.post("/produk",controllerProduk.upload.single('foto_produk'),controllerProduk.createProduk);
router.get("/getProdukId/:id", controllerProduk.getProdukbyId);
router.put("/editProduk/:id", protect(['super admin', 'admin']), controllerProduk.upload.single('foto_produk'),controllerProduk.editProduk);
router.get("/filterdanGet", controllerProduk.filterKategoriProduk);
router.get("/filter",controllerProduk.getProdukFilter);
router.delete("/hapusProduk/:id", controllerProduk.hapusProduk);
router.post("/troli", protect(['user']), controllerProduk.troliProduk)
=======
router.post("/produk", protect(['super admin', 'admin']), controllerProduk.createProduk);
router.get("/getProduk", controllerProduk.getProduk);


router.get('/:id', controllerProduk.getProductById);

router.get('/ordered', controllerProduk.getOrderedProducts);

router.put("/editProduk/:id", protect(['super admin', 'admin']), controllerProduk.editProduk);
>>>>>>> 864f110dfc067766de1e375efd4a1186d3ced10a

module.exports = router;
//ee