const Transaksi = require('../../models/Transaksi/transaksi');
const Produk = require('../../models/Produk/produk');
const Alamat = require('../../models/Transaksi/alamat');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk');
const Variasi = require('../../models/Produk/variasi');
const subVariasi = require('../../models/Produk/subVariasi');
const User = require("../../models/User/users");
const { Op } = require('sequelize');
const PaymentGateway = require('../../models/Transaksi/paymentgateway');


const createTransaksi = async (req, res) => {
    const { produk } = req.body;
    const userId = req.user.id;
    
    try {
        const BIAYA_LAYANAN = 2500;
        // Temukan user dan alamat
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const alamat = await Alamat.findOne({ where: { userId: userId } });
        if (!alamat) {
            return res.status(404).json({ message: 'Alamat tidak ditemukan' });
        }
        
        const idAlamat = alamat.id;
        console.log(idAlamat);
        
        // Buat transaksi baru
        const newTransaksi = await Transaksi.create({
            user_id: userId,
            id_alamat: alamat.id, // Pastikan ini 'id' dari model Alamat
            sub_total: 0,
            biaya_layanan: BIAYA_LAYANAN,
            total_pembayaran: 0
        });

        let subTotal = 0;
        const produkDetails = [];

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
                                where: { id: item.id_subvariasi }
                            }
                        ]
                    }
                ]
            });

            if (!produkItem || produkItem.jumlah < item.jumlah) {
                return res.status(404).json({ message: `Produk dengan ID ${item.id_produk} tidak ditemukan atau stok tidak cukup` });
            }

            const subVariasiItem = produkItem.variasis[0]?.subvariasis.find(sv => sv.id === item.id_subvariasi);
            const variasiItem = produkItem.variasis.length > 0 ? produkItem.variasis[0] : null;
           
            const hargaSubVariasi = subVariasiItem ? subVariasiItem.harga : 0;
            const itemSubTotal = hargaSubVariasi* item.jumlah;

            // Update stok produk dan sub variasi
            await Promise.all([
                produkItem.update({ jumlah: produkItem.jumlah - item.jumlah }),
                subVariasiItem && subVariasiItem.update({ stok: subVariasiItem.stok - item.jumlah })
            ]);

            subTotal += itemSubTotal;

            produkDetails.push({
                id: produkItem.id,
                nama_produk: produkItem.judul_produk,
                harga: produkItem.harga + hargaSubVariasi,
                jumlah: item.jumlah,
                variasiItem: produkItem.variasis[0],
                sub_variasi: subVariasiItem
            });

            await TransaksiProduk.upsert({
                id_transaksi: newTransaksi.id,
                user_id : userId,
                id_alamat: alamat.id, 
                id_produk: produkItem.id,
                id_subvariasi: subVariasiItem ? subVariasiItem.id : null,
                id_variasi: produkItem.variasis[0]?.id,
                jumlah: item.jumlah,
                totalHarga: itemSubTotal
            });
        }

        const totalPembayaran = subTotal + BIAYA_LAYANAN;
        await newTransaksi.update({ sub_total: subTotal, total_pembayaran: totalPembayaran });

        const response = {
            id: newTransaksi.id,
            user: { id: user.id, username: user.username },
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
        res.status(500).json({ message: error.message });
    }
};

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
const getAllTransaksi = async (req, res) => {
    try {
        const transaksi = await Transaksi.findAll({
            include: [
                {
                    model: Produk,
                    through: { attributes: ['jumlah', 'totalHarga'] },
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
                jumlah: item.transaksi_produk.jumlah,
                totalHarga: item.transaksi_produk.totalHarga
            })),
            alamat: transaksiItem.alamat,
            sub_total: transaksiItem.sub_total,
            biaya_layanan: transaksiItem.biaya_layanan,
            total_pembayaran: transaksiItem.total_pembayaran
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const getTransaksiById = async (req, res) => {
    const transaksiId = req.params.id;
    try {
        const transaksi = await Transaksi.findOne({
            where : {id : transaksiId},
            include: [
                {
                    model: TransaksiProduk,
                    include: [
                         {
                    model: Produk,
                    attributes: ['id', 'judul_produk', 'harga'],
                        },
                 {
                            model: Variasi,
                            attributes: ['nama_variasi']
                        },
                        {
                            model: subVariasi,
                            attributes: ['nama_sub_variasi', 'usia']
                        },
                {
                    model: Alamat,
                    attributes: [
                        'provinsi', 'kota_kabupaten', 'kecamatan',
                        'kelurahan_desa', 'jalan_namagedung', 'patokan',
                        'nama_penerima', 'no_hp', 'kategori_alamat', 'alamat_pengiriman_utama'
                    ]
                },
                {
                    model: User,
                    attributes: ['id', 'username']
                }
                    ]
            },
         ]
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        res.status(200).json(transaksi);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
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
        const paymentGateway = await PaymentGateway.findAll()
        return res.status(200).json(TransaksiStatus , paymentGateway)
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

const getTransaksiDikirimDanDikemas = async (req, res) => {
    try {
        const status = ['dikemas', 'dikirim']
        const TransaksiStatus = await TransaksiProduk.findAll({
            order: [['status', 'ASC'],
                  ['updatedAt', 'DESC']],
            where: {
                status: {
                    [Op.in]: status
                }
            },
            include: [{
                model: User,
                attributes: ['username']
            },
            {
                model: Produk,
                attributes: ['judul_produk', 'foto_produk', 'harga',]
            },
            {
                model: Variasi,
                attributes: ['nama_variasi']
            },
            {
                model: subVariasi,
                attributes: ['nama_sub_variasi']
            },
            {
                model: Alamat

            }]
        })
        return res.status(200).json(TransaksiStatus)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
  

module.exports = {
    createTransaksi,
    // getAllTransaksi,
    getTransaksiById,
    getTransaksiFilter,
    getTransaksiDikirimDanDikemas
};

