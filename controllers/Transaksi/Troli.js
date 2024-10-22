const Produk = require("../../models/Produk/produk");
const subVariasi = require("../../models/Produk/subVariasi");
const Troli = require("../../models/Transaksi/troli");
const Alamat = require("../../models/Transaksi/alamat");
const User = require("../../models/User/users");


const troliProduk = async (req, res) => {
  const { id_produk, id_subVariasi, jumlahStok } = req.body;
  const id_User = req.user.id;

  try {
    const userid = await User.findByPk(id_User);
    if (!userid) {
      return res.status(400).json({ message: 'User tidak ditemukan' });
    }

    const alamat = await Alamat.findOne({ where: { userId: id_User } });

    const produk = await Produk.findByPk(id_produk);
    if (!produk) {
      return res.status(400).json({ message: 'Produk tidak ditemukan' });
    }

    const subvariasi = await subVariasi.findByPk(id_subVariasi);
    if (!subvariasi) {
      return res.status(400).json({ message: 'Sub Variasi tidak ditemukan' });
    }

    const variasi = subvariasi.id_variasi;

    const troliProduk = await Troli.findOne({ where: { id_User: id_User, id_produk: id_produk, id_subVariasi: id_subVariasi } });

    if (!troliProduk) {
      const troli = await Troli.create({
        id_User: id_User,
        id_produk,
        id_alamat: alamat.id,
        id_variasi: variasi,
        id_subVariasi,
        jumlahStok: jumlahStok
      });

      return res.status(200).json(troli);
    }

    const jumlahBaru = troliProduk.jumlahStok + jumlahStok;

    await Troli.update({
      jumlahStok: jumlahBaru
    }, {
      where: { id: troliProduk.id }
    });

    const TroliUpdate = await Troli.findByPk(troliProduk.id);

    res.status(202).json(TroliUpdate);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editTroli = async (req, res) => {

}

module.exports = {
    troliProduk,
    editTroli
}