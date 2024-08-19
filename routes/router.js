const router = require("express").Router();

// this for test router
router.use("/", require("./testRoutes"));

module.exports = router;
