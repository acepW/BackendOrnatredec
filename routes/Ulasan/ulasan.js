const express = require("express");
const { beriUlasan, getUlasan } = require("../../controllers/Ulasan/ulasan");
const upload = require('../../middlewares/Multer'); // Import multer
const router = express.Router();
const protect = require('../../middlewares/authMiddleware');

// Rute untuk memberikan ulasan dengan upload foto dan video
router.post(
    "/ulasan/:id_transaksi_produk",
    protect(['user']),
    upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
    beriUlasan
);

router.get('/ulasan', getUlasan)

module.exports = router;
