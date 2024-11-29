// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/config');
// const User = require('./User/users'); // Pastikan path benar

// const Notification = sequelize.define('notification', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
// //   id_User: {
// //     type: DataTypes.INTEGER,
// //     allowNull: false,
// //     references: {
// //       model: User, // Referensi ke model User
// //       key: 'id',   // Kolom id di tabel User
// //     },
// //   },
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   body: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   isRead: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// }, {
//   freezeTableName: true,
//   timestamps: true,
// });

// // Relasi (Sudah didefinisikan di model User, tidak perlu diulang di sini)
// // User.hasMany(Notification, { foreignKey: 'id_User' });
// // Notification.belongsTo(User, { foreignKey: 'id_User' });

// module.exports = Notification;
