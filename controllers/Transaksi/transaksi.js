const Transaksi = require('../../models/Transaksi/transaksi');
const Produk = require('../../models/Produk/produk');
const Alamat = require('../../models/Transaksi/alamat');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk'); // Jika menggunakan tabel pivot
const User = require('../../models/User/users');

const BIAYA_LAYANAN = 5000;

const createTransaksi = async (req, res) => {
    const { produk } = req.body;
    const userId = req.user.id;

    try {
        console.log("Request body:", req.body);

        // Ambil data alamat berdasarkan ID
        const alamat = await Alamat.findOne({where : {userId : userId}});
        const idAlamat = alamat.id
        if (!alamat) {
            console.log("Alamat tidak ditemukan");
            return res.status(404).json({ message: 'Alamat tidak ditemukan' });
        }

        let subTotal = 0;
        const produkDetails = [];

        // Buat transaksi baru
        const newTransaksi = await Transaksi.create({
            id_alamat : idAlamat,
            sub_total: 0, // Ini akan diperbarui setelah produk diproses
            biaya_layanan: BIAYA_LAYANAN,
            total_pembayaran: 0 // Ini akan diperbarui setelah produk diproses
        });

        // Validasi dan proses produk
        for (const item of produk) {
            const produkItem = await Produk.findByPk(item.id_produk);
            if (!produkItem) {
                console.log(`Produk dengan ID ${item.id_produk} tidak ditemukan`);
                return res.status(404).json({ message: `Produk dengan ID ${item.id_produk} tidak ditemukan` });
            }

            // Cek apakah stok cukup
            if (produkItem.stok < item.jumlah) {
                console.log(`Stok tidak cukup untuk produk dengan ID ${item.id_produk}`);
                return res.status(400).json({ message: `Stok tidak cukup untuk produk dengan ID ${item.id_produk}` });
            }

            const itemSubTotal = produkItem.harga * item.jumlah;
            subTotal += itemSubTotal;
            produkDetails.push({
                id: produkItem.id,
                nama_produk: produkItem.nama_produk,
                harga: produkItem.harga,
                jumlah: item.jumlah
            });

            // Kurangi stok produk
            await produkItem.update({ stok: produkItem.stok - item.jumlah });

            // Insert ke tabel pivot jika menggunakan tabel pivot
            await TransaksiProduk.create({
                id_transaksi: newTransaksi.id,
                id_produk: produkItem.id,
                jumlah: item.jumlah
            });
        }

        // Hitung total pembayaran
        const totalPembayaran = subTotal + BIAYA_LAYANAN;

        // Perbarui transaksi dengan sub_total dan total_pembayaran yang benar
        await newTransaksi.update({
            sub_total: subTotal,
            total_pembayaran: totalPembayaran
        });

        // Format response
        const response = {
            id: newTransaksi.id,
            produk: produkDetails,
            alamat: {
                id: alamat.id,
                provinsi: alamat.provinsi,
                kota_kabupaten: alamat.kota_kabupaten,
                kecamatan: alamat.kecamatan,
                kelurahan_desa: alamat.kelurahan_desa,
                jalan_namagedung: alamat.jalan_namagedung,
                rtrw: alamat.rtrw,
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
        res.status(500).json({ message : error.message});
    }
};

const getAllTransaksi = async (req, res) => {
    try {
        // Query untuk mendapatkan semua transaksi
        const transaksi = await Transaksi.findAll({
            include: [
                {
                    model: Produk, // Join dengan tabel produk
                    through: { attributes: ['jumlah'] }, // Mengambil jumlah dari tabel pivot
                    attributes: ['id', 'judul_produk', 'harga'] // Hanya ambil field yang dibutuhkan
                },
                {
                    model: Alamat, // Join dengan tabel alamat
                    attributes: ['provinsi', 'kota_kabupaten', 'kecamatan', 'kelurahan_desa', 'jalan_namagedung', 'rtrw', 'patokan', 'nama_penerima', 'no_hp', 'kategori_alamat', 'alamat_pengiriman_utama'],
                    include : [
                       { model : User, attributes : ['username', 'email'] }
                    ]
                },
            ]
        });

        // Format response untuk semua transaksi
        const response = transaksi.map(transaksiItem => ({
            id: transaksiItem.id,
            produk: transaksiItem.produks.map(item => ({
                id: item.id,
                nama_produk: item.nama_produk,
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
        res.status(500).json({ message : error.message });
    }
};

const getTransaksiById = async (req, res) => {
    try {
        const transaksiId = req.params.id;

        // Query untuk mendapatkan data transaksi berdasarkan ID
        const transaksi = await Transaksi.findOne({
            where: { id: transaksiId },
            include: [
                {
                    model: Produk, // Join dengan tabel produk
                    through: { attributes: ['jumlah'] }, // Mengambil jumlah dari tabel pivot
                    attributes: ['id', 'nama_produk', 'harga'] // Hanya ambil field yang dibutuhkan
                },
                {
                    model: Alamat, // Join dengan tabel alamat
                    attributes: ['provinsi', 'kota_kabupaten', 'kecamatan', 'kelurahan_desa', 'jalan_namagedung', 'unit_lantai', 'patokan', 'nama_penerima', 'no_hp', 'kategori_alamat', 'alamat_pengiriman_utama']
                },
            ]
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        // Format response
        const response = {
            id: transaksi.id,
            produk: transaksi.produks.map(item => ({
                id: item.id,
                nama_produk: item.nama_produk,
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
        res.status(500).json({message : error.message});
    }
};

module.exports = {
    createTransaksi,
    getAllTransaksi,
    getTransaksiById
};
