const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const sequelize = require("./models/Users")
const db = require('./config/database');
const cors = require('cors')
dotenv.config();

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

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
