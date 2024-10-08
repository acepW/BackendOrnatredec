const PaymentGateway = require('../../models/Transaksi/paymentgateway');
const Transaksi = require('../../models/Transaksi/transaksi');
const Produk = require("../../models/Produk/produk");
const axios = require('axios');
require('dotenv').config();

const MIDTRANS_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions'; // Endpoint Snap Midtrans
const MIDTRANS_STATUS_URL = 'https://api.sandbox.midtrans.com/v2'; // Base URL for Midtrans status
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY; // Ambil dari .env

const createPaymentGateway = async (req, res) => {
    const { id_transaksi, payment_method } = req.body;

    try {
        const transaksi = await Transaksi.findByPk(id_transaksi, {
            include: [{ model: Produk }]
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        const generatedOrderId = `transaksi-${transaksi.id}-${Date.now()}`;

        const payload = {
            transaction_details: {
                order_id: generatedOrderId,
                gross_amount: transaksi.total_pembayaran,
            },
            customer_details: {
                first_name: 'Nama',
                email: 'email@example.com',
            },
            item_details: (transaksi.produk || []).map(item => ({
                id: item.id.toString(),
                price: item.harga,
                quantity: item.jumlah,
                name: item.nama_produk,
            })),
            enabled_payments: [payment_method],
        };

        const response = await axios.post(MIDTRANS_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(SERVER_KEY + ':').toString('base64')}`,
            },
        });

        console.log("Full Midtrans Response:", JSON.stringify(response.data, null, 2));

        const { token, redirect_url, order_id } = response.data;

        // Simpan informasi pembayaran di database
        const paymentData = await PaymentGateway.create({
            id_transaksi: transaksi.id,
            order_id: order_id || generatedOrderId,
            payment_url: redirect_url,
            payment_method: payment_method,
            token: token,
            status: 'pending', // Set status awal sebagai 'pending' sebelum memeriksa status selanjutnya
        });

        console.log(paymentData);
        

        res.status(200).json({
            message: 'Payment created successfully',
<<<<<<< HEAD
            payment_url: paymentData.payment_url, // URL untuk redirect ke Snap Midtrans
            status : paymentData.status
=======
            payment_url: paymentData.payment_url,
            order_id: paymentData.order_id,
            transaction_status: paymentData.status
>>>>>>> 43f1071696821ce1623125516a4bf9846078e911
        });
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.response ? error.response.data : error.message });
    }
};

const checkPaymentStatus = async (req, res) => {
    const { order_id } = req.params;

    try {
        // Cek status transaksi di Midtrans
        const response = await axios.get(`${MIDTRANS_STATUS_URL}/${order_id}/status`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(SERVER_KEY + ':').toString('base64')}`,
            },
        });

        const status = response.data.transaction_status;

        // Update status transaksi di database
        await PaymentGateway.update({ status: status }, {
            where: { order_id: order_id }
        });

        res.status(200).json({ status });
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.response ? error.response.data : error.message });
    }
};

module.exports = {
    createPaymentGateway,
    checkPaymentStatus
};