const db = require('../config/database');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Register User
exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ success: true, message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.login = async (req, res) => {
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

    // Generate JWT and Refresh Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Token akses kadaluarsa dalam 15 menit
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } // Refresh token kadaluarsa dalam 7 hari
    );

    // Set token akses dan refresh token
    res.cookie('jwt', token, { httpOnly: true, maxAge: 900000 }); // 15 menit
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 hari

    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.cookie('jwt', newAccessToken, { httpOnly: true, maxAge: 900000 }); // 15 menit
    res.status(200).json({ success: true, message: 'Token refreshed' });
  });
};

exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }); // Set cookie 'jwt' dengan masa berlaku sangat pendek untuk menghapusnya
  res.status(200).json({ success: true, message: 'Logout successful' });
};
