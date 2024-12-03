const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sequelize = require("./config/config");
const routes = require("./routes/router");
const path = require("path");
const Comments = require("./models/Forum/comments");
const Post = require("./models/Forum/posts");
const User = require("./models/User/users");
const simpanPost = require("./models/Forum/simpanPost");
const subVariasi = require("./models/Produk/subVariasi");
const Transaksi = require("./models/Transaksi/transaksi");
const Alamat = require("./models/Transaksi/alamat");
const TransaksiProduk = require("./models/Transaksi/transaksiproduk");
const PaymentGateway = require("./models/Transaksi/paymentgateway");
const Report = require("./models/Forum/report");
const Troli = require("./models/Transaksi/troli");
const Ulasan = require("./models/Ulasan/ulasan");
const Pengeluaran = require("./models/Transaksi/pengeluaran");
const pPengeluaran = require("./models/Transaksi/petugasPengeluaran");
const Permintaan = require("./models/Transaksi/permintaan");
const detailPermintaan = require("./models/Transaksi/detailPermintaan");
const Reply = require("./models/Forum/reply");
const Notification = require("./models/Forum/notification");

dotenv.config();
const app = express();

// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", routes);

// Menginisialisasi server dan socket.io
const server = app.listen(process.env.PORT || 2000, () => {
  console.log(`Server running on port ${process.env.PORT || 2000}`);
});

const io = socketIo(server); // Menginisialisasi socket.io

// Menambahkan io ke setiap request Express menggunakan middleware
app.use((req, res, next) => {
  req.io = io; // Menambahkan io ke request agar bisa digunakan di controller
  next();
});

// Test connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


sequelize.authenticate()
  .then(async () => {
    console.log('Connection success');
    // await sequelize.sync();
  })
  .catch(err => console.log('Error: ' + err));



