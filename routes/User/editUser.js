const express = require('express');
const router = express.Router();

const { updateUser, deleteUser } = require('../../controllers/User/editUser'); // Import fungsi dari controller
const uploadImage = require('../../middlewares/Multer');


// Rute Update User (dengan upload file)
router.put('/update/:id',uploadImage.fields([
  { name: 'photoProfile', maxCount: 1 },
  { name: 'backgroundProfile', maxCount: 1 }
]), updateUser);

const { updateUser, deleteUser, detailUser} = require('../../controllers/User/editUser'); // Import fungsi dari controller
const upload = require('../../middlewares/Multer');


// Rute Update User (dengan upload file)
router.put('/update/:id', upload.single('photoProfile'), updateUser);
router.get('/detail/:id', detailUser);

// Rute Delete User
router.delete('/delete/:id', deleteUser);

module.exports = router;
