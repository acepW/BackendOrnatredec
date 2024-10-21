const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const routes = require('./routes/router');
const Users = require("./models/User/users");
const Produk = require('./models/Produk/produk');
const Usia = require('./models/Produk/subVariasi');
const Variasi = require('./models/Produk/variasi');
const path = require("path");
const Comments = require("./models/Forum/comments");
const Posts = require("./models/Forum/posts");
const Reply = require("./models/Forum/reply");
const Views = require("./models/Forum/view");
const Post = require("./models/Forum/posts");
const User = require("./models/User/users");
const simpanPost = require("./models/Forum/simpanPost");
const subVariasi = require("./models/Produk/subVariasi");
const Transaksi = require("./models/Transaksi/transaksi");
const Alamat = require("./models/Transaksi/alamat");
const TransaksiProduk = require("./models/Transaksi/transaksiproduk");
const PaymentGateway = require("./models/Transaksi/paymentgateway");
const Report = require("./models/Forum/report");
const Troli = require("./models/Produk/troli");
const Ulasan = require("./models/Ulasan/ulasan");

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: true
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routes);

sequelize.authenticate()
  .then(async () => {
    console.log('Connection success');
    // await TransaksiProduk.sync({ alter: true });
    // await Troli.sync({alter : true});
  })
  .catch(err => console.log('Error: ' + err));
// await TransaksiProduk.sync({alter : true});
// .catch(err => console.log('Error: ' + err));


const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
