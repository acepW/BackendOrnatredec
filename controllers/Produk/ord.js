// Import model pesanan (Order) dan model terkait
const Order = require('../../models/Transaksi/transaksiproduk');
const Produk = require('../../models/Produk/produk');
const Variasi = require('../../models/Produk/variasi');
const Subvariasi = require("../../models/Produk/subVariasi");

// Mendapatkan semua pesanan dan mengubah status dari "dipesan" ke "dikemas"
const getAllOrders = async (req, res) => {
    try {
        // Cari semua pesanan yang masih berstatus "dipesan"
        const orders = await Order.findAll({
            where: { status: 'dipesan' },
            include: [{
                model: Produk,
                as: 'produks', // Menggunakan alias yang benar
                include: [{
                    model: Variasi,
                    as: 'variasis', // Alias untuk Variasi
                    include: [{
                        model: Subvariasi,
                        as: 'subvariasis' // Alias untuk Subvariasi
                    }]
                }]
            }]
        });

        // Jika tidak ada pesanan berstatus "dipesan"
        if (orders.length === 0) {
            return res.status(200).json({ message: 'Tidak ada pesanan yang berstatus "dipesan"' });
        }

        // Ubah status semua pesanan dari "dipesan" ke "dikemas"
        for (let order of orders) {
            order.status = 'dikemas';
            await order.save();
        }

        // Ambil ulang semua pesanan setelah update status
        const updatedOrders = await Order.findAll({
            include: [{
                model: Produk,
                as: 'produks', // Alias sesuai dengan model
                include: [{
                    model: Variasi,
                    as: 'variasis', // Alias sesuai dengan model Variasi
                    include: [{
                        model: Subvariasi,
                        as: 'subvariasis' // Alias sesuai dengan model Subvariasi
                    }]
                }]
            }]
        });

        // Kirim respons dengan data pesanan yang sudah diperbarui
        res.status(200).json(updatedOrders);
    } catch (error) {
        console.error('Caught error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message || error });
    }
};

// Mendapatkan pesanan berdasarkan ID, dan mengubah status dari "dipesan" ke "dikemas"
const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari pesanan berdasarkan ID
        const order = await Order.findByPk(id, {
            include: [{
                model: Produk,
                as: 'produks', // Alias sesuai dengan model
                include: [{
                    model: Variasi,
                    as: 'variasis', // Alias sesuai dengan model Variasi
                    include: [{
                        model: Subvariasi,
                        as: 'subvariasis' // Alias sesuai dengan model Subvariasi
                    }]
                }]
            }]
        });

        // Jika pesanan tidak ditemukan
        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Ubah status jika pesanan masih "dipesan"
        if (order.status === 'dipesan') {
            order.status = 'dikemas';
            await order.save();
        }

        // Kirim respons dengan detail pesanan
        res.status(200).json(order);
    } catch (error) {
        console.error('Caught error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message || error });
    }
};

// Ekspor semua fungsi controller
module.exports = {
    getAllOrders,
    getOrderById
};
