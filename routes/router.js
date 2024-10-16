const router = require("express").Router();

//User
router.use("/", require("./User/loginRoutes"));

//Produk
router.use("/", require("./Produk/produk"));



//Transaksi
router.use("/", require("./Transaksi/transaksi"));
router.use("/", require("./Transaksi/alamat"));
router.use("/", require("./Transaksi/paymentgateway"));
router.use("/", require("./Transaksi/transaksiproduk"));


//Forum
router.use("/", require("./Forum/comments"));
router.use("/", require("./Forum/posts"));
router.use("/", require("./Forum/view"));
router.use("/", require("./Forum/reply"));

//olah data
router.use("/", require("./olah data/olahDataTentangTotal"));

module.exports = router;