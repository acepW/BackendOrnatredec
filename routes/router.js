const router = require("express").Router();

//User
router.use("/", require("./User/loginRoutes"));

//Produk
router.use("/", require("./Produk/pot"));
router.use("/", require("./Produk/produk"));
router.use("/", require("./Produk/usia"));

//Forum
router.use("/", require("./Forum/comments"));
router.use("/", require("./Forum/posts"));
router.use("/", require("./Forum/view"));
router.use("/", require("./Forum/reply"))

module.exports = router;