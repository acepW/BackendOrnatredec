const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database'); // Import konfigurasi database

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
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
    type: DataTypes.STRING, // Alamat disimpan sebagai string
    allowNull: true, // Alamat bisa tidak diisi
  },
  fotoProfil: {
    type: DataTypes.STRING, // URL untuk foto profil
    allowNull: true, // Foto profil bisa tidak diisi
  },

  tanggalLahir: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status : {
    type : DataTypes.ENUM ('terblokir', 'tidak terblokir'),
    allowNull : false,
    defaultValue : 'tidak terblokir' 
  },
  statusAktif : {
    type : DataTypes.ENUM ('aktif', 'tidak aktif'),
    allowNull : false,
    defaultValue : 'aktif'
  }
  // backgroundProfile: {
  //   type: DataTypes.STRING, // URL untuk background foto profil
  //   allowNull: true, // Foto profil bisa tidak diisi
  // },

},{
  freezeTableName : true,
  timestamps : true
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
  },
});

module.exports = User;
