const path = require('path');
const transaksiProduk = require('../../models/Transaksi/transaksiproduk'); // Import model transaksiProduk
const Produk = require('../../models/Produk/produk'); // Import model Produk jika diperlukan
const Variasi = require('../../models/Produk/variasi');
const Subvariasi = require('../../models/Produk/variasi');
const Alamat = require('../../models/Transaksi/alamat');
const User = require('../../models/User/users');


// Mengubah status pesanan
const updateOrderStatus = async (req, res) => {
    const { id } = req.params; // ID pesanan yang ingin diubah
    const { status } = req.body; // Status baru yang dikirim dari request body

    try {
        // Validasi status
        const validStatuses = ['dipesan', 'dikemas', 'dikirim', 'selesai'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Status tidak valid' });
        }

        // Cari pesanan berdasarkan ID
        const Order = await transaksiProduk.findByPk(id);

        if (!Order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Cek status pembayaran dari tabel PaymentGateway berdasarkan id_transaksi
        const payment = await PaymentGateway.findOne({
            where: { id_transaksi: Order.id_transaksi }
        });

        if (!payment || payment.status !== 'success') {
            return res.status(403).json({ message: 'Status pesanan tidak bisa diubah karena pembayaran belum selesai' });
        }

        // Ubah status pesanan
        Order.status = status;
        await Order.save();

        res.status(200).json({ message: 'Status pesanan berhasil diperbarui', Order });
    } catch (error) {
        console.error('Error updating Order status:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status pesanan', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await transaksiProduk.findAll({
            where: { status: 'dipesan' },
            include: [{
                model: Produk, // Include model Produk untuk mengambil detail produk terkait
            }]
        });

        console.log("Orders found:", orders); // Debugging log


        // Jika tidak ada pesanan berstatus "dipesan"
        if (orders.length === 0) {
            return res.status(200).json({ message: 'Tidak ada pesanan yang berstatus "dipesan"' });


        }

        // Ubah status semua pesanan dari "dipesan" ke "dikemas"
        for (let Order of orders) {
            Order.status = 'dikemas';
            await Order.save();
            console.log("transaksiProduk updated:", Order); // Debugging log
        }

        // Ambil ulang semua pesanan setelah update status
        const updatedOrders = await transaksiProduk.findAll({
            include: [{
                model: Produk, // Mengambil produk terkait
            }]
        });

        // Kirim respons dengan data pesanan yang sudah diperbarui

        res.status(200).json(updatedOrders);
    } catch (error) {
        console.error('Error fetching or updating orders:', error); // Log error yang lebih spesifik
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil atau memperbarui pesanan', error: error.message });

    }
}

const getAllOrdersdikemas = async (req, res) => {
    try {
        const orders = await transaksiProduk.findAll({
            where: { status: 'dikemas' },
            include: [{
                model: Produk, // Include model Produk untuk mengambil detail produk terkait
            }]
        });

        console.log("Orders found:", orders); // Debugging log


        // Jika tidak ada pesanan berstatus "dipesan"
        if (orders.length === 0) {
            return res.status(200).json({ message: 'Tidak ada pesanan yang berstatus "dikemas"' });


        }

        // Ubah status semua pesanan dari "dipesan" ke "dikemas"
        for (let Order of orders) {
            Order.status = 'dikirim';
            await Order.save();
            console.log("transaksiProduk updated:", Order); // Debugging log
        }

        // Ambil ulang semua pesanan setelah update status
        const updatedOrders = await transaksiProduk.findAll({
            include: [{
                model: Produk, // Mengambil produk terkait
            }]
        });

        // Kirim respons dengan data pesanan yang sudah diperbarui

        res.status(200).json(updatedOrders);
    } catch (error) {
        console.error('Error fetching or updating orders:', error); // Log error yang lebih spesifik
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil atau memperbarui pesanan', error: error.message });

    }

}
// const getAllOrdersantar = async (req, res) => {
//     try {
//         const orders = await transaksiProduk.findAll({
//             where: { status: 'dikirim' },
//             include: [{
//                 model: Produk,
//                 // Include model Produk untuk mengambil detail produk terkait
//             }]
//         });

//         console.log("Orders found:", orders); // Debugging log

//         // Jika tidak ada pesanan berstatus "dikirim"
//         if (orders.length === 0) {
//             return res.status(200).json({ message: 'Tidak ada pesanan yang berstatus "dikirim"' });
//         }

//         // Ubah status semua pesanan dari "dikirim" ke "selesai"
//         for (let order of orders) {
//             order.status = 'selesai';
//             await order.save();
//             console.log("transaksiProduk updated:", order); // Debugging log
//         }

//         // Ambil ulang semua pesanan setelah update status
//         const updatedOrders = await transaksiProduk.findAll({
//             include: [{
//                 model: Produk,
//                 // Mengambil produk terkait
//             }]
//         });

//         // Kirim respons dengan data pesanan yang sudah diperbarui
//         res.status(200).json(updatedOrders);
//     } catch (error) {
//         console.error('Error fetching or updating orders:', error); // Log error yang lebih spesifik
//         res.status(500).json({ message: 'Terjadi kesalahan saat mengambil atau memperbarui pesanan', error: error.message });
//     }
// }



// Fungsi untuk mengambil satu pesanan berdasarkan ID dan mengubah statusnya jika diperlukan
const getOrderById = async (req, res) => {
    const { id } = req.params; // Mendapatkan id_transaksi dari parameter URL

    try {
        // Cari pesanan berdasarkan id_transaksi
        const Order = await transaksiProduk.findByPk(id, {

            include: [{
                model: Produk, // Include model Produk untuk mendapatkan detail produk terkait
            }]
        });

        // Jika pesanan tidak ditemukan


        if (!Order) {
            return res.status(405).json({ message: 'Pesanan tidak ditemukan' });

        }

        // Jika status pesanan adalah 'dipesan', ubah menjadi 'dikemas'
        if (Order.status === 'dipesan') {
            Order.status = 'dikemas';
            await Order.save(); // Simpan perubahan ke database
            console.log("Pesanan telah diperbarui:", Order);
        }


        // Kirim respons dengan data pesanan yang sudah diperbarui
        res.status(200).json(Order);
    } catch (error) {
        console.error('Caught error:', error); // Debugging log
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message || error });
    }
};

const getOrderByIddikemas = async (req, res) => {
    const { id } = req.params; // Mendapatkan id_transaksi dari parameter URL

    try {
        // Cari pesanan berdasarkan id_transaksi
        const Order = await transaksiProduk.findByPk(id, {

            include: [{
                model: Produk, // Include model Produk untuk mendapatkan detail produk terkait
            }]
        });

        // Jika pesanan tidak ditemukan

        if (!Order) {
            return res.status(405).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Jika status pesanan adalah 'dipesan', ubah menjadi 'dikemas'
        if (Order.status === 'dikemas') {
            Order.status = 'dikirim';
            await Order.save(); // Simpan perubahan ke database
            console.log("Pesanan telah diperbarui:", Order);
        }


        // Kirim respons dengan data pesanan yang sudah diperbarui
        res.status(200).json(Order);
    } catch (error) {
        console.error('Caught error:', error); // Debugging log
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message || error });
    }
};

const getOrderByIdantar = async (req, res) => {
    const { id } = req.params; // Mendapatkan id_transaksi dari parameter URL

    try {
        // Cari pesanan berdasarkan id_transaksi
        const Order = await transaksiProduk.findByPk(id, {

            include: [{
                model: Produk, // Include model Produk untuk mendapatkan detail produk terkait
            }]
        });

        // Jika pesanan tidak ditemukan


        if (!Order) {
            return res.status(405).json({ message: 'Pesanan tidak ditemukan' });

        }

        // Jika status pesanan adalah 'dipesan', ubah menjadi 'dikemas'
        if (Order.status === 'dikirim') {
            Order.status = 'selesai';
            await Order.save(); // Simpan perubahan ke database
            console.log("Pesanan telah diperbarui:", Order);
        }


        // Kirim respons dengan data pesanan yang sudah diperbarui
        res.status(200).json(Order);
    } catch (error) {
        console.error('Caught error:', error); // Debugging log
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message || error });
    }
};
// Fungsi untuk mengambil satu pesanan berdasarkan ID tanpa mengubah statusnya
const detail = async (req, res) => {
    const { id } = req.params; // Mendapatkan id_transaksi dari parameter URL

    try {
        // Cari pesanan berdasarkan id_transaksi
        const Order = await transaksiProduk.findByPk(id, {
            include: [{
                model: Produk, // Include model Produk untuk mendapatkan detail produk terkait
            }]
        });

        // Jika pesanan tidak ditemukan
        if (!Order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Kirim respons dengan data pesanan tanpa mengubah status
        res.status(200).json(Order);
    } catch (error) {
        console.error('Caught error:', error); // Debugging log
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message || error });
    }
};


const getDetailById = async(req, res) => {
    const  { id } = req.params;
    try {
        const detail = await transaksiProduk.findOne({
            where: { id: id },
            include: [
                {
                    model: Produk,
                    attributes : ['judul_produk', 'kategori_produk', 'harga', 'foto_produk']
                },
                {
                    model: Alamat
                },
            ]
        })
        res.status(200).json(detail)
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
}

// Ekspor semua fungsi
module.exports = {
    updateOrderStatus,
    getAllOrders,
    getOrderById,
    detail,
    // getAllOrdersantar,
    getAllOrdersdikemas,
    getOrderByIdantar,
    getOrderByIddikemas,
    getDetailById,
};
