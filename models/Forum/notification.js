const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/config');

const Notification = sequelize.define('Notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Belum dibaca
  },
  referenceId: { // ID referensi untuk komentar atau post terkait
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  referenceType: { // Menyimpan tipe referensi, misalnya 'comment', 'post'
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true, // Menggunakan nama tabel yang sesuai dengan model
  timestamps: true, // Menambahkan timestamps (createdAt, updatedAt)
});

module.exports = Notification;
