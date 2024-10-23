const express = require("express");
const { beriUlasan } = require("../../controllers/Ulasan/ulasan");
const upload = require('../../middlewares/multer'); // Import multer
const router = express.Router();
const protect = require('../../middlewares/authMiddleware');

// Rute untuk memberikan ulasan dengan upload foto dan video
router.post(
    "/ulasan/:id_transaksi_produk",
    protect(['user']),
    upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
    beriUlasan
);

module.exports = router;
