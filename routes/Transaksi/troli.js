const express = require('express');
const router = express.Router();
const controllerTroli = require('../../controllers/Transaksi/Troli');

router.post('/troli', controllerTroli.troliProduk )

module.exports = router