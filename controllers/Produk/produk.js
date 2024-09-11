const multer = require('multer');
const path = require('path');
const Produk = require("../../models/Produk/produk");
const Usia = require('../../models/Produk/usia');
const Variasi = require('../../models/Produk/variasi');
const { isArray } = require('util');

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

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // batasan ukuran file (5MB)
  fileFilter
}).fields([
  { name: 'foto_produk', maxCount: 1 },       
  { name: 'foto_variasi', maxCount: 10 }      
]);

// Fungsi utama untuk membuat produk
const createProduk = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const {
      judul_produk,
      deskripsi_produk,
      harga,
      variasi,
      usia,
      kategori_produk,
    } = req.body;

    try {
      let jumlahStok = 0;

      const newProduk = await Produk.create({
        judul_produk,
        deskripsi_produk,
        foto_produk: req.files['foto_produk'] ? req.files['foto_produk'][0].filename : null,
        harga,
        jumlah: jumlahStok,
        kategori_produk,
      });

      // Validasi variasi
      const variasiArray = variasi ? JSON.parse(variasi) : [];
      if (Array.isArray(variasiArray)) {
        for (let index = 0; index < variasiArray.length; index++) {
         await Variasi.create({
            id_produk: newProduk.id,
            nama_variasi: variasiArray[index].nama_variasi,
            stok: variasiArray[index].stok,
            foto_variasi: req.files['foto_variasi'] ? req.files['foto_variasi'][index].filename : null
          });
        }
      }

      // Validasi usia
      const usiaArray = usia ? JSON.parse(usia) : [];
      if (Array.isArray(usiaArray)) {
        for (let index = 0; index < usiaArray.length; index++) {
          await Usia.create({
            id_produk: newProduk.id,
            usia_produk: usiaArray[index].usia_produk,
            stok: usiaArray[index].stok,
            harga: usiaArray[index].harga,
            hargaSetelah: parseInt(newProduk.harga) + parseInt(usiaArray[index].harga),
          }
        );

          jumlahStok += parseInt(usiaArray[index].stok);
        }
      }

      await newProduk.update({
        jumlah: jumlahStok,
      });

      // Set foto URL
      if (newProduk && newProduk.foto_produk) {
        newProduk.foto_produk = `/uploads/${newProduk.foto_produk}`;
      }

     

      res.status(200).json(newProduk);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Terjadi kesalahan saat membuat produk." });
    }
  });
};



const editProduk = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    const id = req.params.id
    const {
      judul_produk,
      deskripsi_produk,
      harga,
      variasi,
      usia,
      kategori_produk,
    } = req.body;

    try {
      let jumlahStok = 0;

      const newProduk = await Produk.update(
        {where : {id : id}},
        {
        judul_produk,
        deskripsi_produk,
        foto_produk: req.files['foto_produk'] ? req.files['foto_produk'][0].filename : null,
        harga,
        jumlah: jumlahStok,
        kategori_produk,
      });

      // Validasi variasi
      const variasiArray = variasi ? JSON.parse(variasi) : [];
      if (Array.isArray(variasiArray)) {
        for (let index = 0; index < variasiArray.length; index++) {
         await Variasi.update({
            id_produk: newProduk.id,
            nama_variasi: variasiArray[index].nama_variasi,
            stok: variasiArray[index].stok,
            foto_variasi: req.files['foto_variasi'] ? req.files['foto_variasi'][index].filename : null
          },
          {where : {id : variasiArray[index].id}}
        );
        }
      }

      // Validasi usia
      const usiaArray = usia ? JSON.parse(usia) : [];
      if (Array.isArray(usiaArray)) {
        for (let index = 0; index < usiaArray.length; index++) {
          await Usia.update({
            id_produk: newProduk.id,
            usia_produk: usiaArray[index].usia_produk,
            stok: usiaArray[index].stok,
            harga: usiaArray[index].harga,
            hargaSetelah: parseInt(newProduk.harga) + parseInt(usiaArray[index].harga),
          }
        );

          jumlahStok += parseInt(usiaArray[index].stok);
        }
      }

      await newProduk.update({
        jumlah: jumlahStok,
      });

      // Set foto URL
      if (newProduk && newProduk.foto_produk) {
        newProduk.foto_produk = `/uploads/${newProduk.foto_produk}`;
      }

     

      res.status(200).json(newProduk);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Terjadi kesalahan saat membuat produk." });
    }
  });
};

const getProduk = async (req, res) => {
  try {
    const produk = await Produk.findAll({
      include: [
        {
          model: Variasi
        },
        {
          model: Usia
        }
      ]
    });
    res.json(produk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduk,
  getProduk,
  editProduk
};
