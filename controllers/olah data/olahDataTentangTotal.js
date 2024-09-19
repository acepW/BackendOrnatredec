const Post = require("../../models/Forum/posts");
const Produk = require("../../models/Produk/produk");
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

      res.status(200).json({
        totalProduk,
        totalProdukBurung,
        totalProdukIkan,
        totalProdukTanaman,
        totalPostingan,
        totalPenggunaUser
      })

    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

module.exports = totalSemua