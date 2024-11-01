const Pengeluaran = require("../../models/Transaksi/pengeluaran");
const pPengeluaran = require("../../models/Transaksi/petugasPengeluaran");
const Transaksi = require("../../models/Transaksi/transaksi");
const moment = require("moment");
const { Op } = require("sequelize");
const User = require("../../models/User/users");
const TransaksiProduk = require("../../models/Transaksi/transaksiproduk");
const Produk = require("../../models/Produk/produk");
const detailPermintaan = require("../../models/Transaksi/detailPermintaan");

const createPengeluaran = async (req, res) => {
    const { kategori_produk, nama_penjual, no_penjual, pengeluaran } = req.body;
    const id = req.user.id;
    const userRole = req.user.role;
    try {
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: "user tidak ditemukan." });
        }

        if (userRole !== 'admin' && user.id !== id) {
            return res.status(403).json({ message: "Maaf, kamu tidak bisa menghapus komen ini." });
        }

        const nama_petugas = user.username;

        let jumlahTotal = 0;
        const pengeluaranBaru = await pPengeluaran.create({
            userId : id,
            kategori_produk,
            nama_petugas: nama_petugas,
            nama_penjual,
            no_penjual,
            subTotal: jumlahTotal
        });

        if (pengeluaran) {
            for (let index = 0; index < pengeluaran.length; index++) {
                const hargaTotal = pengeluaran[index].harga_satuan * pengeluaran[index].stok;
                await Pengeluaran.create({
                    id_pengeluaran: pengeluaranBaru.id,
                    nama_produk: pengeluaran[index].nama_produk,
                    harga_satuan: pengeluaran[index].harga_satuan,
                    stok: pengeluaran[index].stok,
                    total: hargaTotal,
                });
                jumlahTotal += hargaTotal;
                console.log('Subtotal Updated:', jumlahTotal);
            }
        }

        await pengeluaranBaru.update({
            subTotal: jumlahTotal,
        });

        res.status(200).json(pengeluaranBaru);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reportPerbulan = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;

        if (!bulan || !tahun) {
            return res.status(400).json({ message: 'Tolong input bulan dan tahun' });
        }

        // Set startDate dan endDate untuk awal dan akhir bulan
        const startDate = new Date(`${tahun}-${bulan}-01T00:00:00Z`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

        console.log('Start Date:', startDate.toISOString());
        console.log('End Date:', endDate.toISOString());

        // Ambil data transaksi di rentang tanggal yang ditentukan
        const transaksi = await Transaksi.sum('total_pembayaran', {
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }, attributes: ['total_pembayaran']
        });

        console.log('Hasil Query Transaksi:', transaksi);

        // Ambil data pengeluaran di rentang tanggal yang ditentukan
        const pengeluaran = await pPengeluaran.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }, attributes: ['nama_petugas', 'subTotal'],
            include: [{ model: Pengeluaran, attributes: ['nama_produk', 'stok', 'harga_satuan', 'total'] }]
        });

        console.log('Hasil Query Pengeluaran:', pengeluaran);

        // Jika data transaksi atau pengeluaran kosong
        if (transaksi.length === 0 && pengeluaran.length === 0) {
            return res.status(404).json({ message: 'Tidak ada data untuk bulan dan tahun yang diberikan.' });
        }

        // Hitung total transaksi dan pengeluaran
        // const totalTransaksiPerbulan = transaksi.reduce((sum, transaksiBulan) => sum + transaksiBulan.total_pembayaran, 0);
        // const Pemasukkan = transaksi.length;
        const totalPengeluaranPerbulan = pengeluaran.reduce((sum, pengeluaranBulan) => sum + pengeluaranBulan.subTotal, 0);
        // const totalPengeluaran = pengeluaran.length;
        const perbandingan = transaksi - totalPengeluaranPerbulan;
        const statusTanaman = 'tanaman';
        const statusBurung = 'burung';
        const statusIkan = 'ikan';

        const totalTanaman = await TransaksiProduk.sum('totalHarga', {
            include: {
                model: Produk,
                where: {
                    kategori_produk: statusTanaman
                }
            },
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                }
            },
        })
        const totalIkan = await TransaksiProduk.sum('totalHarga', {
            include: {
                model: Produk,
                where: {
                    kategori_produk: statusIkan
                }
            },
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                }
            },
        })
        const totalBurung = await TransaksiProduk.sum('totalHarga', {
            include: {
                model: Produk,
                where: {
                    kategori_produk: statusBurung
                }
            },
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                }
            },
        })
        const beliBurung = await pPengeluaran.sum('subTotal', {
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },  kategori_produk: statusBurung 
            }, 
        })
         const beliIkan = await pPengeluaran.sum('subTotal', {
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },  kategori_produk: statusIkan 
            }, 
         })
         const beliTanaman = await pPengeluaran.sum('subTotal', {
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },  kategori_produk: statusTanaman 
            }, 
         })
        const totalBiayaLayanan = await Transaksi.sum('biaya_layanan', {
             where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                }, 
            },
        })
        const status = 'ya';
        const totalBiayaDarurat = await detailPermintaan.sum('total', {
             where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                }, status : status
            },
        })

        const totalBeli = beliIkan + beliBurung + beliTanaman;
        const totalJual = totalBurung + totalIkan + totalTanaman;
        const totalUntungIkan = totalIkan - beliIkan;
        const totalUntungBurung = totalBurung - beliBurung;
        const totalUntungTanaman = totalTanaman - beliTanaman;
        const totalUntung = totalUntungBurung + totalUntungIkan + totalUntungTanaman;
        const totalUntungLayanan = totalBiayaLayanan - totalBiayaDarurat;
        const Subtotal = totalUntung + totalBiayaLayanan - totalBiayaDarurat;

        const reportData = {
            month: moment(startDate).format('MMMM YYYY'),
            // transaksi,
            // Pemasukkan,
            Transaksi : transaksi,
            totalPengeluaranPerbulan,
            // totalPengeluaran,
            Pengeluaran : pengeluaran,
            Perbandingan: perbandingan,
            totalJualTanaman: totalTanaman,
            totalJualIkan: totalIkan,
            totalJualburung: totalBurung,
            totalBeliTanaman: beliTanaman,
            totalBeliIkan: beliIkan,
            totalBeliBurung: beliBurung,
            totalBeli: totalBeli,
            totalJual: totalJual,
            totalUntungIkan: totalUntungIkan,
            totalUntungBurung: totalUntungBurung,
            totalUntungTanaman: totalUntungTanaman,
            totalUntung: totalUntung,
            totalBiayalayanan: totalBiayaLayanan,
            totalBiayaDarurat: totalBiayaDarurat,
            totalUntungLayanan : totalUntungLayanan,
            subTotalKeuntungan: Subtotal,
        };
        // console.log(Pemasukkan);
        

        return res.status(200).json(reportData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPengeluaran,
    reportPerbulan
}; 