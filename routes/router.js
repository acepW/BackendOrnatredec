const router = require("express").Router();

router.use("/", require("./autentikasi"));
router.use("/", require("./pot"));
router.use("/", require("./produk"));
router.use("/", require("./usia"));

module.exports = router;