const express = require('express');
const router = express.Router();
const controllerView = require('../../controllers/Forum/view')
const protect = require('../../middlewares/authMiddleware');


router.get('/get/view', protect(['super admin', 'user']), controllerView);

module.exports = router;
