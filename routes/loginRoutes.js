const express = require('express');
const { register, login, getUser } = require('../controllers/loginController');
const  protect  = require('../middlewares/authMiddleware');
const User = require("../models/users")

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/userr', getUser);

router.get('/admin', protect(['admin']), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome Admin' });
});

router.get('/user', protect(['user', 'admin']), (req, res) => {
  res.status(200).json({ success: true, message: `Welcome ${req.user.role}` });
});

router.get('/superadmin', protect(['super admin']), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome Super Admin' });
});

router.get('/kasir', protect(['kasir']), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome Kasir' });
});



module.exports = router;
