const path = require('path');
const transaksi_produk = require('../../models/Transaksi/transaksiproduk'); // Import model transaksi_produk
const Produk = require('../../models/Produk/produk'); // Import model Produk jika diperlukan

// Mengubah status pesanan
const updateOrderStatus = async (req, res) => {
    const { id } = req.params; // ID pesanan yang ingin diubah
    const { status } = req.body; // Status baru yang dikirim dari request body

    try {
        // Validasi status
        const validStatuses = ['dipesan', 'dikemas', 'sedang diantar', 'selesai'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Status tidak valid' });
        }

        // Cari pesanan berdasarkan ID
        const order = await transaksi_produk.findByPk(id);

        if (!order) {
            return res.status(406).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Ubah status pesanan
        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Status pesanan berhasil diperbarui', order });
    } catch (error) {
        console.error('Error updating order status:', error); // Log error yang lebih spesifik
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status pesanan', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await transaksi_produk.findAll({
            where: { status: 'dipesan' },
            include: [{
                model: Produk, // Include model Produk untuk mengambil detail produk terkait
            }]
        });

        console.log("Orders found:", orders); // Debugging log

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Tidak ada pesanan yang berstatus "dipesan"' });
        }

        // Ubah status semua pesanan dari "dipesan" ke "dikemas"
        for (let order of orders) {
            order.status = 'dikemas';
            await order.save();
            console.log("transaksi_produk updated:", order); // Debugging log
        }

        // Ambil ulang semua pesanan setelah update status
        const updatedOrders = await transaksi_produk.findAll({
            include: [{
                model: Produk, // Mengambil produk terkait
            }]
        });

        res.status(200).json(updatedOrders);
    } catch (error) {
        console.error('Error fetching or updating orders:', error); // Log error yang lebih spesifik
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil atau memperbarui pesanan', error: error.message });
    }
};

// Fungsi untuk mengambil satu pesanan berdasarkan ID dan mengubah statusnya jika diperlukan
const getOrderById = async (req, res) => {
    const { id } = req.params; // Mendapatkan id_transaksi dari parameter URL

    try {
        // Cari pesanan berdasarkan id_transaksi
        const Order = await transaksi_produk.findByPk(id, {
            include: [{
                model: Produk, // Include model Produk untuk mendapatkan detail produk terkait
            }]
        });

        if (!Order) {
            return res.status(405).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Jika status pesanan adalah 'dipesan', ubah menjadi 'dikemas'
        if (order.status === 'dipesan') {
            order.status = 'dikemas';
            await order.save(); // Simpan perubahan ke database
            console.log("Pesanan telah diperbarui:", order);
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching or updating the order:', error); // Log error yang lebih spesifik
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil atau memperbarui pesanan', error: error.message });
    }
};

// Ekspor semua fungsi
module.exports = {
    updateOrderStatus,
    getAllOrders,
    getOrderById
};
