const router = require("express").Router();
const controller = require("../controllers/login");
const verifyToken = require("../middleware/verifytoken");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.delete("/logout", controller.logout);

router.get("/", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;