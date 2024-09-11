const express = require("express");
const { CreateComment, 
        GetComment,
        editComment, 
        deleteComment} = require("../../controllers/Forum/comment");
       
const  protect  = require('../../middlewares/authMiddleware');
const User = require("../../models/User/users")
const router = express.Router();

router.post('/coment', protect(['super admin', 'user']), CreateComment)
router.get('/tanggapan', protect(['super admin', 'user']), GetComment)
router.put('/coment/:id', protect(['super admin', 'user']), editComment)
router.delete('/deleteComment/:id', protect(['super admin', 'user']), deleteComment)

module.exports = router;