const PaymentGateway = require('../../models/Transaksi/paymentgateway');
const Transaksi = require('../../models/Transaksi/transaksi');
const Produk = require("../../models/Produk/produk");
const Variasi = require("../../models/Produk/variasi");
const subVariasi = require("../../models/Produk/subVariasi");
const axios = require('axios');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk');
const User = require('../../models/User/users');
const Alamat = require('../../models/Transaksi/alamat');
require('dotenv').config();

const MIDTRANS_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions'; // Endpoint Snap Midtrans
// const MIDTRANS_STATUS_URL = 'https://api.sandbox.midtrans.com/v2'; // Base URL for Midtrans status
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY; // Ambil dari .env

// Membuat transaksi pembayaran dan mendapatkan token dari Midtrans
const createPaymentGateway = async (req, res) => {
    const { produk, metode_transaksi, payment_method } = req.body;
    const userId = req.user.id;
    try {
        const BIAYA_LAYANAN = 2500;

        // Validasi user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Validasi produk
        if (!Array.isArray(produk)) {
            return res.status(400).json({ message: 'Produk harus berupa array' });
        }

        // Membuat transaksi baru
        const newTransaksi = await Transaksi.create({
            user_id: userId,
            sub_total: 0,
            biaya_layanan: BIAYA_LAYANAN,
            total_pembayaran: 0,
            metode_transaksi,
        });

        let subTotal = 0;
        const produkDetails = [];

        // Mengolah data produk
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
                                where: { id: item.id_subvariasi },
                            },
                        ],
                    },
                ],
            });

            if (!produkItem) {
                return res.status(404).json({ message: `Produk dengan ID ${item.id_produk} tidak ditemukan` });
            }

            // Mengambil harga subvariasi
            const subVariasiItem = produkItem.variasis[0]?.subvariasis.find((sv) => sv.id === item.id_subvariasi);
            const hargaSubVariasi = subVariasiItem ? subVariasiItem.harga : 0;

            // Menghitung subtotal item
            const itemSubTotal = (produkItem.harga + hargaSubVariasi) * item.jumlah;

            subTotal += itemSubTotal;

            // Menyimpan detail produk
            produkDetails.push({
                id: produkItem.id,
                nama_produk: produkItem.judul_produk,
                harga: produkItem.harga + hargaSubVariasi,
                jumlah: item.jumlah,
                sub_variasi: subVariasiItem,
            });

            // Menyimpan data ke tabel TransaksiProduk
            await TransaksiProduk.create({
                id_transaksi: newTransaksi.id,
                user_id: userId,
                id_produk: produkItem.id,
                id_subvariasi: subVariasiItem ? subVariasiItem.id : null,
                jumlah: item.jumlah,
                totalHarga: itemSubTotal,
                id_variasi: subVariasiItem ? subVariasiItem.id_variasi : null,
            });
        }

        // Menghitung total pembayaran
        const totalPembayaran = subTotal + BIAYA_LAYANAN;
        await newTransaksi.update({ sub_total: subTotal, total_pembayaran: totalPembayaran });

        // Membuat order ID untuk Midtrans
        const generatedOrderId = `transaksi-${newTransaksi.id}-${Date.now()}`;

        // Payload untuk Midtrans
        const payload = {
            transaction_details: {
                order_id: generatedOrderId,
                gross_amount: newTransaksi.total_pembayaran,
            },
            customer_details: {
                first_name: 'Nama',
                email: 'email@example.com',
            },
            enabled_payments: [payment_method],
        };

        // Mengirim request ke Midtrans
        const response = await axios.post(MIDTRANS_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(SERVER_KEY + ':').toString('base64')}`,
            },
        });

        const { token, order_id } = response.data;

        // Mengembalikan respons ke frontend
        res.status(200).json({
            message: 'Payment created successfully',
            token: token,
            order_id: order_id || generatedOrderId,
            id: newTransaksi.id,
            user: { id: user.id, username: user.username },
            produk: produkDetails,
            sub_total: subTotal,
            biaya_layanan: BIAYA_LAYANAN,
            total_pembayaran: totalPembayaran,
        });
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.response ? error.response.data : error.message });
    }
};

// Endpoint untuk menyimpan data pembayaran setelah berhasil
const savePaymentData = async (req, res) => {
    const { order_id, id_transaksi, payment_method, token } = req.body;

    try {
        // Ambil transaksi berdasarkan id_transaksi
        const transaksi = await Transaksi.findByPk(id_transaksi, {
            include: [
                {
                    model: TransaksiProduk,
                    as: 'TransaksiProduks',
                    include: [
                        {
                            model: Produk,
                            as: 'produk',
                            include: [
                                {
                                    model: Variasi,
                                    as: 'variasis',
                                    include: [
                                        { model: subVariasi, as: 'subvariasis' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        // Pastikan user valid
        const user = await User.findByPk(transaksi.user_id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Logika pengurangan stok
        for (const item of transaksi.TransaksiProduks) {
            const produk = await Produk.findByPk(item.id_produk);
            let subvariasi = null;

            // Ambil subVariasi jika ada
            if (item.id_subvariasi) {
                subvariasi = await subVariasi.findByPk(item.id_subvariasi);
            }

            // Validasi stok produk
            if (!produk || produk.jumlahProduk < item.jumlah) {
                return res.status(400).json({
                    message: `Stok produk dengan ID ${item.id_produk} tidak cukup`,
                });
            }

            // Validasi stok sub-variasi (jika ada)
            if (subvariasi && subvariasi.stok < item.jumlah) {
                return res.status(400).json({
                    message: `Stok sub-variasi dengan ID ${item.id_subvariasi} tidak cukup`,
                });
            }

            // Kurangi stok produk dan sub-variasi
            await Promise.all([
                produk.update({ jumlahProduk: produk.jumlahProduk - item.jumlah }),
                subvariasi
                    ? subvariasi.update({ stok: subvariasi.stok - item.jumlah })
                    : null,
            ]);
        }

        // Simpan data ke PaymentGateway
        await PaymentGateway.create({
            id_transaksi,
            order_id,
            payment_method,
            token,
            status: 'success', // Set status sukses
        });

        // Update transaksi dengan metode pembayaran
        await Transaksi.update(
            { payment_method: payment_method },
            { where: { id: id_transaksi } }
        );

        res.status(200).json({ message: 'Payment data saved successfully, stock updated' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = {
    createPaymentGateway,
    savePaymentData, // Tambahkan ini
};
