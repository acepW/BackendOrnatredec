// Import model pesanan (Order)
const Order = require('../../models/Transaksi/transaksiproduk');

// Mendapatkan semua pesanan dan mengubah status dari "dipesan" ke "dikemas"
const getAllOrders = async (req, res) => {
    console.log("Function getAllOrders is called"); // Debugging log
    try {
        // Cari semua pesanan yang masih berstatus "dipesan"
        const orders = await Order.findAll({
            where: { status: 'dipesan' },
            include: [{
                model: Order, // Jika ada relasi produk, pastikan model ini sudah di-define di model Order
                through: { attributes: [] } // Mengambil produk tanpa atribut tambahan dari tabel pivot
            }]
        });

        console.log("Orders found:", orders); // Debugging log

//         // Jika tidak ada pesanan berstatus "dipesan"
//         if (orders.length === 0) {
//             return res.status(200).json({ message: 'Tidak ada pesanan yang berstatus "dipesan"' });
//         }

        // Ubah status semua pesanan dari "dipesan" ke "dikemas"
        for (let order of orders) {
            order.status = 'dikemas';
            await order.save();
            console.log("Order updated:", order); // Debugging log
        }

        // Ambil ulang semua pesanan setelah update status
        const updatedOrders = await Order.findAll({
            include: [{
                model: Order, // Mengambil produk terkait
                through: { attributes: [] } 
            }]
        });

        // Kirim respons dengan data pesanan yang sudah diperbarui
        res.status(200).json(updatedOrders);
    } catch (error) {
        console.error('Caught error:', error); // Debugging log
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message || error });
    }
};

// // Mendapatkan pesanan berdasarkan ID, dan mengubah status dari "dipesan" ke "dikemas"
// const getOrderById = async (req, res) => {
//     const { id } = req.params;

    try {
        // Cari pesanan berdasarkan ID
        const order = await Order.findByPk(id, {
            include: [{
                model: Order, // Mengambil produk terkait
                through: { attributes: [] }
            }]
        });

        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Ubah status jika "dipesan"
        if (order.status === 'dipesan') {
            order.status = 'dikemas';
            await order.save();
            console.log("Order updated:", order); // Debugging log
        }

        // Kirim respons dengan detail pesanan
        res.status(200).json(order);
    } catch (error) {
        console.error('Caught error:', error); // Debugging log
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message || error });
    }
};

// Ekspor semua fungsi
module.exports = {
    getAllOrders,
    getOrderById
};
