const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const User = require('../../models/User/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Register User


const register = async (req, res) => {
  const { username, email, password, no_hp, role, alamat, fotoProfil } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      no_hp,
      role: role || 'user', // Default role as 'user' if not provided
      alamat: alamat || null, // Optional alamat
      fotoProfil: fotoProfil || null, // Optional fotoProfil
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
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentialsss' });
    }
// Generate JWT without expiration
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.SECRET_KEY // No expiration time
);

// Set token akses tanpa refresh token
res.cookie('token', token, { httpOnly: true }); // No expiration on token

res.status(200).json({ success: true, message: 'Login successful' });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
};

const logout = (req, res) => {
  res.cookie('token', '', { maxAge: 1 }); // Set cookie 'jwt' dengan masa berlaku sangat pendek untuk menghapusnya
  res.status(200).json({ success: true, message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout
}
