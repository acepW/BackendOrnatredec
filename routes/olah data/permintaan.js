const express = require("express");
const router = express.Router();
const { createPermintaan, updateStatusPermintaan, getPermintaan } = require("../../controllers/olah data/permintaan");
const protect = require('../../middlewares/authMiddleware');
const verifyToken = require("../../middlewares/auth");


router.post("/createPermintaan", verifyToken, createPermintaan);
router.put("/editStatus/:id", updateStatusPermintaan)
router.get("/getPermintaan", getPermintaan)

module.exports = router;
