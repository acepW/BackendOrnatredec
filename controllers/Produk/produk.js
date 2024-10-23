const multer = require('multer');
const path = require('path');
const Produk = require("../../models/Produk/produk");
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
  // fileFilter
})
// .field([
//   { name: 'foto_produk', maxCount: 1 },       
//   // { name: 'foto_variasi', maxCount: 10 }      
// ]);

const createProduk = async (req, res) => {
  // upload(req, res, async (err) => {
  //   if (err) {
  //     return res.status(400).json({ message: err.message });
  //   }
  const foto_produk = req.file ? `/uploads/${req.file.filename}` : null; 
    const {
      judul_produk,
      deskripsi_produk,
      harga,
      variasi,
      kategori_produk, 
    } = req.body;

    try {
      let jumlahStok = 0;
      
      console.log(foto_produk);
      
      const newProduk = await Produk.create({
        judul_produk,
        deskripsi_produk,
        foto_produk,
        harga,
        jumlah: jumlahStok,
        kategori_produk,
      });

      if (variasi) {
        const variasiArray = JSON.parse(variasi);
        // const variasiArray = Array.isArray(variasi) ? variasi : [];
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
                nama_sub_variasi: subVariasiArray[i].nama_sub_variasi,
                usia : subVariasiArray[i].usia,
                stok: subVariasiArray[i].stok,
                harga: subVariasiArray[i].harga,
                // foto_variasi: req.files['foto_variasi'] ? req.files['foto_variasi'][i].filename : null
        });
        jumlahStok += parseInt(subVariasiArray[i].stok);
        console.log(jumlahStok);
        
      }
    }
      }
     
  await newProduk.update({
    jumlah: jumlahStok,
  });

      res.status(200).json(newProduk);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message});
    }
  };


const editProduk = async (req, res) => {
  // upload(req, res, async (err) => {
  //   if (err) {
  //     return res.status(400).json({ message: err.message });
  //   }
  const foto_produk = req.file ? `/uploads/${req.file.filename}` : null;
    const { id } = req.params;
    const {
      judul_produk,
      deskripsi_produk,
      harga,
      variasi,
      kategori_produk,
    } = req.body;

    try {
      let jumlahStok = 0;

      const produk = await Produk.findByPk(id);
      if (!produk) {
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
      }

       await Produk.update({
        judul_produk,
        deskripsi_produk,
        foto_produk,
        harga,
        jumlah: jumlahStok,
        kategori_produk,
      },{
          where: { id: id }
        });

        if (variasi) {
          const variasiArray = JSON.parse(variasi);
          // const variasiArray = Array.isArray(variasi) ? variasi : [];
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
                  nama_sub_variasi: subVariasiArray[i].nama_sub_variasi,
                  usia : subVariasiArray[i].usia,
                  stok: subVariasiArray[i].stok,
                  harga: subVariasiArray[i].harga,
                  // foto_variasi: req.files['foto_variasi'] ? req.files['foto_variasi'][i].filename : null
          });
          jumlahStok += parseInt(subVariasiArray[i].stok);
          console.log(jumlahStok);
          
        }
      }
        }
    
      await Produk.update({
            jumlah: jumlahStok,
          }, {
            where: { id: id }
          });
    
    
      const updatedProduk = await Produk.findByPk(id);

      res.status(200).json(updatedProduk);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message : error.message});
    }
  }

  const getProdukbyId = async (req, res) => {
    const id_produk = req.params.id
    try {
      const produk = await Produk.findOne(
        {
          where : {id : id_produk},
        include: [
          {
            model: Variasi,
            include: [{ model: subVariasi}],
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

  const getProdukFilter = async (req, res) => {
    const kategori = req.query.kategori
    try {
      const produk = await Produk.findAll({
        where : {kategori_produk: kategori},
      
      include : [ {
          model : Variasi,
          include: [{ model: subVariasi}],
      }]
    })
    return res.status(200).json(produk)
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

const filterKategoriProduk = async (req, res) => {
  const kategori = req.query.kategori
  try {
    if (!kategori) {
      const semuaProduk = await Produk.findAll({
        include : [ {
          model : Variasi,
          include: [{ model: subVariasi}],
      }]
      })
    return res.status(202).json(semuaProduk)
    } 
      const produk = await Produk.findAll({
        where : {kategori_produk: kategori},
      
      include : [ {
          model : Variasi,
          include: [{ model: subVariasi}],
      }]
    })
    return res.status(200).json(produk)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const hapusProduk = async (req , res) => {
  const idproduk  = req.params.id;
  try {
    const produk = await Produk.findByPk(idproduk)
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
  }

    await Produk.destroy({where : {id : idproduk}})
    await subVariasi.destroy({where : {id_produk : idproduk}})
    await Variasi.destroy({where : {id_produk : idproduk}})

    res.status(200).json({message :"sukses"})
  } catch (error) {
    res.status(500).json({message : error.message})
  }
}


module.exports = {
  createProduk,
  editProduk,
  filterKategoriProduk,
  getProdukbyId,
  getProdukFilter,
  upload,
  hapusProduk,
};