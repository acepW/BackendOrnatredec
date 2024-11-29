const express = require("express");
const { CreateComment, deleteComment } = require("../../controllers/Forum/comment");
const protect = require('../../middlewares/authMiddleware');
const User = require("../../models/User/users");
const router = express.Router();

// Pastikan io sudah terpasang dari server.js
router.post('/coment', protect(['super admin', 'user']), (req, res) => CreateComment(req, res, req.io));

router.delete('/deleteComment/:id', protect(['super admin', 'user']), deleteComment);

module.exports = router;
