const { DataTypes } = require('sequelize');
const db = require('../../config/database');
const Produk = require('./produk'); // Import model Produk

// Model Kasir
const Kasir = db.define('kasir', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    produkId: {
        type: DataTypes.INTEGER,
        references: {
            model: Produk, // Referensi ke model Produk
            key: 'id'
        },
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true, // Pastikan nama tabel tidak berubah
    timestamps: true
});

// Setelah transaksi kasir dibuat, kurangi jumlah stok produk
Kasir.afterCreate(async (kasir, options) => {
    const produk = await Produk.findByPk(kasir.produkId);
    
    if (produk) {
        produk.jumlah -= kasir.quantity;
        await produk.save();
    }
});

Kasir.belongsTo(Produk, { foreignKey: 'produkId' });

module.exports = Kasir;
