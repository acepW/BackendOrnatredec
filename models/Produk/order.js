// const { DataTypes } = require('sequelize');
// const db = require('../../config/database');
// const Produk = require('./produk');
// const Variasi = require('./variasi');
// const Subvariasi = require('./subVariasi');

// const Order = db.define('order', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     id_produk: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: Produk,
//             key: 'id'
//         }
//     },
//     id_variasi: {
//         type: DataTypes.INTEGER,
//         allowNull: true, // Tidak semua produk punya variasi
//         references: {
//             model: Variasi,
//             key: 'id'
//         }
//     },
//     id_subvariasi: {
//         type: DataTypes.INTEGER,
//         allowNull: true, // Tidak semua produk punya subvariasi
//         references: {
//             model: Subvariasi,
//             key: 'id'
//         }
//     },
//     status: {
//         type: DataTypes.ENUM('dipesan', 'dikemas', 'sedang diantar', 'selesai'),
//         defaultValue: 'dipesan'
//     },
//     jumlah: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     totalHarga: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     }
// }, {
//     freezeTableName: true,
//     timestamps: true
// });

// Produk.hasMany(Order, { foreignKey: 'id_produk' });
// Variasi.hasMany(Order, { foreignKey: 'id_variasi' });
// Subvariasi.hasMany(Order, { foreignKey: 'id_subvariasi' });

// Order.belongsTo(Produk, { foreignKey: 'id_produk' });
// Order.belongsTo(Variasi, { foreignKey: 'id_variasi' });
// Order.belongsTo(Subvariasi, { foreignKey: 'id_subvariasi' });

// module.exports = Order;
