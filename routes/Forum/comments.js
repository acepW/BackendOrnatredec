const express = require("express");
const { CreateComment, 
        GetComment,
        editComment, 
        deleteComment} = require("../../controllers/Forum/comment");
       
const  protect  = require('../../middlewares/authMiddleware');
const User = require("../../models/User/users")
const router = express.Router();

router.post('/coment', protect(['user']), CreateComment)
router.get('/tanggapan', protect(['user']), GetComment)
router.put('/coment/:id', protect(['user']), editComment)
router.delete('/deleteComment/:id', protect(['admin', 'user']), deleteComment)

module.exports = router;