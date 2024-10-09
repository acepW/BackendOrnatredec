const Alamat = require("../../models/Transaksi/alamat");
const User = require("../../models/User/users");

const createAlamat = async (req, res) => {
    const {
        provinsi,
        kota_kabupaten,
        kecamatan,
        kelurahan_desa,
        jalan_namagedung,
        rtrw,
        patokan,
        nama_penerima,
        kategori_alamat,
        alamat_pengiriman_utama
    } = req.body;
    
    const {id} = req.user;

    try {
        const noHp = await User.findByPk(id);
        const noPonsel = noHp.no_hp;

        const alamat = await Alamat.create({
            userId : id,
            provinsi,
            kota_kabupaten,
            kecamatan,
            kelurahan_desa,
            jalan_namagedung,
            rtrw,
            patokan,
            nama_penerima,
            no_hp : noPonsel,
            kategori_alamat,
            alamat_pengiriman_utama
        });
        res.status(200).json(alamat);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

const editAlamat = async (req, res) => {
    const {
        provinsi,
        kota_kabupaten,
        kecamatan,
        kelurahan_desa,
        jalan_namagedung,
        rtrw,
        noHp,
        patokan,
        nama_penerima,
        kategori_alamat,
        alamat_pengiriman_utama
    } = req.body;
    const id = req.params.id;
    try {
      const address = await Alamat.findOne({where : {userId : id}});
      if (!address) {
        res.status(403).json({message : "alamat tidak ditemukan"})
      }
      await Alamat.update({
        provinsi,
        kota_kabupaten,
        kecamatan,
        kelurahan_desa,
        jalan_namagedung,
        rtrw,
        patokan,
        nama_penerima,
        no_hp : noHp,
        kategori_alamat,
        alamat_pengiriman_utama
      }, {
        where : {userId : id}
      })
  
      const user = await User.findByPk(id);
      await User.update({
        no_hp : noHp
      },{
        where : {id : user.id}
      })
  
      const alamatBaru = await Alamat.findOne({ where: { userId: id } });
      res.status(200).json(alamatBaru)
    } catch (error) {
      res.status(500).json({message : error.message})
    }
  }
const getAlamat = async (req, res) => {
    try {
        const alamat = await Alamat.findAll();
        res.status(200).json(alamat);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}

module.exports = {
    createAlamat,
    getAlamat,
    editAlamat
}
