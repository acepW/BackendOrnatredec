const express = require('express');
const router = express.Router();
const controllerTroli = require('../../controllers/Transaksi/Troli');
const protect = require('../../middlewares/authMiddleware');

router.post('/troli', protect(['user']), controllerTroli.troliProduk)
<<<<<<< HEAD
router.delete('/hapusTroli/:id', controllerTroli.hapusTroli )
=======
router.delete('/hapusTroli/:id', controllerTroli.hapusTroli)
>>>>>>> 9ce65e3f6bcc8f8aaa4a8c4f8e058251d0a46fe8

module.exports = router