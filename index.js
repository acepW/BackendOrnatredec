<<<<<<< HEAD
const express = require("express");
const dotenv = require("dotenv");
const cosrs = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sequelize = require("./config/koneksi");
const Users = require("./models/users");
=======
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const sequelize = require("./models/Users")
const db = require('./config/database');
const cors = require('cors')
dotenv.config();
>>>>>>> fe25bd391adf8f9771bffa3c9b41bd3952163fbd

const app = express();

// Middleware
app.use(express.json());
app.use((
    cors({
        credentials : true,
        origin : true
    })
))
// Routes
app.use('/api/auth', authRoutes);

<<<<<<< HEAD
app.use(
    cosrs({
        Credential : true,
        origin : true
    })
)

=======
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  });
>>>>>>> fe25bd391adf8f9771bffa3c9b41bd3952163fbd

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
