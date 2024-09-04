const express = require("express");
const {
    createUsia,
    getAllUsia,
    getUsiaById
} = require("../controllers/usia");

const router = express.Router();

router.post("/usia", createUsia);
router.get("/usia", getAllUsia);
router.get("/usia/:id", getUsiaById);

module.exports = router;
