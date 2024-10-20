const Post = require("../../models/Forum/posts");
const Report = require("../../models/Forum/report");
const Produk = require("../../models/Produk/produk");
const TransaksiProduk = require("../../models/Transaksi/transaksiproduk");
const User = require("../../models/User/users");

const totalSemua = async (req, res) => {
    try {
        const totalProduk = await Produk.count({})

        const kategoriIkan = 'ikan';
        const totalProdukIkan = await Produk.count({
            where : {kategori_produk : kategoriIkan}
        })

        const kategoriTanaman = 'tanaman';
        const totalProdukTanaman = await Produk.count({
            where : {kategori_produk : kategoriTanaman}
        })

        const kategoriBurung = 'burung';
        const totalProdukBurung = await Produk.count({
            where : {kategori_produk : kategoriBurung}
        })

        const role = 'user';
        const totalPenggunaUser = await User.count({
            where : {role : role}
        })

        const totalPostingan = await Post.count({})

        const totalForumIkan = await Post.count({
            where : {kategori_forum : kategoriIkan}
        })

        const totalForumTanaman = await Post.count({
            where : {kategori_forum : kategoriTanaman}
        })

        const totalForumBurung = await Post.count({
            where : {kategori_forum : kategoriBurung}
        })

        const totalPemesanan = await TransaksiProduk.count({})

        const jumlahReport = await Report.count({})

      res.status(200).json({
        totalProduk,
        totalProdukBurung,
        totalProdukIkan,
        totalProdukTanaman,
        totalPostingan,
        totalPenggunaUser,
        totalForumBurung,
        totalForumIkan,
        totalForumTanaman,
        totalPemesanan,
        jumlahReport
      })
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

module.exports = totalSemua