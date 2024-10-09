const express = require('express');
const { register, login, logout, getUser, getUserMe } = require('../../controllers/User/loginController');
const  protect  = require('../../middlewares/authMiddleware');
const router = express.Router();

// Login User
router.post('/login', login);
// router.get('/userr', getUser);

//router register
router.post('/register', register)

// Logout User
router.delete('/logout', protect(['user', 'admin', 'super admin', 'kasir']), logout);

//get user
router.get('/getdanFilterUser', getUser)

//router get me
router.get('/getMe', protect(['user', 'admin', 'super admin', 'kasir']), getUserMe)

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
