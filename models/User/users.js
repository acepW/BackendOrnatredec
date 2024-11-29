const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../config/config'); // Import konfigurasi database
const Notification = require('../../models/notif'); // Import model Notification
const Alamat = require('../Transaksi/alamat');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  no_hp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'super admin', 'kasir'),
    allowNull: false,
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photoProfile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggalLahir: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('terblokir', 'tidak terblokir'),
    allowNull: false,
    defaultValue: 'tidak terblokir',
  },
  statusAktif: {
    type: DataTypes.ENUM('aktif', 'tidak aktif'),
    allowNull: false,
    defaultValue: 'aktif',
  },
}, {
  freezeTableName: true,
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
  },
});

// Relasi User dengan Notification


// Alamat.hasMany(User, { foreignKey: 'userId' });
// User.belongsTo(Alamat, { foreignKey: 'userId' });

module.exports = User;
