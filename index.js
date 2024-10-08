const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')
const cookieParser = require("cookie-parser"); 
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const routes = require('./routes/router');
const Users = require("./models/User/users");
const Produk = require('./models/Produk/produk');
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
const Alamat = require("./models/User/alamat");
const Transaksi = require("./models/Transaksi/transaksi");
const Alamatt = require("./models/Transaksi/alamat");
const TransaksiProduk = require("./models/Transaksi/transaksiproduk");
const PaymentGateway = require("./models/Transaksi/paymentgateway");

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
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));;
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routes);
 
sequelize.authenticate()
.then(async () => {
    console.log('Connection success');
<<<<<<< HEAD
    // await PaymentGateway.sync({alter : true});

=======
    // await sequelize.sync({alter : true});
>>>>>>> 43f1071696821ce1623125516a4bf9846078e911
})
.catch(err => console.log('Error: ' + err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
