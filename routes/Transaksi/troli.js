const express = require('express');
const router = express.Router();
const controllerTroli = require('../../controllers/Transaksi/Troli');

router.post('/troli', controllerTroli.troliProduk)
router.delete('/hapusTroli/:id', controllerTroli.hapusTroli )

module.exports = router