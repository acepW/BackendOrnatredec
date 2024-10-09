const express = require("express");
const {
    createAlamat,
    getAlamat,
    editAlamat
} = require("../../controllers/Transaksi/alamat");
const  protect  = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post("/alamat" ,protect(['user']), createAlamat);
router.get("/alamat", getAlamat);
router.put('/EditAlamat/:id', editAlamat)


module.exports = router;
