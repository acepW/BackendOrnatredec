const sequelize = require('../../config/database'); // Sesuaikan path dengan konfigurasi database
const Transaksi = require('../../models/Transaksi/transaksi');
const { Op } = require('sequelize');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk');
const Produk = require('../../models/Produk/produk');
const getYearlyStatistics = async (req, res) => {
    const { year } = req.params;

<<<<<<< HEAD
// Fungsi untuk mendapatkan bulan dan tahun sebelumnya
const getPreviousMonthYear = (month, year) => {
    let prevMonth = parseInt(month, 10) - 1;
    let prevYear = parseInt(year, 10);

    if (prevMonth === 0) {
        prevMonth = 12;
        prevYear -= 1;
    }

    return { month: prevMonth, year: prevYear };
};

const getMonthlyStatistics = async (req, res) => {
    const { month, year } = req.params;

    if (!month || !year || isNaN(month) || isNaN(year)) {
        return res.status(400).json({ message: 'Bulan dan tahun harus valid.' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const { month: prevMonth, year: prevYear } = getPreviousMonthYear(month, year);
    const prevStartDate = new Date(prevYear, prevMonth - 1, 1);
    const prevEndDate = new Date(prevYear, prevMonth, 0);
=======
    if (!year || isNaN(year)) {
        return res.status(400).json({ message: 'Tahun harus valid.' });
    }

    const statisticsByMonth = [];
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
>>>>>>> dc39ca93a8993c6b142637f7dc0c532bdf537679

    try {
        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

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
                return transaksi[0] || {};
            };

            const currentMonthData = await fetchTransaksiData(startDate, endDate);
            const totalTransactions = parseInt(currentMonthData.totalTransactions, 10) || 0;
            const totalSubTotal = parseInt(currentMonthData.totalSubTotal, 10) || 0;
            const totalServiceFee = parseInt(currentMonthData.totalServiceFee, 10) || 0;
            const totalPayment = parseInt(currentMonthData.totalPayment, 10) || 0;

            statisticsByMonth.push({
                month,
                totalTransactions,
                totalSubTotal,
                totalServiceFee,
                totalPayment,
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
<<<<<<< HEAD
module.exports = {
    getMonthlyStatistics
}
=======


module.exports = {
    getYearlyStatistics
};
//cobaa
>>>>>>> dc39ca93a8993c6b142637f7dc0c532bdf537679
