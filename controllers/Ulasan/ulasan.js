const Order = require('../../models/Transaksi/transaksiproduk');
const Produk = require('../../models/Produk/produk');
const Ulasan = require('../../models/Ulasan/ulasan');
const path = require('path');

// Fungsi untuk memberikan ulasan setelah status selesai
const beriUlasan = async (req, res) => {
    const { id_transaksi_produk } = req.params;
    const { rating, komentar } = req.body;
    const userId = req.user.id;

    try {
        // Cari transaksi produk berdasarkan ID
        const transaksiProduk = await Order.findByPk(id_transaksi_produk, {
            include: [{ model: Produk }]
        });

        // Cek apakah transaksi produk ditemukan
        if (!transaksiProduk) {
            return res.status(404).json({ message: 'Transaksi produk tidak ditemukan' });
        }

        // Cek apakah status transaksi sudah selesai
        if (transaksiProduk.status !== 'selesai') {
            return res.status(400).json({ message: 'Ulasan hanya dapat diberikan setelah status pesanan "selesai"' });
        }

        // Cek apakah user sudah memberikan ulasan untuk produk ini
        const existingUlasan = await Ulasan.findOne({
            where: {
                id_transaksiProduk : transaksiProduk.id,
                id_user: userId
            }
        });

        if (existingUlasan) {
            return res.status(400).json({ message: 'Anda sudah memberikan ulasan untuk produk ini.' });
        }

        // Dapatkan base URL dari request
        // const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Dapatkan path foto dan video dari req.files dan ubah menjadi URL
        let fotoPath = req.files.foto ? req.files.foto[0].path : null;
        let videoPath = req.files.video ? req.files.video[0].path : null;

        // Konversi backslash ke forward slash agar sesuai dengan URL
        if (fotoPath) {
            fotoPath = fotoPath.split(path.sep).join('/');
        }
        if (videoPath) {
            videoPath = videoPath.split(path.sep).join('/');
        }
        // Konversi path lokal menjadi URL yang dapat diakses
        const fotoUrl = fotoPath ? `/${fotoPath}` : null;
        const videoUrl = videoPath ? `/${videoPath}` : null;

        // Buat ulasan baru dan simpan ke database
        const ulasanBaru = await Ulasan.create({
            id_transaksiProduk : transaksiProduk.id,
            id_produk: transaksiProduk.id_produk,
            id_user: userId,
            rating: rating,
            komentar: komentar,
            foto: fotoUrl,  // Simpan URL di database
            video: videoUrl  // Simpan URL di database
        });

        const rating5 = await Ulasan.count({
            where : {id_produk : ulasanBaru.id_produk, rating : '5'}
        })
        console.log(rating5);
        
        const rating4 = await Ulasan.count({
            where : {id_produk : ulasanBaru.id_produk, rating : '4'}
        })
        console.log(rating4);
        
        const rating3 = await Ulasan.count({
            where : {id_produk : ulasanBaru.id_produk, rating : '3'}
        })
        console.log(rating3);
        
        const rating2 = await Ulasan.count({
            where : {id_produk : ulasanBaru.id_produk, rating : '2'}
        })
        console.log(rating2);
        
        const rating1 = await Ulasan.count({
            where : {id_produk : ulasanBaru.id_produk, rating : '1'}
        })
        console.log(rating1);
        

        const jumlahUlasan = await Ulasan.count({
            where : {id_produk : ulasanBaru.id_produk}
        })

        const jumlah5 = rating5 * 5;
        const jumlah4 = rating4 * 4;
        const jumlah3 = rating3 * 3;
        const jumlah2 = rating2 * 2; 
        const jumlah1 = rating1 * 1;
        
        const totalRating = (jumlah1 + jumlah2 + jumlah3 + jumlah4 + jumlah5) / jumlahUlasan;

        console.log(totalRating);
        

        await Produk.update({
            ratingProduk : totalRating
        }, {
            where : {id : ulasanBaru.id_produk}
        })

        // Kirim respon berhasil
        return res.status(201).json({
            message: 'Ulasan berhasil diberikan',
            ulasan: ulasanBaru
        });
    } catch (error) {
        console.error('Caught error:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

const getUlasan = async (req, res) => {
    try {
        const ulasan = await Ulasan.findAll()
        res.status(200).json(ulasan)
    } catch (error) {
         return res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
}

module.exports = {
    beriUlasan,
    getUlasan
};
