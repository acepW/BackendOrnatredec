const express = require("express");
const {
    createPot,
    getAllPot,
    getPotById
} = require("../controllers/pot");

const router = express.Router();

router.post("/pot", createPot);
router.get("/pot", getAllPot);
router.get("/pot/:id", getPotById);

module.exports = router;
