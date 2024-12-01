const sequelize = require('../../config/config');
const Transaksi = require('../../models/Transaksi/transaksi');
const { Op } = require('sequelize');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk');
const Produk = require('../../models/Produk/produk');

const getYearlyStatistics = async (req, res) => {
    const { year } = req.params;

    if (!year || isNaN(year)) {
        return res.status(400).json({ message: 'Tahun harus valid.' });
    }

    const statisticsByMonth = [];


    try {
        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const prevStartDate = new Date(year, month - 2, 1);
            const prevEndDate = new Date(year, month - 1, 0);

            const fetchTransaksiData = async (startDate, endDate) => {
                const transaksi = await Transaksi.findAll({
                    attributes: [
                        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
                        [sequelize.fn('SUM', sequelize.col('sub_total')), 'totalSubTotal'],
                        [sequelize.fn('SUM', sequelize.col('biaya_layanan')), 'totalServiceFee'],
                        [sequelize.fn('SUM', sequelize.col('total_pembayaran')), 'totalPayment'],
                    ],
                    where: {
                        createdAt: {
                            [Op.between]: [startDate, endDate],
                        }
                    },
                    raw: true,
                });

                const transaksi_produk = await TransaksiProduk.sum('jumlah', {
                    where: { createdAt: { [Op.between]: [startDate, endDate] } }
                });

                const ProdukTanaman = await TransaksiProduk.sum('jumlah', {
                    include: {
                        model: Produk,
                        where: { kategori_produk: 'tanaman' },
                        attributes: []
                    },
                    where: { createdAt: { [Op.between]: [startDate, endDate] } }
                });

                const totalTanaman = await TransaksiProduk.sum('totalHarga', {
                    include: {
                        model: Produk,
                        where: { kategori_produk: 'tanaman' }
                    },
                    where: { createdAt: { [Op.between]: [startDate, endDate] } }
                });

                const ProdukIkan = await TransaksiProduk.sum('jumlah', {
                    include: {
                        model: Produk,
                        where: { kategori_produk: 'ikan' },
                        attributes: []
                    },
                    where: { createdAt: { [Op.between]: [startDate, endDate] } }
                });

                const totalIkan = await TransaksiProduk.sum('totalHarga', {
                    include: {
                        model: Produk,
                        where: { kategori_produk: 'ikan' }
                    },
                    where: { createdAt: { [Op.between]: [startDate, endDate] } }
                });

                const ProdukBurung = await TransaksiProduk.sum('jumlah', {
                    include: {
                        model: Produk,
                        where: { kategori_produk: 'burung' },
                        attributes: []
                    },
                    where: { createdAt: { [Op.between]: [startDate, endDate] } }
                });

                const totalBurung = await TransaksiProduk.sum('totalHarga', {
                    include: {
                        model: Produk,
                        where: { kategori_produk: 'burung' }
                    },
                    where: { createdAt: { [Op.between]: [startDate, endDate] } }
                });
                const methodOnline = "online";
                const totalTransaksiOnline = await Transaksi.count({
                    where: {
                        createdAt: { [Op.between]: [startDate, endDate] },
                        metode_transaksi: methodOnline
                    }
                });
                const methodOffline = "offline";
                const totalTransaksiOffline = await Transaksi.count({
                    where: {
                        createdAt: { [Op.between]: [startDate, endDate] },
                        metode_transaksi: methodOffline
                    }
                });

                return {
                    totalTransactions: transaksi[0]?.totalTransactions || 0,
                    totalSubTotal: transaksi[0]?.totalSubTotal || 0,
                    totalServiceFee: transaksi[0]?.totalServiceFee || 0,
                    totalPayment: transaksi[0]?.totalPayment || 0,
                    transaksi_produk: transaksi_produk || 0,
                    ProdukTanaman: ProdukTanaman || 0,
                    totalTanaman: totalTanaman || 0,
                    ProdukIkan: ProdukIkan || 0,
                    totalIkan: totalIkan || 0,
                    ProdukBurung: ProdukBurung || 0,
                    totalBurung: totalBurung || 0,
                    totalTransaksiOffline: totalTransaksiOffline || 0,
                    totalTransaksiOnline: totalTransaksiOnline || 0,
                };
            };

            const currentMonthData = await fetchTransaksiData(startDate, endDate);
            const prevMonthData = month > 1 ? await fetchTransaksiData(prevStartDate, prevEndDate) : null;

            const perbandingan = prevMonthData
                ? currentMonthData.totalTransactions - prevMonthData.totalTransactions
                : 0;

            statisticsByMonth.push({
                month,
                ...currentMonthData,
                perbandingan
            });
        }

        res.status(200).json({
            year,
            monthlyStatistics: statisticsByMonth,
        });

    } catch (error) {
        console.error('Error fetching yearly statistics:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik tahunan.', error: error.message });
    }
};

module.exports = {
    getYearlyStatistics
};