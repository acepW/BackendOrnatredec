const multer = require('multer');
const path = require('path');
const Produk = require("../../models/Produk/produk");
const Variasi = require('../../models/Produk/variasi');
const subVariasi = require('../../models/Produk/subVariasi');
const { where } = require('sequelize');

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
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
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
        foto_produk: req.files['foto_produk'] ? req.files['foto_produk'][0].filename : null,
        harga,
        jumlah: jumlahStok,
        kategori_produk,
      },{
          where: { id: id }
        });

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
              nama_sub_variasi: subVariasiArray[i].nama_sub_variasi,
              usia : subVariasiArray[i].usia,
              stok: subVariasiArray[i].stok,
              harga: subVariasiArray[i].harga,
              foto_variasi: req.files['foto_variasi'] ? req.files['foto_variasi'][i].filename : null
      });
      jumlahStok += parseInt(subVariasiArray[i].stok);
      console.log(jumlahStok);
      
    }
  }
      await Produk.update({
            jumlah: jumlahStok,
          }, {
            where: { id: id }
          });
    
    
      const updatedProduk = await Produk.findByPk(id);

      if (updatedProduk && updatedProduk.foto_produk) {
        updatedProduk.foto_produk = `/uploads/${updatedProduk.foto_produk}`;
      }

      res.status(200).json(updatedProduk);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Terjadi kesalahan saat membuat produk." });
    }
  });
};

// const editProduk = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }

//     const { id } = req.params;
//     const { judul_produk, deskripsi_produk, harga, variasi, usia, kategori_produk } = req.body;

//     try {
//       let jumlahStok = 0;

//       const produk = await Produk.findByPk(id);
//       if (!produk) {
//         return res.status(404).json({ message: 'Produk tidak ditemukan' });
//       }

//       await Produk.update({
//         judul_produk,
//         deskripsi_produk,
//         foto_produk: req.files['foto_produk'] ? req.files['foto_produk'][0].filename : produk.foto_produk,
//         harga,
//         jumlah: jumlahStok,
//         kategori_produk,
//       }, {
//         where: { id: id }
//       });

//       if (usia) {
//         const usiaArray = JSON.parse(usia);
//         await Usia.destroy({ where: { id_produk: id } });
//         for (let index = 0; index < usiaArray.length; index++) {
//           await Usia.create({
//             id_produk: id,
//             usia_produk: usiaArray[index].usia_produk,
//             stok: usiaArray[index].stok,
//             harga: usiaArray[index].harga,
//             hargaSetelah: parseInt(produk.harga) + parseInt(usiaArray[index].harga),
//           });
//           jumlahStok += parseInt(usiaArray[index].stok);
//         }
//       }

//       await Produk.update({
//         jumlah: jumlahStok,
//       }, {
//         where: { id: id }
//       });

//       if (variasi) {
//         const variasiArray = JSON.parse(variasi);
//         await Variasi.destroy({ where: { id_produk: id } });
//         for (let index = 0; index < variasiArray.length; index++) {
//           const newVariasi = await Variasi.create({
//             id_produk: id,
//             nama_variasi: variasiArray[index].nama_variasi,
//           });

//           const subVariasiArray = variasiArray[index].sub_variasi || [];
//           await subVariasi.destroy({ where: { id_produk: id } });
//           for (let i = 0; i < subVariasiArray.length; i++) {
//             await subVariasi.create({
//               id_produk: id,
//               id_variasi: newVariasi.id,
//               nama_variasi: subVariasiArray[i].nama_variasi,
//               stok: subVariasiArray[i].stok,
//               foto_variasi: req.files['foto_variasi'] && req.files['foto_variasi'][i] ? req.files['foto_variasi'][i].filename : null
//             });
//           }
//         }
//       }

//       const updatedProduk = await Produk.findByPk(id);

//       if (updatedProduk && updatedProduk.foto_produk) {
//         updatedProduk.foto_produk = `/uploads/${updatedProduk.foto_produk}`;
//       }
      
//       res.status(200).json(updatedProduk);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat memperbarui produk." });
//     }
//   });
// };

const getProduk = async (req, res) => {
  try {
    const produk = await Produk.findAll({
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

// const editProduk = async (req, res) => {
  //   upload(req, res, async (err) => {
  //     if (err) {
  //       return res.status(400).json({ message: err.message });
  //     }
  
  //     const { id } = req.params;
  //     const { judul_produk, deskripsi_produk, harga, variasi, usia, kategori_produk } = req.body;
  
  //     try {
  //       let jumlahStok = 0;
  
  //       const produk = await Produk.findByPk(id);
  //       if (!produk) {
  //         return res.status(404).json({ message: 'Produk tidak ditemukan' });
  //       }
  
  //       await Produk.update({
  //         judul_produk,
  //         deskripsi_produk,
  //         foto_produk: req.files['foto_produk'] ? req.files['foto_produk'][0].filename : produk.foto_produk,
  //         harga,
  //         jumlah: jumlahStok,
  //         kategori_produk,
  //       }, {
  //         where: { id: id }
  //       });
  
  //       if (usia) {
  //         const usiaArray = JSON.parse(usia);
  //         await Usia.destroy({ where: { id_produk: id } });
  //         for (let index = 0; index < usiaArray.length; index++) {
  //           await Usia.create({
  //             id_produk: id,
  //             usia_produk: usiaArray[index].usia_produk,
  //             stok: usiaArray[index].stok,
  //             harga: usiaArray[index].harga,
  //             hargaSetelah: parseInt(produk.harga) + parseInt(usiaArray[index].harga),
  //           });
  //           jumlahStok += parseInt(usiaArray[index].stok);
  //         }
  //       }
  
  //       await Produk.update({
  //         jumlah: jumlahStok,
  //       }, {
  //         where: { id: id }
  //       });
  
  //       if (variasi) {
  //         const variasiArray = JSON.parse(variasi);
  //         await Variasi.destroy({ where: { id_produk: id } });
  //         for (let index = 0; index < variasiArray.length; index++) {
  //           const newVariasi = await Variasi.create({
  //             id_produk: id,
  //             nama_variasi: variasiArray[index].nama_variasi,
  //           });
  
  //           const subVariasiArray = variasiArray[index].sub_variasi || [];
  //           await subVariasi.destroy({ where: { id_produk: id } });
  //           for (let i = 0; i < subVariasiArray.length; i++) {
  //             await subVariasi.create({
  //               id_produk: id,
  //               id_variasi: newVariasi.id,
  //               nama_variasi: subVariasiArray[i].nama_variasi,
  //               stok: subVariasiArray[i].stok,
  //               foto_variasi: req.files['foto_variasi'] && req.files['foto_variasi'][i] ? req.files['foto_variasi'][i].filename : null
  //             });
  //           }
  //         }
  //       }
  
  //       const updatedProduk = await Produk.findByPk(id);
  
  //       if (updatedProduk && updatedProduk.foto_produk) {
  //         updatedProduk.foto_produk = `/uploads/${updatedProduk.foto_produk}`;
  //       }
        
  //       res.status(200).json(updatedProduk);
  //     } catch (error) {
  //       console.log(error);
  //       res.status(500).json({ message: "Terjadi kesalahan saat memperbarui produk." });
  //     }
  //   });
  // };
  
  const getProdukbyId = async (req, res) => {
    const id_produk = req.params.id
    try {
      const produk = await Produk.findOne(
        {
          where : {id : id_produk}
        },{
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

const filterKategoriProduk = async (req, res) => {
  const kategori = req.query.kategori

  try {
    const produk = await Produk.findAll({
      where : {kategori_produk: kategori},
    
    include : [ {
        model : Variasi,
        include: [{ model: subVariasi}],
    }]
  })

  res.status(200).json(produk)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// const createProduk = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }

//     const {
//       judul_produk,
//       deskripsi_produk,
//       harga,
//       variasi,
//       kategori_produk,
//     } = req.body;

//     try {
//       let jumlahStok = 0;

//       const newProduk = await Produk.create({
//         judul_produk,
//         deskripsi_produk,
//         foto_produk: req.files['foto_produk'] ? req.files['foto_produk'][0].filename : null,
//         harga,
//         jumlah: jumlahStok,
//         kategori_produk,
//       });

//       if (variasi) {
//         const variasiArray = JSON.parse(variasi);

//         if (variasiArray.length < 2) {
//           return res.status(400).json({ message: "Minimal dua variasi diperlukan." });
//         }

//         const kombinasi = [];

//         // Buat variasi dan sub-variasi
//         for (let index = 0; index < variasiArray.length; index++) {
//           const newVariasi = await Variasi.create({
//             id_produk: newProduk.id,
//             nama_variasi: variasiArray[index].nama_variasi,
//           });

//           const subVariasiArray = variasiArray[index].sub_variasi || [];
//           for (let i = 0; i < subVariasiArray.length; i++) {
//             const fotoSubVariasi = req.files['foto_variasi'] && req.files['foto_variasi'][i] ? req.files['foto_variasi'][i].filename : null;

//             const newSubVariasi = await subVariasi.create({
//               id_produk: newProduk.id,
//               id_variasi: newVariasi.id,
//               nama_variasi: subVariasiArray[i].nama_variasi,
//               foto_variasi: fotoSubVariasi
//             });

//             console.log(`SubVariasi Created: ID = ${newSubVariasi.id}`);
//           }
//         }

//         // Membuat kombinasi
//         if (Array.isArray(variasiArray[0].sub_variasi) && Array.isArray(variasiArray[1].sub_variasi)) {
//           for (let i = 0; i < variasiArray[0].sub_variasi.length; i++) {
//             for (let j = 0; j < variasiArray[1].sub_variasi.length; j++) {
//               const idVariasi1 = await Variasi.findOne({
//                 where: { id_produk: newProduk.id, nama_variasi: variasiArray[0].nama_variasi },
//                 include: [{ model: subVariasi, as: 'sub_variasi' }] 
//               });
        
//               const idVariasi2 = await Variasi.findOne({
//                 where: { id_produk: newProduk.id, nama_variasi: variasiArray[1].nama_variasi },
//                 include: [{ model: subVariasi, as: 'sub_variasi' }]
//               });
        
//               if (idVariasi1 && idVariasi2) {
//                 const idSubVariasi1 = idVariasi1.sub_variasi[i]?.id; 
//                 const idSubVariasi2 = idVariasi2.sub_variasi[j]?.id;
        
//                 if (idSubVariasi1 !== undefined && idSubVariasi2 !== undefined) {
//                   kombinasi.push({
//                     id_produk: newProduk.id,
//                     id_variasi1: idVariasi1.id,
//                     id_subVariasi1: idSubVariasi1,
//                     id_variasi2: idVariasi2.id,
//                     id_subVariasi2: idSubVariasi2,
//                   });
//                 } else {
//                   console.error(`ID Sub-Variasi tidak ditemukan: SubVariasi1 = ${idSubVariasi1}, SubVariasi2 = ${idSubVariasi2}`);
//                 }
//               } else {
//                 console.error(`ID Variasi tidak ditemukan: Variasi1 = ${idVariasi1}, Variasi2 = ${idVariasi2}`);
//               }
//             }
//           }
//         } else {
//           console.error('Sub-variasi tidak terdefinisi atau bukan array:', {
//             subVariasi1: variasiArray[0].sub_variasi,
//             subVariasi2: variasiArray[1].sub_variasi
//           });
//         }
        
//         console.log('Kombinasi sebelum bulk create:', kombinasi);

//         await ProdukKombinasi.bulkCreate(kombinasi);
//       }

//       if (newProduk && newProduk.foto_produk) {
//         newProduk.foto_produk = `/uploads/${newProduk.foto_produk}`;
//       }

//       res.status(200).json(newProduk);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat membuat produk." });
//     }
//   });
// };


// const editProduk = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }

//     const { id } = req.params;
//     const {
//       judul_produk,
//       deskripsi_produk,
//       harga,
//       variasi,
//       usia,
//       kategori_produk,
//     } = req.body;

//     try {
//       let jumlahStok = 0;

//       const produk = await Produk.findByPk(id);
//       if (!produk) {
//         return res.status(404).json({ message: 'Produk tidak ditemukan' });
//       }

//       await Produk.update({
//         judul_produk,
//         deskripsi_produk,
//         foto_produk: req.files['foto_produk'] ? req.files['foto_produk'][0].filename : produk.foto_produk,
//         harga,
//         jumlah: jumlahStok,
//         kategori_produk,
//       }, {
//         where: { id: id }
//       });

//       if (variasi) {
//         const variasiArray = JSON.parse(variasi);
//         await Variasi.destroy({ where: { id_produk: id } });
//         for (let index = 0; index < variasiArray.length; index++) {
//             await Variasi.create({
//                 id_produk: id,
//                 nama_variasi: variasiArray[index].nama_variasi,
//                 stok: variasiArray[index].stok,
//                 foto_variasi: req.files['foto_variasi'] ? req.files['foto_variasi'][index].filename : null,
//             });
//         }
//     }

//       if (usia) {
//         const usiaArray = JSON.parse(usia);
//         await Usia.destroy({ where: { id_produk: id } });
//         for (let index = 0; index < usiaArray.length; index++) {
//           await Usia.create({
//             id_produk: id,
//             usia_produk: usiaArray[index].usia_produk,
//             stok: usiaArray[index].stok,
//             harga: usiaArray[index].harga,
//             hargaSetelah: parseInt(produk.harga) + parseInt(usiaArray[index].harga),
//           }
//         );

//           jumlahStok += parseInt(usiaArray[index].stok);
//         }
//       }

//       await Produk.update({
//         jumlah: jumlahStok,
//       }, {
//         where: { id: id }
//       });

//       const updatedProduk = await Produk.findByPk(id);

//       if (updatedProduk && updatedProduk.foto_produk) {
//         updatedProduk.foto_produk = `/uploads/${updatedProduk.foto_produk}`;
//       }
      
//       res.status(200).json(updatedProduk);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Terjadi kesalahan saat memperbarui produk." });
//     }
//   });
// };

module.exports = {
  createProduk,
  getProduk,
  editProduk,
  filterKategoriProduk,
  getProdukbyId,
  upload
};
