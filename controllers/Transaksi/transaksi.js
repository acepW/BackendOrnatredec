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
    const userId = req.user.id; // Mengambil userId dari req.user yang diisi oleh middleware protect

    try {
        const user = await User.findByPk(userId); // Ambil data user berdasarkan ID
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
            user_id: userId, // Menambahkan user_id secara otomatis
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
                                as: 'subvariasis'
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

            const itemSubTotal = produkItem.harga * item.jumlah;
            subTotal += itemSubTotal;

            const variasi = produkItem.variasis && produkItem.variasis.length > 0 ? produkItem.variasis[0] : null;
            const subVariasiItem = variasi && variasi.subvariasis && variasi.subvariasis.length > 0 ? variasi.subvariasis[0] : null;

            const variasiDetails = {
                id_variasi: variasi ? variasi.id : null,
                nama_variasi: variasi ? variasi.nama_variasi : null,
                sub_variasi: subVariasiItem ? {
                    id_sub_variasi: subVariasiItem.id,
                    nama_sub_variasi: subVariasiItem.nama_sub_variasi
                } : null
            };

            produkDetails.push({
                id: produkItem.id,
                nama_produk: produkItem.judul_produk,
                harga: produkItem.harga,
                jumlah: item.jumlah,
                variasi: variasiDetails
            });

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
                    id_transaksi: newTransaksi.id,
                    id_produk: produkItem.id,
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
                id: user.id, // Menampilkan user_id
                username: user.username // Menampilkan username
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
                    model: User, // Tambahkan User ke dalam include
                    attributes: ['id', 'username'] // Hanya ambil id dan username
                }
            ]
        });

        const response = transaksi.map(transaksiItem => ({
            id: transaksiItem.id,
            user: {
                id: transaksiItem.user.id, // Menampilkan user_id
                username: transaksiItem.user.username // Menampilkan username
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

        res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const getTransaksiById = async (req, res) => {
    try {
        const transaksiId = req.params.id;

        const transaksi = await Transaksi.findOne({
            where: { id: transaksiId },
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
                    model: User, // Tambahkan User ke dalam include
                    attributes: ['id', 'username'] // Hanya ambil id dan username
                }
            ]
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        const response = {
            id: transaksi.id,
            user: {
                id: transaksi.user.id, // Menampilkan user_id
                username: transaksi.user.username // Menampilkan username
            },
            produk: transaksi.produks.map(item => ({
                id: item.id,
                nama_produk: item.judul_produk,
                harga: item.harga,
                jumlah: item.transaksi_produk.jumlah
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

module.exports = {
    createTransaksi,
    getAllTransaksi,
    getTransaksiById
};
