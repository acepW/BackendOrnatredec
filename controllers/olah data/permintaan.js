const { where } = require("sequelize");
const detailPermintaan = require("../../models/Transaksi/detailPermintaan");
const Permintaan = require("../../models/Transaksi/permintaan");
const User = require("../../models/User/users");

const createPermintaan = async (req, res) => {
    const { permintaan } = req.body;
    const id = req.user.id;
    const userRole = req.user.role;
    try {
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: "user tidak ditemukan." });
        }

        if (userRole !== 'kasir' && user.id !== id) {
            return res.status(403).json({ message: "Maaf, kamu tidak bisa menghapus komen ini." });
        }

        const nama_petugas = user.username;

        let jumlahTotal = 0;
        const permintaanBaru = await Permintaan.create({
            userId : id,
            nama_petugas: nama_petugas,
            subTotal: jumlahTotal
        });

        if (permintaan) {
            for (let index = 0; index < permintaan.length; index++) {
                const hargaTotal = permintaan[index].hargaSatuan * permintaan[index].stok;
                await detailPermintaan.create({
                    id_pengeluaran: permintaanBaru.id,
                    nama_produk: permintaan[index].nama_produk,
                    hargaSatuan: permintaan[index].hargaSatuan,
                    stok: permintaan[index].stok,
                    deskripsi: permintaan[index].deskripsi,
                    total: hargaTotal,
                });
                jumlahTotal += hargaTotal;
                console.log('Subtotal Updated:', jumlahTotal);
            }
        }

        await permintaanBaru.update({
            subTotal: jumlahTotal,
        });

        res.status(200).json(permintaanBaru);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatusPermintaan = async (req, res) => {
    const { status } = req.body;
    const id = req.params.id;
    try {
        const detail_permintaan = await detailPermintaan.findByPk(id)
        if (!detail_permintaan) {
        return res.status(404).json({ message: "detail permintaan tidak ditemukan." });
        }
        
        await detailPermintaan.update({
            status : status
        }, {
            where : {id : id}
        })

        const detail_permintaan_baru = await detailPermintaan.findByPk(id)

        res.status(200).json(detail_permintaan_baru)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

const getPermintaan = async (req, res) => {
    try {
        const permintaan = await detailPermintaan.findAll()
        res.status(200).json(permintaan)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

module.exports = {
    createPermintaan,
    updateStatusPermintaan,
    getPermintaan
}
