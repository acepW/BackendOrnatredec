const PaymentGateway = require('../../models/Transaksi/paymentgateway');
const Transaksi = require('../../models/Transaksi/transaksi');
const Produk = require("../../models/Produk/produk");
const axios = require('axios');
require('dotenv').config();

const MIDTRANS_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions'; // Endpoint Snap Midtrans
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY; // Ambil dari .env

const createPaymentGateway = async (req, res) => {
    const { id_transaksi, payment_method } = req.body; // Tangkap metode pembayaran dari frontend

    try {
        // Ambil data transaksi berdasarkan ID
        const transaksi = await Transaksi.findByPk(id_transaksi, {
            include: [{ model: Produk }] // Pastikan untuk meng-include model Produk
        });
        
        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        // Siapkan data untuk dikirim ke Midtrans
        const payload = {
            transaction_details: {
                order_id: `transaksi-${transaksi.id}-${Date.now()}`, // Order ID unik
                gross_amount: transaksi.total_pembayaran,
            },
            customer_details: {
                first_name: 'Nama', // Dapatkan dari user terkait
                email: 'email@example.com', // Dapatkan dari user terkait
            },
            item_details: (transaksi.produk || []).map(item => ({
                id: item.id.toString(),
                price: item.harga,
                quantity: item.jumlah,
                name: item.nama_produk,
            })),
            enabled_payments: [payment_method], // Gunakan hanya metode pembayaran yang dipilih
        };

        // Kirim request ke Midtrans
        const response = await axios.post(MIDTRANS_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(SERVER_KEY + ':').toString('base64')}`,
            },
        });

        // Simpan informasi pembayaran di database
        const paymentData = await PaymentGateway.create({
            id_transaksi: transaksi.id,
            order_id: response.data.order_id, // Simpan order_id
            payment_url: response.data.redirect_url, // URL untuk Snap popup
            payment_method: payment_method, // Simpan metode pembayaran yang dipilih
            status: response.data.transaction_status, // Ambil status dari response Midtrans
        });

        console.log(paymentData);
        

        res.status(200).json({
            message: 'Payment created successfully',
            payment_url: paymentData.payment_url, // URL untuk redirect ke Snap Midtrans
            status : paymentData.status
        });
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.response ? error.response.data : error.message });
    }
};

module.exports = {
    createPaymentGateway,
};
