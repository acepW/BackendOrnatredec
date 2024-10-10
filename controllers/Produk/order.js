// const path = require('path');
// const Order = require('../../models/Produk/order');

// // Mengubah status pesanan
// const updateOrderStatus = async (req, res) => {
//     const { id } = req.params; // ID pesanan yang ingin diubah
//     const { status } = req.body; // Status baru yang dikirim dari request body

//     // Validasi status
//     const validStatuses = ['dipesan', 'dikemas', 'sedang diantar', 'selesai'];
//     if (!validStatuses.includes(status)) {
//         return res.status(400).json({ message: 'Status tidak valid' });
//     }

//     try {
//         // Cari pesanan berdasarkan ID
//         const order = await Order.findByPk(id);

//         if (!order) {
//             return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
//         }

//         // Ubah status pesanan
//         order.status = status;
//         await order.save();

//         res.status(200).json({ message: 'Status pesanan berhasil diperbarui', order });
//     } catch (error) {
//         res.status(500).json({ message: error });
//     }
// };

// // Mendapatkan semua pesanan dan mengubah status dari "dipesan" ke "dikemas"
// // const getAllOrders = async (req, res) => {
// //     try {
//         // Cari semua pesanan yang masih berstatus "dipesan"
//         // const orders = await Order.findAll({
//         //     where: { status: 'dipesan' },
//         //     include: [{
//         //         model: Order,
//         //         through: { attributes: [] } // Mengambil produk tanpa atribut tambahan dari tabel pivot
//         //     }]
//         // });

//         // if (orders.length === 0) {
//         //     return res.status(200).json({ message: 'Tidak ada pesanan yang berstatus "dipesan"' });
//         // }

//         // // Ubah status pesanan menjadi "dikemas"
//         // for (let order of orders) {
//         //     order.status = 'dikemas';
//         //     await order.save();
//         // }

//         // // Ambil ulang semua pesanan dengan status yang sudah diperbarui
//         // const updatedOrders = await Order.findAll({
//         //     include: [{
//         //         model: Order,
//         //         through: { attributes: [] } // Mengambil produk terkait
//         //     }]
//         // });

// //         res.status(200).json({msg:"oke"});
// //      } catch (error) {
// //         console.log (error);  // Menampilkan error di console
// //         res.status(500).json({ error: error.message });
        
// //     }
// // };

// // Mendapatkan pesanan berdasarkan ID, dan mengubah status dari "dipesan" ke "dikemas"
// const getOrderById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const order = await Order.findByPk(id, {
//             include: [{
//                 model: Order,
//                 through: { attributes: [] } // Mengambil produk terkait
//             }]
//         });

//         if (!order) {
//             return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
//         }

//         // Ubah status jika "dipesan"
//         if (order.status === 'dipesan') {
//             order.status = 'dikemas';
//             await order.save();
//         }

//         res.status(200).json(order);
//     } catch (error) {
//         res.status(300).json({ message: "jwodojd" });
//     }
// };

// // Ekspor semua fungsi
// module.exports = {
//     updateOrderStatus,
//     // getAllOrders,
//     getOrderById
// };
