const express = require('express');
const router = express.Router();
const ControllerPost = require('../../controllers/Forum/post');
const  protect  = require('../../middlewares/authMiddleware');

router.post('/post', protect(['super admin', 'user']), ControllerPost.upload.single('file'), ControllerPost.PostUlasanForum);
router.get('/semua', ControllerPost.getPost);
router.get('/satu/:id', protect(['super admin', 'user']), ControllerPost.getOnePost);
router.put('/post/:id', protect(['super admin', 'user']),ControllerPost.upload.single('file'), ControllerPost.editPostingan);
router.delete('/deletePost/:id', protect(['user','super admin']),ControllerPost.deletePost);
router.get('/forum/tanaman', protect(['user','super admin']),ControllerPost.getPostKategoriTanaman);
router.get('/forum/ikan', protect(['user','super admin']),ControllerPost.getPostKategoriIkan);
router.get('/forum/burung', protect(['user','super admin']),ControllerPost.getPostKategoriBurung);
router.get('/filter', protect(['user','super admin']),ControllerPost.filterKategori);
router.post('/simpanPost', protect(['user','super admin']), ControllerPost.simpanPostingan);
router.get('/simpanan',  protect(['user','super admin']), ControllerPost.getSimpanPostingan);

module.exports = router;