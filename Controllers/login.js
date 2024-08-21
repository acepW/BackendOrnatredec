const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');


const register = async (req, res) => {
    const { username, email, password,no_telp,alamat} = req.body;
  
    try {
      const user = await Users.findOne({ where: { email } });
      if(user){
          return res.status(404).json({ message: 'email sudah ada' });
      }
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newuser = await Users.create({ username, email, password : hashedPassword, no_telp,alamat });
      res.status(201).json({ message: 'User registered successfully', newuser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const login = async (req, res) => {
    const { email, password } = req.body;
  
   
    try {
      // Find user by email
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Ensure user has a password property
      if (!user.password) {
        return res.status(400).json({ message: 'User has no password set' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour expiration
      return res.json({ message: "Login berhasil" });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };
  const logout = (req, res) => {
    // Clear the token cookie
    try {
      res.clearCookie('token', { httpOnly: true });
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  };
  module.exports = { login,register,logout };
  
  