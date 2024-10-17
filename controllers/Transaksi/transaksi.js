const Transaksi = require('../../models/Transaksi/transaksi');
const Produk = require('../../models/Produk/produk');
const Alamat = require('../../models/Transaksi/alamat');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk'); // Jika menggunakan tabel pivot
const Variasi = require('../../models/Produk/variasi');
const subVariasi = require('../../models/Produk/subVariasi');
const User = require("../../models/User/users");

const BIAYA_LAYANAN = 5000;

const createTransaksi = async (req, res) => {
    const { produk } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const alamat = await Alamat.findOne({ where: { userId: userId } });
        if (!alamat) {
            return res.status(404).json({ message: 'Alamat tidak ditemukan' });
        }

        let subTotal = 0;
        const produkDetails = [];

        const newTransaksi = await Transaksi.create({
            user_id: userId,
            id_alamat: alamat.id,
            sub_total: 0,
            biaya_layanan: BIAYA_LAYANAN,
            total_pembayaran: 0
        });

        for (const item of produk) {
            const produkItem = await Produk.findByPk(item.id_produk, {
                include: [
                    {
                        model: Variasi,
                        as: 'variasis',
                        include: [
                            {
                                model: subVariasi,
                                as: 'subvariasis',
                                where: { id: item.id_subvariasi } // Menggunakan id_subvariasi untuk filter
                            }
                        ]
                    }
                ]
            });

            if (!produkItem) {
                return res.status(404).json({ message: `Produk dengan ID ${item.id_produk} tidak ditemukan` });
            }

            if (produkItem.jumlah < item.jumlah) {
                return res.status(400).json({ message: `Stok tidak cukup untuk produk dengan ID ${item.id_produk}` });
            }

            // Dapatkan harga dari subvariasi
            const subVariasiItem = produkItem.variasis[0]?.subvariasis.find(sv => sv.id === item.id_subvariasi);
            const hargaSubVariasi = subVariasiItem ? subVariasiItem.harga : 0;

            const itemSubTotal = (produkItem.harga + hargaSubVariasi) * item.jumlah; // Tambahkan harga produk dan subvariasi
            subTotal += itemSubTotal;

            // Update stok subvariasi
            if (subVariasiItem) {
                await subVariasi.update({ stok: subVariasiItem.stok - item.jumlah }, { where: { id: subVariasiItem.id } });
            }

            produkDetails.push({
                id: produkItem.id,
                nama_produk: produkItem.judul_produk,
                harga: produkItem.harga,
                jumlah: item.jumlah,
                sub_variasi: {
                    id_subvariasi: subVariasiItem ? subVariasiItem.id : null,
                    ukuran_pot: subVariasiItem ? subVariasiItem.nama_sub_variasi : null,
                    usia: subVariasiItem ? subVariasiItem.usia : null,
                }
            });
            
            const subvariasi = await subVariasi.findOne({ where: { id: subVariasiItem.id } })
            const id_variasi = subvariasi.id_variasi
            await produkItem.update({ jumlah: produkItem.jumlah - item.jumlah });

            const existingEntry = await TransaksiProduk.findOne({
                where: {
                    id_transaksi: newTransaksi.id,
                    id_produk: produkItem.id
                }
            });

            if (existingEntry) {
                await existingEntry.update({ jumlah: existingEntry.jumlah + item.jumlah });
            } else {
                await TransaksiProduk.create({
                    id_alamat: alamat.id,
                    user_id: userId,
                    id_transaksi: newTransaksi.id,
                    id_produk: produkItem.id,
                    id_subvariasi: subVariasiItem.id,
                    id_variasi : id_variasi,
                    jumlah: item.jumlah
                });
            }
        }

        const totalPembayaran = subTotal + BIAYA_LAYANAN;

        await newTransaksi.update({
            sub_total: subTotal,
            total_pembayaran: totalPembayaran
        });

        const response = {
            id: newTransaksi.id,
            user: {
                id: user.id,
                username: user.username
            },
            produk: produkDetails,
            alamat: {
                id: alamat.id,
                provinsi: alamat.provinsi,
                kota_kabupaten: alamat.kota_kabupaten,
                kecamatan: alamat.kecamatan,
                kelurahan_desa: alamat.kelurahan_desa,
                jalan_namagedung: alamat.jalan_namagedung,
                patokan: alamat.patokan,
                nama_penerima: alamat.nama_penerima,
                no_hp: alamat.no_hp,
                kategori_alamat: alamat.kategori_alamat,
                alamat_pengiriman_utama: alamat.alamat_pengiriman_utama
            },
            sub_total: subTotal,
            biaya_layanan: BIAYA_LAYANAN,
            total_pembayaran: totalPembayaran
        };

        res.status(201).json(response);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

<<<<<<< HEAD
// const getAllTransaksi = async (req, res) => {
//     try {
//         const transaksi = await Transaksi.findAll({
//             include: [
//                 {
//                     model: Produk,
//                     through: { attributes: ['jumlah'] },
//                     attributes: ['id', 'judul_produk', 'harga']
//                 },
//                 {
//                     model: Alamat,
//                     attributes: ['provinsi', 'kota_kabupaten', 'kecamatan', 'kelurahan_desa', 'jalan_namagedung', 'patokan', 'nama_penerima', 'no_hp', 'kategori_alamat', 'alamat_pengiriman_utama']
//                 },
//                 {
//                     model: User,
//                     attributes: ['id', 'username']
//                 }
//             ]
//         });

//         const response = transaksi.map(transaksiItem => ({
//             id: transaksiItem.id,
//             user: {
//                 id: transaksiItem.user.id,
//                 username: transaksiItem.user.username
//             },
//             produk: transaksiItem.produks.map(item => ({
//                 id: item.id,
//                 nama_produk: item.judul_produk,
//                 harga: item.harga,
//                 jumlah: item.transaksi_produk.jumlah
//             })),
//             alamat: transaksiItem.alamat,
//             sub_total: transaksiItem.sub_total,
//             biaya_layanan: transaksiItem.biaya_layanan,
//             total_pembayaran: transaksiItem.total_pembayaran
//         }));
=======
const getAllTransaksi = async (req, res) => {
    try {
        const transaksi = await Transaksi.findAll({
            include: [
                {
                    model: Produk,
                    through: { attributes: ['jumlah'] },
                    attributes: ['id', 'judul_produk', 'harga']
                },
                {
                    model: Alamat,
                    attributes: ['provinsi', 'kota_kabupaten', 'kecamatan', 'kelurahan_desa', 'jalan_namagedung', 'patokan', 'nama_penerima', 'no_hp', 'kategori_alamat', 'alamat_pengiriman_utama']
                },
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ]
        });

        const response = transaksi.map(transaksiItem => ({
            id: transaksiItem.id,
            user: {
                id: transaksiItem.user.id,
                username: transaksiItem.user.username
            },
            produk: transaksiItem.produks.map(item => ({
                id: item.id,
                nama_produk: item.judul_produk,
                harga: item.harga,
                jumlah: item.transaksi_produk.jumlah
            })),
            alamat: transaksiItem.alamat,
            sub_total: transaksiItem.sub_total,
            biaya_layanan: transaksiItem.biaya_layanan,
            total_pembayaran: transaksiItem.total_pembayaran
        }));
>>>>>>> 318ffece20a58d30e095949180766a0af3d52b74

//         res.status(200).json(response);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ message: 'Terjadi kesalahan pada server' });
//     }
// };

const getTransaksiById = async (req, res) => {
    try {
        const id = req.params.id;

        const transaksi = await Transaksi.findOne({
            where: { id: id },
            include: [
                 {
                    model: Produk,
                    through: { attributes: ['jumlah'] },
                    attributes: ['id', 'judul_produk', 'harga'],
                    include: [
                        {
                            model: Variasi,
                            attributes: ['nama_variasi']
                        },
                        {
                            model: subVariasi,
                            attributes: ['nama_sub_variasi', 'usia']
                        }
                    ]
                },
                {
                    model: Alamat,
                    attributes: ['provinsi', 'kota_kabupaten', 'kecamatan', 'kelurahan_desa', 'jalan_namagedung', 'patokan', 'nama_penerima', 'no_hp', 'kategori_alamat', 'alamat_pengiriman_utama']
                },
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ]
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        const response = {
            id: transaksi.id,
            user: {
<<<<<<< HEAD
                id: transaksi.User.id,
                username: transaksi.User.username
=======
                id: transaksi.user.id,
                username: transaksi.user.username
>>>>>>> 318ffece20a58d30e095949180766a0af3d52b74
            },
            produk: transaksi.produks.map(item => ({
                id: item.id,
                nama_produk: item.judul_produk,
                harga: item.harga,
                jumlah: item.transaksi_produk.jumlah,
                nama_variasi: item.Variasi.nama_variasi,
                nama_sub_variasi : item.subVariasi.nama_sub_variasi,
                usia : item.subVariasi.usia
            })),
            alamat: transaksi.alamat,
            sub_total: transaksi.sub_total,
            biaya_layanan: transaksi.biaya_layanan,
            total_pembayaran: transaksi.total_pembayaran
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const getTransaksiFilter = async (req, res) => {
    const status = req.query.status
    try {
    if (!status) {
       const TransaksiStatus = await TransaksiProduk.findAll({
           include: [{
              model: User,
              attributes : ['username']
      },
              {
              model: Produk,  
              attributes : ['judul_produk', 'foto_produk', 'harga',]
      },
              {
                  model: Variasi,
                  attributes : ['nama_variasi']
      },
              {
                  model: subVariasi,
                  attributes : ['nama_sub_variasi']
      },
              {
          model: Alamat 
          
      }]
    })
        return res.status(200).json(TransaksiStatus)
        } 
       const Transaksi = await TransaksiProduk.findAll({
        where : {status: status},
          include: [{
              model: User,
              attributes : ['username']
      },
              {
              model: Produk,  
              attributes : ['judul_produk', 'foto_produk', 'harga',]
      },
              {
                  model: Variasi,
                  attributes : ['nama_variasi']
      },
              {
                  model: subVariasi,
                  attributes : ['nama_sub_variasi']
      },
              {
          model: Alamat 
          
      }]
       }) 
         return res.status(202).json(Transaksi)
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

module.exports = {
    createTransaksi,
    // getAllTransaksi,
    getTransaksiById,
    getTransaksiFilter
};
