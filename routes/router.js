const router = require("express").Router();

//User
router.use("/", require("./User/loginRoutes"));
router.use("/", require("./User/editUser"));

//Produk
router.use("/", require("./Produk/variasi"));
router.use("/", require("./Produk/produk"));
router.use("/", require("./Produk/usia"));

//Forum
router.use("/", require("./Forum/comments"));
router.use("/", require("./Forum/posts"));
router.use("/", require("./Forum/view"));
router.use("/", require("./Forum/reply"));

//olah data
router.use("/", require("./olah data/olahDataTentangTotal"));

module.exports = router;