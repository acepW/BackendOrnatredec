const express = require('express');
const router = express.Router();
const controllerTroli = require('../../controllers/Transaksi/Troli');
const protect = require('../../middlewares/authMiddleware');

router.post('/troli', protect(['user']), controllerTroli.troliProduk)
router.delete('/hapusTroli/:id', controllerTroli.hapusTroli)
router.put('/editTroli/:id', controllerTroli.editTroli);
router.get('/getTroli', protect(['user']), controllerTroli.getTroli)

module.exports = router 