const express = require('express');
const router = express.Router();
const controllerTroli = require('../../controllers/Transaksi/Troli');
const protect = require('../../middlewares/authMiddleware');

router.post('/troli', protect(['user']), controllerTroli.troliProduk)
router.delete('/hapusTroli/:id', controllerTroli.hapusTroli )

module.exports = router