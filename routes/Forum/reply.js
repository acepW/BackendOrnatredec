const express = require("express");
const router = express.Router();
const ControllerReply = require('../../controllers/Forum/reply');
const  protect  = require('../../middlewares/authMiddleware');

router.post('/reply', protect(['super admin', 'user']), ControllerReply.createReply)
router.put('/editReply/:id', protect(['super admin', 'user']), ControllerReply.editReply)
router.delete('/deleteReply/:id', protect(['super admin', 'user']), ControllerReply.deleteReply)

module.exports = router;