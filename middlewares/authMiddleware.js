const jwt = require('jsonwebtoken');
require('dotenv').config();

protect = (roles = []) => {
  return (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Login dulu guys' });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
  };
};

module.exports = protect;
