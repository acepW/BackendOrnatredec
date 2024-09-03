const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const User = require("../models/Users")

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/admin', protect(['admin']), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome Admin' });
});

router.get('/user', protect(['user', 'admin']), (req, res) => {
  res.status(200).json({ success: true, message: `Welcome ${req.user.role}` });
});

router.get('/superadmin', protect(['super admin']), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome Super Admin' });
});



module.exports = router;
