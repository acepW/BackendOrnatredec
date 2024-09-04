// produkController.js
const multer = require('multer');
const path = require('path');
const Produk = require("../models/produk");
const Pot = require("../models/pot");
const Usia = require("../models/usia");
const express = require('express');
const app = express();

// Middleware untuk menyajikan file di folder uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: './uploads/', // Direktori penyimpanan file yang diunggah
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  },
});

// Filter file untuk hanya menerima tipe gambar
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb('Error: Hanya gambar yang diperbolehkan!');
  }
};

// Inisialisasi Multer dengan storage dan filter file yang sudah didefinisikan
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Batas ukuran file: 5MB
  fileFilter,
});

// Fungsi utama untuk membuat produk
const createProduk = async (req, res) => {
  // Menggunakan middleware Multer untuk menangani unggahan file
  upload.single('foto_produk')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    const {
      judul_produk,
      deskripsi_produk,
      harga,
      id_usia,
      id_pot,
      jumlah,
    } = req.body;

    try {
      const pot = await Pot.findByPk(id_pot);
      const usia = await Usia.findByPk(id_usia);

      if (pot.stok < jumlah) {
        return res.status(400).json({ message: `Stok dengan varian ${pot.warna_pot} tidak mencukupi` });
      }

      if (usia.stok < jumlah) {
        return res.status(400).json({ message: `Stok dengan usia ${usia.usia_produk} tidak mencukupi` });
      }

      const newProduk = await Produk.create({
        judul_produk,
        deskripsi_produk,
        foto_produk: req.file ? req.file.filename : null, // Menyimpan nama file saja
        harga,
        id_usia,
        id_pot,
        jumlah,
      });

      await Pot.update(
        { stok: pot.stok - jumlah },
        { where: { id: id_pot } }
      );

      await Usia.update(
        { stok: usia.stok - jumlah },
        { where: { id: id_usia } }
      );

      const produk = await Produk.findOne({
        where: { id: newProduk.id },
        include: [
          {
            model: Pot,
            attributes: ['warna_pot'],
          },
          {
            model: Usia,
            as: 'usia',
            attributes: ['usia_produk'],
          },
        ],
      });

      // Mengembalikan URL lengkap untuk akses gambar
      if (produk && produk.foto_produk) {
        produk.foto_produk = `http://localhost:3005/uploads/${produk.foto_produk}`;
      }

      res.status(200).json(produk);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Terjadi kesalahan saat membuat produk." });
    }
  });
};

module.exports = {
  createProduk,
};
