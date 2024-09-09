const express = require("express");
const router = express.Router();
const ControllerReply = require('../../controllers/Forum/reply');
const  protect  = require('../../middlewares/authMiddleware');

router.post('/reply', protect(['user']), ControllerReply.createReply)

module.exports = router;