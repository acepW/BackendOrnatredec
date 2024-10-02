const Alamat = require("../../models/Transaksi/alamat");

const createAlamat = async (req, res) => {
    const {
        provinsi,
        kota_kabupaten,
        kecamatan,
        kelurahan_desa,
        jalan_namagedung,
        unit_lantai,
        patokan,
        nama_penerima,
        no_hp,
        kategori_alamat,
        alamat_pengiriman_utama
    } = req.body;

    try {
        const alamat = await Alamat.create({
            provinsi,
            kota_kabupaten,
            kecamatan,
            kelurahan_desa,
            jalan_namagedung,
            unit_lantai,
            patokan,
            nama_penerima,
            no_hp,
            kategori_alamat,
            alamat_pengiriman_utama
        });
        res.status(200).json(alamat);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAlamat = async (req, res) => {
    try {
        const alamat = await Alamat.findAll();
        res.status(200).json(alamat);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    createAlamat,
    getAlamat
}
