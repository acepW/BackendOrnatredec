const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const User = require('../../models/User/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Register User


const register = async (req, res) => {
<<<<<<< HEAD
  const { username, email, password, no_hp, role } = req.body;
=======
  const { username, email, password, no_hp, role, alamat, fotoProfil } = req.body;
>>>>>>> 96df886e2acf005865161edf1564c934595bc04e

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
<<<<<<< HEAD
      role,
=======
      role: role || 'user', // Default role as 'user' if not provided
      alamat: alamat || null, // Optional alamat
      fotoProfil: fotoProfil || null, // Optional fotoProfil
>>>>>>> 96df886e2acf005865161edf1564c934595bc04e
    });

    res.status(201).json({ success: true, message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

<<<<<<< HEAD
=======

>>>>>>> 96df886e2acf005865161edf1564c934595bc04e
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
res.cookie('token', token, { httpOnly: true }); // No expiration on token

<<<<<<< HEAD
    // Set token akses dan refresh token
    res.cookie('token', token, { httpOnly: true, maxAge: 900000 }); // 15 menit
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 hari
    console.log(user.role); // Cek output di console

    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '15m' });

    res.cookie('token', newAccessToken, { httpOnly: true, maxAge: 900000 }); // 15 menit
    res.status(200).json({ success: true, message: 'Token refreshed' });
  });
=======
res.status(200).json({ success: true, message: 'Login successful' });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
>>>>>>> 96df886e2acf005865161edf1564c934595bc04e
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
