const Transaksi = require('../../models/Transaksi/transaksi');
const Produk = require('../../models/Produk/produk');
const Alamat = require('../../models/Transaksi/alamat');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk');
const Variasi = require('../../models/Produk/variasi');
const subVariasi = require('../../models/Produk/subVariasi');
const User = require("../../models/User/users");
const Troli = require('../../models/Produk/troli');
const { Op } = require('sequelize');

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
                        attributes: ['id', 'nama_variasi'], // Ambil hanya id dan nama_variasi
                        include: [
                            {
                                model: subVariasi,
                                as: 'subvariasis',
                                where: { id: item.id_subvariasi },
                                attributes: ['id', 'nama_sub_variasi', 'harga', 'usia'] // Ambil field yang dibutuhkan
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

            const subVariasiItem = produkItem.variasis[0]?.subvariasis.find(sv => sv.id === item.id_subvariasi);
            const variasiItem = produkItem.variasis.length > 0 ? produkItem.variasis[0] : null;
           
            const hargaSubVariasi = subVariasiItem ? subVariasiItem.harga : 0;

            const itemSubTotal = (produkItem.harga + hargaSubVariasi) * item.jumlah;
            subTotal += itemSubTotal;

            if (subVariasiItem) {
                await subVariasi.update({ stok: subVariasiItem.stok - item.jumlah }, { where: { id: subVariasiItem.id } });
            }

            produkDetails.push({
                id: produkItem.id,
                nama_produk: produkItem.judul_produk,
                harga: produkItem.harga + hargaSubVariasi,
                jumlah: item.jumlah,
                variasiItem: variasiItem ? { id: variasiItem.id, nama_variasi: variasiItem.nama_variasi } : null, // Hanya ambil id dan nama_variasi
                sub_variasi: subVariasiItem ? {
                    id_subvariasi: subVariasiItem.id,
                    ukuran_pot: subVariasiItem.nama_sub_variasi,
                    usia: subVariasiItem.usia
                } : null
            });

            await produkItem.update({ jumlah: produkItem.jumlah - item.jumlah });

            const existingEntry = await TransaksiProduk.findOne({
                where: {
                    id_transaksi: newTransaksi.id,
                    id_produk: produkItem.id
                }
            });

            const totalHarga = (produkItem.harga + hargaSubVariasi) * item.jumlah;

            if (existingEntry) {
                // Jika entri sudah ada, update jumlah
                await existingEntry.update({ jumlah: existingEntry.jumlah + item.jumlah });
                await existingEntry.update({ jumlah: existingEntry.jumlah + item.jumlah, totalHarga: existingEntry.totalHarga + totalHarga });
            } else {
                // Jika entri belum ada, buat entri baru
                await TransaksiProduk.create({
                    id_alamat: alamat.id,
                    user_id: userId,
                    id_transaksi: newTransaksi.id,
                    id_produk: produkItem.id,
                    id_subvariasi: subVariasiItem ? subVariasiItem.id : null,
                    id_variasi: subVariasiItem ? subVariasiItem.id_variasi : null,
                    jumlah: item.jumlah,
                    totalHarga
                });
            }

            await produkItem.update({ jumlah: produkItem.jumlah - item.jumlah });
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
    const userId = req.user.id;

    try {
        const transaksi = await Transaksi.findByPk(transaksiId, {
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
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        const produkDetails = transaksi.produks.map(item => ({
            id: item.id,
            nama_produk: item.judul_produk,
            harga: item.harga,
            jumlah: item.transaksi_produk.jumlah,
            nama_variasi: item.variasis ? item.variasis.nama_variasi : null,
            nama_sub_variasi: item.subVariasis ? item.subVariasis.nama_sub_variasi : null,
            usia: item.subVariasis ? item.subVariasis.usia : null
        }));

        const response = {
            id: transaksi.id,
            user: {
                id: transaksi.User.id,
                username: transaksi.User.username
            },
            produk: produkDetails,
            alamat: transaksi.alamat,
            sub_total: transaksi.sub_total,
            biaya_layanan: transaksi.biaya_layanan,
            total_pembayaran: transaksi.total_pembayaran
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getTransaksiFilter = async (req, res) => {
    const { status } = req.query;

    try {
        const whereClause = status ? { status } : {};

        const transaksi = await Transaksi.findAll({
            where: whereClause,
            include: [
                {
                    model: Produk,
                    through: { attributes: ['jumlah', 'totalHarga'] },
                    attributes: ['id', 'judul_produk', 'harga'],
                    include: [
                        {
                            model: Variasi,
                            as: 'variasis', // Pastikan menggunakan alias yang sesuai
                            attributes: ['nama_variasi']
                        },
                        {
                            model: subVariasi,
                            as: 'subvariasis', // Pastikan menggunakan alias yang sesuai
                            attributes: ['nama_sub_variasi', 'usia']
                        }
                    ]
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
        });

        if (!transaksi || transaksi.length === 0) {
            return res.status(404).json({ message: 'Tidak ada transaksi yang ditemukan' });
        }

        const response = transaksi.map(transaksiItem => {
            const produkDetails = transaksiItem.Produks ? transaksiItem.Produks.map(item => ({
                id: item.id,
                nama_produk: item.judul_produk,
                harga: item.harga,
                jumlah: item.TransaksiProduk.jumlah,
                totalHarga: item.TransaksiProduk.totalHarga,
                variasiItem: item.variasis ? { id: item.variasis.id, nama_variasi: item.variasis.nama_variasi } : null,
                sub_variasi: item.subvariasis ? {
                    id_subvariasi: item.subvariasis.id,
                    ukuran_pot: item.subvariasis.nama_sub_variasi,
                    usia: item.subvariasis.usia
                } : null
            })) : [];

            return {
                id: transaksiItem.id,
                user: {
                    id: transaksiItem.User.id,
                    username: transaksiItem.User.username
                },
                produk: produkDetails,
                alamat: transaksiItem.alamat,
                sub_total: transaksiItem.sub_total,
                biaya_layanan: transaksiItem.biaya_layanan,
                total_pembayaran: transaksiItem.total_pembayaran
            };
        });

        res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
}

const getTransaksiDikirimDanDikemas = async (req, res) => {
    try {
       const status = ['dikemas', 'dikirim']
        const TransaksiStatus = await TransaksiProduk.findAll({
            where: {
                status: {
                    [Op.in]: status 
                }
            },
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}
  
const troliProduk = async (req, res) => {
  const { id_produk, id_subVariasi, jumlahStok } = req.body;
  const id_User = req.user.id;

  try {
    const userid = await User.findByPk(id_User);
    if (!userid) {
      return res.status(400).json({ message: 'User tidak ditemukan' });
    }

    const alamat = await Alamat.findOne({ where: { userId: id_User } });

    const produk = await Produk.findByPk(id_produk);
    if (!produk) {
      return res.status(400).json({ message: 'Produk tidak ditemukan' });
    }

    const subvariasi = await subVariasi.findByPk(id_subVariasi);
    if (!subvariasi) {
      return res.status(400).json({ message: 'Sub Variasi tidak ditemukan' });
    }

    const variasi = subvariasi.id_variasi;

    const troliProduk = await Troli.findOne({ where: { id_User: id_User, id_produk: id_produk, id_subVariasi: id_subVariasi } });

    if (!troliProduk) {
      const troli = await Troli.create({
        id_User: id_User,
        id_produk,
        id_alamat: alamat.id,
        id_variasi: variasi,
        id_subVariasi,
        jumlahStok: jumlahStok
      });

      return res.status(200).json(troli);
    }

    const jumlahBaru = troliProduk.jumlahStok + jumlahStok;

    await Troli.update({
      jumlahStok: jumlahBaru
    }, {
      where: { id: troliProduk.id }
    });

    const TroliUpdate = await Troli.findByPk(troliProduk.id);

    res.status(202).json(TroliUpdate);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    createTransaksi,
    troliProduk,
    // getAllTransaksi,
    getTransaksiById,
    getTransaksiFilter,
    getTransaksiDikirimDanDikemas
};

module.exports = { createTransaksi, getAllTransaksi, getTransaksiById, getTransaksiFilter };

