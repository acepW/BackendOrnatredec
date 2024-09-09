const express = require('express');
<<<<<<< HEAD:routes/User/loginRoutes.js
const { register, login, getUser } = require('../../controllers/User/loginController');
const  protect  = require('../../middlewares/authMiddleware');
//const User = require("../../models/User/users")
=======
const { register, login, logout, refreshToken } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const User = require("../models/users")
>>>>>>> eb65d94cefe5edffd1dc05341d98d0381b59c58e:routes/authRoutes.js

const router = express.Router();

// Register User
router.post('/register', register);

// Login User
router.post('/login', login);
router.get('/userr', getUser);

// Logout User
router.post('/logout', logout);

// Refresh Token
router.post('/refresh-token', refreshToken);

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
