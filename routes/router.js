const router = require("express").Router();

//User
router.use("/", require("./User/loginRoutes"));
router.use("/", require("./User/editUser"));

//Produk
router.use("/", require("./Produk/produk"));
// router.use("/", require("./Produk/order"));

//Transaksi
router.use("/", require("./Transaksi/transaksi"));
router.use("/", require("./Transaksi/alamat"));
router.use("/", require("./Transaksi/paymentgateway"));
router.use("/", require("./Transaksi/transaksiproduk"));
router.use("/", require("./Transaksi/troli"))

//Ulasan
router.use("/", require("./Ulasan/ulasan"));

//Forum
router.use("/", require("./Forum/comments"));
router.use("/", require("./Forum/posts"));
router.use("/", require("./Forum/view"));
router.use("/", require("./Forum/reply"));
router.use("/", require("./Forum/report"));

//olah data
router.use("/", require("./olah data/olahDataTentangTotal"));
router.use("/", require("./olah data/statistik"));
<<<<<<< HEAD
router.use("/", require("./olah data/pengeluaran"));
router.use("/", require("./olah data/permintaan"));
=======
router.use("/", require("./olah data/statistikForum"));
>>>>>>> 9ce65e3f6bcc8f8aaa4a8c4f8e058251d0a46fe8

module.exports = router;