const sequelize = require('../../config/config'); // Sesuaikan path dengan konfigurasi database
const Transaksi = require('../../models/Transaksi/transaksi');
const { Op } = require('sequelize');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk');
const Produk = require('../../models/Produk/produk');
const getYearlyStatistics = async (req, res) => {
    const { year } = req.params;

    if (!year || isNaN(year)) {
        return res.status(400).json({ message: 'Tahun harus valid.' });
    }

    const monthlyStatistics = [];

    try {
        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const prevStartDate = new Date(year, month - 2, 1);
            const prevEndDate = new Date(year, month - 1, 0);

            const fetchTransactionData = async (startDate, endDate) => {
                const result = await Transaksi.findAll({
                    attributes: [
                        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
                        [sequelize.fn('SUM', sequelize.col('sub_total')), 'totalSubTotal'],
                        [sequelize.fn('SUM', sequelize.col('biaya_layanan')), 'totalServiceFee'],
                        [sequelize.fn('SUM', sequelize.col('total_pembayaran')), 'totalPayment']
                    ],
                    where: {
                        createdAt: {
                            [Op.between]: [startDate, endDate],
                        }
                    },
                    raw: true,
                });
                return {
                    totalTransactions: parseInt(result[0]?.totalTransactions, 10) || 0,
                    totalSubTotal: parseInt(result[0]?.totalSubTotal, 10) || 0,
                    totalServiceFee: parseInt(result[0]?.totalServiceFee, 10) || 0,
                    totalPayment: parseInt(result[0]?.totalPayment, 10) || 0
                };
            };

            const currentMonthData = await fetchTransactionData(startDate, endDate);
            const prevMonthData = month > 1 ? await fetchTransactionData(prevStartDate, prevEndDate) : null;

            const transactionsDifference = prevMonthData
                ? currentMonthData.totalTransactions - prevMonthData.totalTransactions
                : 0;

            monthlyStatistics.push({
                month,
                ...currentMonthData,
                differences: {
                    transactionsDifference
                }
            });
        }

        res.status(200).json({
            year,
            monthlyStatistics
        });

    } catch (error) {
        console.error('Error fetching yearly statistics with comparison:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik tahunan.', error: error.message });
    }
};




module.exports = {
    getYearlyStatistics
};
//cobaa