const express = require('express');
const router = express.Router();
const ControllerPost = require('../../controllers/Forum/post');
const  protect  = require('../../middlewares/authMiddleware');

router.post('/post', protect(['user']), ControllerPost.upload.single('file'), ControllerPost.PostUlasanForum);
router.get('/semua', protect(['user', 'super admin']), ControllerPost.getPost);
router.get('/satu', protect(['user']), ControllerPost.getOnePost);
router.put('/post/:id', protect(['user']),ControllerPost.upload.single('file'), ControllerPost.editPostingan);
router.delete('/delete/:id', protect(['user','super admin']),ControllerPost.deletePost);

module.exports = router;