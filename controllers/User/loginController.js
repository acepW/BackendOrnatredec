const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const User = require('../../models/User/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register User
const register = async (req, res) => {

  const { username, email, password, no_hp, role } = req.body;

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
        return res.status(409).json({ message: 'No pon already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      no_hp,
      role
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
res.cookie('token', token, { httpOnly: true }); 


    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUser = async (req, res) =>{
  try {
    const user = await User.findAll({})
    res.json(user)
  } catch (error) {
    res.status(500).json({message : message.error})
  }
}

const logout = (req, res) => {
  try {
      res.clearCookie('token', {httpOnly: true});
      res.status(200).json({message: 'logout berhasil'});
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
  logout,
  getUser
}
