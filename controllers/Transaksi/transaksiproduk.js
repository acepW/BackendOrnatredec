const path = require('path');
const Order = require('../../models/Transaksi/transaksiproduk');

// Mengubah status pesanan
const updateOrderStatus = async (req, res) => {
    const { id } = req.params; // ID pesanan yang ingin diubah
    const { status } = req.body; // Status baru yang dikirim dari request body

    // Validasi status
    const validStatuses = ['dipesan', 'dikemas', 'sedang diantar', 'selesai'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid' });
    }

    try {
        // Cari pesanan berdasarkan ID
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Ubah status pesanan
        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Status pesanan berhasil diperbarui', order });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Ekspor semua fungsi
module.exports = {
    updateOrderStatus,
 
};
