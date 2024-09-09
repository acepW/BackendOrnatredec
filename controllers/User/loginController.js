const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const User = require('../../models/User/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register User
const register= async (req, res) => {
  const { username, email, password, no_hp, role } = req.body;

  try {
    const userEmail = await User.findOne({ where: { email } });
    if (userEmail) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    const userUsername = await User.findOne({ where: { username } });
    if (userUsername) {
        return res.status(409).json({ message: 'username already exists' });
    }

    const userNohp = await User.findOne({ where: { no_hp } });
    if (userNohp) {
        return res.status(409).json({ message: 'No Phone already exists' });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database
    const userr = await User.create({
      username,
      email,
      password: hashedPassword,
      no_hp,
      role
    });

    res.status(201).json({ success: true, message: 'User registered successfully', userr });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Login User
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },       
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: true });
    res.json({message : "Login berhasil"})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findAll({});
    res.json(user)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  login,
  register,
  getUser
}
