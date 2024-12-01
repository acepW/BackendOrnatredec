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
    const { id_transaksi, payment_method } = req.body;

    try {
        const transaksi = await Transaksi.findByPk(id_transaksi)

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        const generatedOrderId = `transaksi-${transaksi.id}-${Date.now()}`;

        // Payload yang dikirim ke Midtrans untuk mendapatkan token pembayaran
        const payload = {
            transaction_details: {
                order_id: generatedOrderId,
                gross_amount: transaksi.total_pembayaran,
            },
            customer_details: {
                first_name: 'Nama',
                email: 'email@example.com',
            },
            // item_details: (transaksi.produk || []).map(item => ({
            //     id: item.id.toString(),
            //     price: item.harga,
            //     quantity: item.jumlah,
            //     name: item.nama_produk,
            // })),
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

        // Kirim token ke frontend untuk Snap Popup
        res.status(200).json({
            message: 'Payment created successfully',
            token: token,
            order_id: order_id || generatedOrderId,
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
        const transaksi = await Transaksi.findByPk(id_transaksi, {
            include: [
                {
                    model: TransaksiProduk,
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

        // Pastikan user dan alamat valid (opsional, jika alamat digunakan)
        const user = await User.findByPk(transaksi.user_id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Logika pengurangan stok
        for (const item of transaksi.TransaksiProduks) {
            const produk = await Produk.findByPk(item.id_produk);
            const subVariasi = await subVariasi.findByPk(item.id_subvariasi);

            // Validasi stok produk
            if (!produk || produk.jumlah < item.jumlah) {
                return res.status(400).json({
                    message: `Stok produk dengan ID ${item.id_produk} tidak cukup`,
                });
            }

            // Validasi stok sub-variasi (jika ada)
            if (subVariasi && subVariasi.stok < item.jumlah) {
                return res.status(400).json({
                    message: `Stok sub-variasi dengan ID ${item.id_subvariasi} tidak cukup`,
                });
            }

            // Kurangi stok produk dan sub-variasi
            await Promise.all([
                produk.update({ jumlah: produk.jumlah - item.jumlah }),
                subVariasi && subVariasi.update({ stok: subVariasi.stok - item.jumlah }),
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
