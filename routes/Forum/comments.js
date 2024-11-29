const express = require("express");
const { CreateComment, deleteComment } = require("../../controllers/Forum/comment");
const { getNotifications } = require("../../controllers/Forum/comment");
const protect = require('../../middlewares/authMiddleware');
const User = require("../../models/User/users");
const router = express.Router();

const { isAuthenticated } = require('../../middlewares/authMiddleware');
// Pastikan io sudah terpasang dari server.js
router.post('/coment', protect(['super admin', 'user']), (req, res) => CreateComment(req, res, req.io));
router.get("/notifications",  protect(['super admin', 'user']), (req, res) => getNotifications(req, res, req.io));
router.delete('/deleteComment/:id', protect(['super admin', 'user']), deleteComment);

module.exports = router;
