const express = require('express');
const router = express.Router();
const { updateUser, deleteUser} = require('../../controllers/User/editUser'); // Import fungsi dari controller
const uploadImage = require('../../middlewares/Multer');


// Rute Update User (dengan upload file)
router.put('/update/:id',uploadImage.single('photoProfile'), updateUser);

// Rute Delete User
router.delete('/delete/:id', deleteUser);

module.exports = router;
