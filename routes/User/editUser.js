const express = require('express');
const router = express.Router();
const User = require('../../models/User/users'); 

const { updateUser, deleteUser } = require('../../controllers/User/editUser'); // Import fungsi dari controller
const {upload}= require('../../middlewares/Multer');


// Rute Update User (dengan upload file)
router.put('/update/:id',upload.fields([
  { name: 'photoProfile', maxCount: 1 },
  { name: 'backgroundProfile', maxCount: 1 }
]), updateUser);

// Rute Delete User
router.delete('/delete/:id', deleteUser);

module.exports = router;
