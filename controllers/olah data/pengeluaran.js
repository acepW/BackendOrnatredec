const Pengeluaran = require("../../models/Transaksi/pengeluaran");
const pPengeluaran = require("../../models/Transaksi/petugasPengeluaran");
const Transaksi = require("../../models/Transaksi/transaksi");
const moment = require("moment")
const Op = require("sequelize")

const createPengeluaran = async (req, res) => {
    const { nama_petugas, pengeluaran } = req.body;
    try {
        let jumlahTotal = 0;
        const pengeluaranBaru = await pPengeluaran.create({
            nama_petugas: nama_petugas,
            subTotal : jumlahTotal
        })

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
                 console.log(jumlahTotal);
             }
      }
     
  await pengeluaranBaru.update({
    subTotal: jumlahTotal,
  });
        
   res.status(200).json(pengeluaranBaru);
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

const reportPerbulan = async (req, res) => {

  try {
    const { bulan, tahun } = req.query;

    if (!bulan || !tahun) {
      return res.status(400).json({ message: 'tolong input bulan dan tahun' });
    }

    const startDate = new Date(`${tahun}-${bulan}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);       

    // const { month: prevMonth, year: prevYear } = getPreviousMonthYear(month, year);
    // const prevStartDate = new Date(prevYear, prevMonth - 1, 1);
    // const prevEndDate = new Date(prevYear, prevMonth, 0);

    const transaksi = await Transaksi.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    const pengeluaran = await pPengeluaran.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
        },
        include: [
            {
                model: Pengeluaran
            }
        ]
    });
      
      if (transaksi.length === 0 || pengeluaran.length === 0) {
        return res.status(404).json({ message: 'Tidak ada data untuk bulan dan tahun yang diberikan.' });
        }

      
    const totalTransaksiPerbulan = transaksi.reduce((sum, transaksiBulan) => sum + transaksiBulan.total_pembayaran, 0);
    const Pemasukkan = transaksi.length;
    const totalPengeluaranPerbulan = pengeluaran.reduce((sum, pengeluaranbulan) => sum + pengeluaranbulan.subTotal, 0);
    const totalPengeluaran = pengeluaran.length;

    const reportData = {
      month: moment(startDate).format('MMMM YYYY'),
      totalTransaksiPerbulan,
      Pemasukkan,
      Transaksi: transaksi,
      totalPengeluaranPerbulan,
      totalPengeluaran,
      Pengeluaran : pengeluaran
    };

    return res.status(200).json(reportData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createPengeluaran,
    reportPerbulan
}