const express = require("express");
const {
    berikanUlasan
} = require("../../controllers/Ulasan/ulasan");

const router = express.Router();

router.post("/ulasan", berikanUlasan);

module.exports = router;
