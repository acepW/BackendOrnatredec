const express = require('express');
const router = express.Router();
const controllerPengeluaran = require('../../controllers/olah data/pengeluaran');

router.post('/pengeluaran', controllerPengeluaran.createPengeluaran);
router.get('/report', controllerPengeluaran.reportPerbulan)

module.exports = router;