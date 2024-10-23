const Order = require('../../models/Transaksi/transaksiproduk');
const Produk = require('../../models/Produk/produk');
const Ulasan = require('../../models/Ulasan/ulasan');

// Fungsi untuk memberikan ulasan setelah status selesai
const beriUlasan = async (req, res) => {
    const { id_transaksi_produk } = req.params;
    const { rating, komentar } = req.body;
    const userId = req.user.id;

    try {
        const transaksiProduk = await Order.findByPk(id_transaksi_produk, {
            include: [{ model: Produk }]
        });

        if (!transaksiProduk) {
            return res.status(404).json({ message: 'Transaksi produk tidak ditemukan' });
        }
        if (transaksiProduk.status !== 'selesai') {
            return res.status(400).json({ message: 'Ulasan hanya dapat diberikan setelah status pesanan "selesai"' });
        }

        const existingUlasan = await Ulasan.findOne({
            where: {
                id_produk: transaksiProduk.id_produk,
                id_user: userId
            }
        });

        if (existingUlasan) {
            return res.status(400).json({ message: 'Anda sudah memberikan ulasan untuk produk ini.' });
        }

        // Dapatkan base URL dari request
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Dapatkan path foto dan video dari req.files dan ubah menjadi URL
        const fotoPath = req.files.foto ? req.files.foto[0].path : null;
        const videoPath = req.files.video ? req.files.video[0].path : null;

        const fotoUrl = fotoPath ? `${baseUrl}/${fotoPath}` : null;
        const videoUrl = videoPath ? `${baseUrl}/${videoPath}` : null;

        const ulasanBaru = await Ulasan.create({
            id_produk: transaksiProduk.id_produk,
            id_user: userId,
            rating: rating,
            komentar: komentar,
            foto: fotoUrl,  // Simpan URL di database
            video: videoUrl  // Simpan URL di database
        });

        return res.status(201).json({
            message: 'Ulasan berhasil diberikan',
            ulasan: ulasanBaru
        });
    } catch (error) {
        console.error('Caught error:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

module.exports = {
    beriUlasan
};
