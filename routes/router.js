const router = require("express").Router();

<<<<<<< HEAD
router.use("/", require("./loginRoutes"));
=======
router.use("/", require("./autentikasi"));
router.use("/", require("./pot"));
router.use("/", require("./produk"));
router.use("/", require("./usia"));
>>>>>>> 5a3f5b356f9fd3a030aeb3c4382ad68e7756fd97

module.exports = router;