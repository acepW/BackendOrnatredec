<<<<<<< HEAD
const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const routes = require('./routes/router');
const Users = require("./models/users");
=======
const express = require('express');
const dotenv = require('dotenv')
const sequelize = require('./config/koneksi');
const Users = require('./models/users');
const cookieParser = require('cookie-parser');
const path = require("path");
const Produk = require("./models/produk");
const Usia = require("./models/usia");
const Pot = require("./models/pot");

const app = express();
>>>>>>> 5a3f5b356f9fd3a030aeb3c4382ad68e7756fd97

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
      credentials : true,
      origin : true
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', routes);
 


sequelize.authenticate()
.then(async () => {
    console.log('Connection success');
    // await sequelize.sync({alter: true});
})
.catch(err => console.log('Error: ' + err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
