const PaymentGateway = require('../../models/Transaksi/paymentgateway');
const Transaksi = require('../../models/Transaksi/transaksi');
const Produk = require("../../models/Produk/produk");
const axios = require('axios');
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
        await PaymentGateway.create({
            id_transaksi,
            order_id,
            payment_method,
            token,
            status: 'success' // Atur status sebagai 'success'
        });
        res.status(200).json({ message: 'Payment data saved successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = {
    createPaymentGateway,
    savePaymentData, // Tambahkan ini
};
