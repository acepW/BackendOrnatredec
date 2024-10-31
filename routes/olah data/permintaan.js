const express = require("express");
const router = express.Router();
const { createPermintaan, updateStatusPermintaan } = require("../../controllers/olah data/permintaan");
const protect = require('../../middlewares/authMiddleware');


router.post("/createPermintaan", protect(['kasir']), createPermintaan);
router.put("/editStatus/:id", updateStatusPermintaan)

module.exports = router;
