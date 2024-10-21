const Order = require('../../models/Produk/order');
const Ulasan = require('../../models/Ulasan/ulasan'); // Model ulasan perlu dibuat
const Produk = require('../../models/Produk/produk');

// Fungsi untuk memberikan ulasan setelah status order selesai
const berikanUlasan = async (req, res) => {
    try {
        const { orderId, rating, komentar } = req.body;

        // Cari order berdasarkan ID
        const order = await Order.findOne({ where: { id: orderId } });

        if (!order) {
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }

        // Pastikan status order adalah 'selesai'
        if (order.status !== 'selesai') {
            return res.status(400).json({ message: "Ulasan hanya bisa diberikan jika pesanan sudah selesai" });
        }

        // Cari produk berdasarkan order
        const produk = await Produk.findOne({ where: { id: order.id_produk } });

        if (!produk) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        // Simpan ulasan
        const ulasan = await Ulasan.create({
            id_produk: produk.id,
            id_user: req.user.id, // Mengambil user dari request (misalnya dari token)
            rating,
            komentar
        });

        return res.status(201).json({ message: "Ulasan berhasil disimpan", ulasan });
    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan", error });
    }
};

module.exports = {
    berikanUlasan
};
