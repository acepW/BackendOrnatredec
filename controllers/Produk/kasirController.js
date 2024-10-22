const db = require('../../config/database'); // Import konfigurasi database
const Produk = require('../../models/Produk/produk'); // Model Produk
const Kasir = require('../../models/Produk/kasir'); // Model Kasir

const createTransaction = async (req, res) => {
    let transaction;

    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Item produk harus berupa array dan tidak boleh kosong' });
        }

        // Mulai transaksi
        transaction = await db.transaction();

        for (const item of items) {
            const { produkId, quantity } = item;

            // Ambil produk tanpa mengunci
            const produk = await Produk.findOne({
                where: { id: produkId },
                transaction,
            });

            if (!produk) {
                await transaction.rollback();
                return res.status(404).json({ message: `Produk dengan ID ${produkId} tidak ditemukan` });
            }

            // Cek stok apakah cukup
            if (quantity > produk.jumlah) {
                await transaction.rollback();
                return res.status(400).json({ message: `Stok tidak mencukupi untuk produk ${produk.judul_produk}` });
            }

            // Kurangi stok produk
            produk.jumlah -= quantity;

            // Simpan perubahan tanpa kunci
            await produk.save({ transaction });

            // Simpan transaksi di tabel kasir
            await Kasir.create({
                produkId: produkId,
                quantity: quantity
            }, { transaction });
        }

        // Commit transaksi jika semua sukses
        await transaction.commit();
        return res.status(201).json({ message: 'Transaksi berhasil' });

    } catch (error) {
        // Rollback jika terjadi kesalahan
        if (transaction) await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan', error });
    }
};

module.exports = {
    createTransaction
};
// 