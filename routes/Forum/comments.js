const express = require("express");
const { CreateComment,
        // GetComment,
        // editComment,
        deleteComment,
        getOneComment,
        getNotifications } = require("../../controllers/Forum/comment");

const protect = require('../../middlewares/authMiddleware');
const User = require("../../models/User/users")
const router = express.Router();

// // router.post('/komen', protect(['super admin', 'user']), CreateComment)
// router.get('/tanggapan', protect(['super admin', 'user']), GetComment)
// router.put('/coment/:id', protect(['super admin', 'user']), editComment)
router.delete('/deleteComment/:id', protect(['super admin', 'user']), deleteComment)
router.get('/satuKomen/:id', getOneComment)

router.post('/komen', protect(['super admin', 'user']), (req, res) => CreateComment(req, res, req.io));
router.get("/notifications", protect(['super admin', 'user']), (req, res) => getNotifications(req, res, req.io));
router.delete('/deleteComment/:id', protect(['super admin', 'user']), deleteComment);

module.exports = router;
