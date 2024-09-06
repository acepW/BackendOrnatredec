const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoutes = require('./routes/authRoutes');
const db = require('./config/database');
const User = require("./models/users"); // Pastikan ini menunjuk ke model User yang benar

dotenv.config();

const app = express();
const server = http.createServer(app); // Membuat server HTTP
const io = socketIo(server); // Integrasi Socket.IO dengan server

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    origin: true
}));

// Routes
app.use('/api/auth', authRoutes);

// Socket.IO Setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // Event untuk mengirim notifikasi setelah login
  socket.on('user_logged_in', (data) => {
    // Emit event ke semua client kecuali yang mengirimkan
    socket.broadcast.emit('new_notification', { message: `${data.username} has logged in!` });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Database synchronization
db.sync({ force: false })  // force: true akan drop tabel lama dan membuat baru setiap kali server dijalankan. Hati-hati menggunakannya.
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Unable to create tables, shutting down the server:', error);
    process.exit(1); // Stop server if there is an issue with the database
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
