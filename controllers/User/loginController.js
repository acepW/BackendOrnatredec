const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const User = require('../../models/User/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const moment = require('moment');
const Alamat = require('../../models/User/alamat');
// Register User
const register = async (req, res) => {
  const { username, email, password, no_hp, role } = req.body;

  // Ambil file yang diupload
  const photoProfile = req.files?.photoProfile ? req.files.photoProfile[0].filename : null;
  const backgroundProfile = req.files?.backgroundProfile ? req.files.backgroundProfile[0].filename : null;

  try {
    const UserEmail = await User.findOne({ where: { email } });
    if (UserEmail) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    const UserUsername = await User.findOne({ where: { username } });
    if (UserUsername) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const UserNophone = await User.findOne({ where: { no_hp } });
    if (UserNophone) {
        return res.status(409).json({ message: 'No phone already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let alamat = null;
    // Create the user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      no_hp,
      role,
      alamat,
      photoProfile,           // Tambahkan foto profil
      backgroundProfile       // Tambahkan background profil
    });

    res.status(201).json({ success: true, message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'username tidak ditemukan' });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'password salah' });
    }
// Generate JWT without expiration
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.SECRET_KEY // No expiration time
);

// Set token akses tanpa refresh token
res.cookie('token', token, { httpOnly: true, sameSite: "None",secure: true, path: "/" }); 


    res.status(200).json({ success: true, message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUser = async (req, res) =>{
  try {
    const user = await User.findAll({include:[{model : Alamat}]})
    res.status(200).json({message : "sukses", user})
  } catch (error) {
    res.status(500).json({message : error.message})
  }
}

const getUserMe = async (req, res) =>{
  const {id} = req.user
  try {
    const user = await User.findByPk(id)
    const alamat = await Alamat.findOne({where : {userId : id}})
    const tanggalBaru = moment(user.tanggalLahir).format('DD-MM-YYYY');
    res.status(200).json({message : "sukses", 
      username: user.username,
      email: user.email,
      password : user.password,
      no_hp : user.no_hp,
      role : user.role,
      alamat : alamat,
      photoProfile : user.photoProfile,
      tanggalLahir: tanggalBaru,
    })
  } catch (error) {
    res.status(500).json({message : error.message})
  }
}

const logout = (req, res) => {
  try {
      res.clearCookie('token', {httpOnly: true, sameSite: "None",secure: true, path: "/"});
      console.log('logout berhasil');
      
      res.status(200).json({message: 'logout berhasil'});
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
  logout,
  getUser,
  getUserMe
}
