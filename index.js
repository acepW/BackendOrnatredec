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

dotenv.config();
app.use(express.json());
app.use(cookieParser());


// this for call all router from router.js
app.use("/api", require("./routes/router"));

sequelize.authenticate()
.then(async () => {
    console.log('Connection success');
    // await Users.sync({alter:true});
})
.catch(err => console.log('Error: ' + err));

app.listen(process.env.PORT, () => {
    console.log(`Server berhasil di running di port ${process.env.PORT}`);
})