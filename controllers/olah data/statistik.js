const sequelize = require('../../config/database'); // Sesuaikan path dengan konfigurasi database
const Transaksi = require('../../models/Transaksi/transaksi');
const { Op } = require('sequelize');
const TransaksiProduk = require('../../models/Transaksi/transaksiproduk');
const Produk = require('../../models/Produk/produk');

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

    try {
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
            return transaksi[0];
        };
        const transaksi_produk = await TransaksiProduk.sum('jumlah',{
                 where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    }
                },
          })
        const statusTanaman = 'tanaman';
        const ProdukTanaman = await TransaksiProduk.sum('jumlah',{
                include: {
                    model: Produk,
                    where: {
                        kategori_produk: statusTanaman
                },
                    attributes: [] 
                },
                    where: {
                        createdAt: {
                            [Op.between]: [startDate, endDate],
                        }
                    },
            })
        const totalTanaman = await TransaksiProduk.sum('totalHarga',{
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
        const statusIkan = 'ikan';
        const ProdukIkan = await TransaksiProduk.sum('jumlah',{
            include: {
                model: Produk,
                where: {
                 kategori_produk: statusIkan
        },
            },
                 where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    }
                },
        })
         const totalIkan = await TransaksiProduk.sum('totalHarga',{
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
        
        const statusBurung = 'burung';
        const ProdukBurung = await TransaksiProduk.sum('jumlah',{
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
         const totalBurung = await TransaksiProduk.sum('totalHarga',{
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
        
        const [currentMonthData, previousMonthData] = await Promise.all([
            fetchTransaksiData(startDate, endDate),
            fetchTransaksiData(prevStartDate, prevEndDate),
        ]);

        const currentTotalTransactions = parseInt(currentMonthData.totalTransactions, 10) || 0;
        const currentTotalSubTotal = parseInt(currentMonthData.totalSubTotal, 10) || 0;
        const currentTotalServiceFee = parseInt(currentMonthData.totalServiceFee, 10) || 0;
        const currentTotalPayment = parseInt(currentMonthData.totalPayment, 10) || 0;

        const previousTotalTransactions = parseInt(previousMonthData.totalTransactions, 10) || 0;

        const totalTransactionsDifference = currentTotalTransactions - previousTotalTransactions;

        res.status(200).json({
            currentMonth: {
                month,
                year,
                totalTransaksi: currentTotalTransactions,
                totalSubTotal: currentTotalSubTotal,
                totalBiayaLayanan: currentTotalServiceFee,
                totalPembayaran: currentTotalPayment,
            },
            totalProdukTerjual: transaksi_produk,
            totalProdukTanaman: ProdukTanaman,
            totalProdukIkan: ProdukIkan,
            totalProdukBurung: ProdukBurung,
            totalHargaTanaman: totalTanaman,
            totalHargaBurung: totalBurung,
            totalHargaIkan: totalIkan,
            previousMonth: {
                month: prevMonth,
                year: prevYear,
                totalTransaksi: previousTotalTransactions,
            },
            comparison: {
                totalTransactionsDifference,
            }
        });

    } catch (error) {
        console.error('Error fetching monthly statistics:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik bulanan.', error: error.message });
    }
};
module.exports = {
    getMonthlyStatistics
}