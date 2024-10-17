const Transaksi = require('../../models/Transaksi/transaksi');
const Produk = require('../../models/Produk/produk');
const Alamat = require('../../models/Transaksi/alamat');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk');
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
                                where: { id: item.id_subvariasi }
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
            const hargaSubVariasi = subVariasiItem ? subVariasiItem.harga : 0;

            const itemSubTotal = (produkItem.harga + hargaSubVariasi) * item.jumlah;
            subTotal += itemSubTotal;

            if (subVariasiItem) {
                await subVariasi.update({ stok: subVariasiItem.stok - item.jumlah }, { where: { id: subVariasiItem.id } });
            }

            produkDetails.push({
                id: produkItem.id,
                nama_produk: produkItem.judul_produk,
                harga: produkItem.harga + hargaSubVariasi, // Harga final dengan subvariasi
                jumlah: item.jumlah,
                sub_variasi: {
                    id_subvariasi: subVariasiItem ? subVariasiItem.id : null,
                    ukuran_pot: subVariasiItem ? subVariasiItem.nama_sub_variasi : null,
                    usia: subVariasiItem ? subVariasiItem.usia : null,
                }
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
                    jumlah: item.jumlah,
                    totalHarga: itemSubTotal // Menyimpan total harga
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

const getAllTransaksi = async (req, res) => {
    try {
        const transaksi = await Transaksi.findAll({
            include: [
                {
                    model: Produk,
                    through: { attributes: ['jumlah', 'totalHarga'] }, // Ambil totalHarga dari pivot table
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
                totalHarga: item.transaksi_produk.totalHarga // Tampilkan total harga per produk
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
        const { id } = req.params; // ambil id dari parameter URL

        const transaksiData = await Transaksi.findOne({
            where: { id: id },
            include: [
                {
                    model: Produk,
                    as: 'produks', // gunakan alias yang sesuai
                    through: {
                        attributes: ['jumlah', 'totalHarga'], // ambil kolom dari tabel perantara
                    },
                    include: [
                        {
                            model: Variasi,
                            as: 'variasis', // pastikan alias sesuai dengan yang didefinisikan
                            attributes: ['id', 'nama_variation'] // ambil kolom yang valid
                        }
                    ]
                },
                {
                    model: Alamat,
                    as: 'alamat', // pastikan alias sesuai
                    attributes: ['id', 'provinsi', 'kota_kabupaten', 'kecamatan', 'kelurahan_desa', 'jalan_namagedung', 'patokan', 'nama_penerima', 'no_hp', 'kategori_alamat', 'alamat_pengiriman_utama'] // ambil kolom yang valid
                }
            ]
        });

        if (!transaksiData) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        return res.status(200).json(transaksiData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data transaksi' });
    }
};

module.exports = {
    createTransaksi,
    getAllTransaksi,
    getTransaksiById
};
