
const Order = require('../../models/Transaksi/transaksiproduk');

const getAllOrders = async (req, res) => {
    try {
        // Cari semua pesanan yang masih berstatus "dipesan"
        const orders = await Order.findAll({
            where: { status: 'dipesan' },
            include: [{
                model: Order,
                through: { attributes: [] } // Mengambil produk tanpa atribut tambahan dari tabel pivot
            }]
        });

        if (orders.length === 0) {
            return res.status(200).json({ message: 'Tidak ada pesanan yang berstatus "dipesan"' });
        }

        // Ubah status pesanan menjadi "dikemas"
        for (let order of orders) {
            order.status = 'dikemas';
            await order.save();
        }

        // Ambil ulang semua pesanan dengan status yang sudah diperbarui
        const updatedOrders = await Order.findAll({
            include: [{
                model: Order,
                through: { attributes: [] } // Mengambil produk terkait
            }]
        });

        res.status(200).json(updatedOrders);
    } catch (error) {
        console.error('Error details:', error); // Cetak detail error ke console

        // Jika error memiliki properti `message`, gunakan itu, jika tidak, gunakan 'Unknown error'
        const errorMessage = error.message || 'Unknown error';

        res.status(500).json({ message: 'Te kesalahan', error: errorMessage });
    }
};


// Mendapatkan pesanan berdasarkan ID, dan mengubah status dari "dipesan" ke "dikemas"
const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id, {
            include: [{
                model: Order,
                through: { attributes: [] } // Mengambil produk terkait
            }]
        });

        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Ubah status jika "dipesan"
        if (order.status === 'dipesan') {
            order.status = 'dikemas';
            await order.save();
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error });
    }
};

// Ekspor semua fungsi
module.exports = {
    
    getAllOrders,
    getOrderById
};