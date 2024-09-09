const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database'); // Import konfigurasi database

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  no_hp : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'super admin', 'kasir'),
    allowNull: false,
    defaultValue: 'user',
  },
<<<<<<< HEAD:models/User/users.js
  alamat: {
    type: DataTypes.STRING, // Alamat disimpan sebagai string
    allowNull: true, // Alamat bisa tidak diisi
  },
  fotoProfil: {
    type: DataTypes.STRING, // URL untuk foto profil
    allowNull: true, // Foto profil bisa tidak diisi
  },
},{
  freezeTableName : true,
  timestamps : true
=======
>>>>>>> eb65d94cefe5edffd1dc05341d98d0381b59c58e:models/users.js
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
  },
});

// Method untuk memvalidasi password
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
