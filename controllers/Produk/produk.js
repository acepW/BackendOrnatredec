const multer = require('multer');
const path = require('path');
const Produk = require("../../models/Produk/produk");
const Usia = require('../../models/Produk/usia');
const Variasi = require('../../models/Produk/variasi');
const subVariasi = require('../../models/Produk/subVariasi');

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
      usia,
      variasi,
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

      // Validasi usia
      const usiaArray = usia ? JSON.parse(usia) : [];
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
      

      await newProduk.update({
        jumlah: jumlahStok,
      });

       const variasiArray = variasi ? JSON.parse(variasi) : [];
       for (let index = 0; index < variasiArray.length; index++) {
        const newVariasi = await Variasi.create({
           id_produk: newProduk.id,
           nama_variasi: variasiArray[index].nama_variasi,
         });

            const subVariasiArray = variasiArray[index].sub_variasi || [];
            for (let i = 0; i < subVariasiArray.length; i++) {
             await subVariasi.create({
              id_produk: newProduk.id,
              id_variasi: newVariasi.id,
              nama_variasi: subVariasiArray[i].nama_variasi,
              stok: subVariasiArray[i].stok,
              foto_variasi: req.files['foto_variasi'] ? req.files['foto_variasi'][i].filename : null
      });
    }
  }
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

    const { id } = req.params;
    const { judul_produk, deskripsi_produk, harga, variasi, usia, kategori_produk } = req.body;

    try {
      let jumlahStok = 0;

      const produk = await Produk.findByPk(id);
      if (!produk) {
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
      }

      await Produk.update({
        judul_produk,
        deskripsi_produk,
        foto_produk: req.files['foto_produk'] ? req.files['foto_produk'][0].filename : produk.foto_produk,
        harga,
        jumlah: jumlahStok,
        kategori_produk,
      }, {
        where: { id: id }
      });

      if (usia) {
        const usiaArray = JSON.parse(usia);
        await Usia.destroy({ where: { id_produk: id } });
        for (let index = 0; index < usiaArray.length; index++) {
          await Usia.create({
            id_produk: id,
            usia_produk: usiaArray[index].usia_produk,
            stok: usiaArray[index].stok,
            harga: usiaArray[index].harga,
            hargaSetelah: parseInt(produk.harga) + parseInt(usiaArray[index].harga),
          });
          jumlahStok += parseInt(usiaArray[index].stok);
        }
      }

      await Produk.update({
        jumlah: jumlahStok,
      }, {
        where: { id: id }
      });

      if (variasi) {
        const variasiArray = JSON.parse(variasi);
        await Variasi.destroy({ where: { id_produk: id } });
        for (let index = 0; index < variasiArray.length; index++) {
          const newVariasi = await Variasi.create({
            id_produk: id,
            nama_variasi: variasiArray[index].nama_variasi,
          });

          const subVariasiArray = variasiArray[index].sub_variasi || [];
          await subVariasi.destroy({ where: { id_produk: id } });
          for (let i = 0; i < subVariasiArray.length; i++) {
            await subVariasi.create({
              id_produk: id,
              id_variasi: newVariasi.id,
              nama_variasi: subVariasiArray[i].nama_variasi,
              stok: subVariasiArray[i].stok,
              foto_variasi: req.files['foto_variasi'] && req.files['foto_variasi'][i] ? req.files['foto_variasi'][i].filename : null
            });
          }
        }
      }

      const updatedProduk = await Produk.findByPk(id);

      if (updatedProduk && updatedProduk.foto_produk) {
        updatedProduk.foto_produk = `/uploads/${updatedProduk.foto_produk}`;
      }
      
      res.status(200).json(updatedProduk);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui produk." });
    }
  });
};
;

const getProduk = async (req, res) => {
  try {
    const produk = await Produk.findAll({
      include: [
        {
          model: Variasi,
          include: [{ model: subVariasi}],
        },
        {
          model: Usia
        }
      ]
    });
    // console.log(produk);
    
    res.json(produk);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createProduk,
  getProduk,
  editProduk,
};
