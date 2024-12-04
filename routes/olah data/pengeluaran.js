const express = require("express");
const router = express.Router();
const { createPengeluaran, reportPerbulan, getReport } = require("../../controllers/olah data/pengeluaran");
const protect = require('../../middlewares/authMiddleware'); // Pastikan path ini sesuai
const verifyToken = require("../../middlewares/auth");

router.post("/createPengeluaran", verifyToken, createPengeluaran);
router.get("/report", reportPerbulan);
router.get("/pengeluaran", getReport)

module.exports = router;
