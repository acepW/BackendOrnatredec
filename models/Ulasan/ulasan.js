const { DataTypes } = require('sequelize');
const db = require('../../config/database');
const Produk = require('../Produk/produk');
const User = require('../User/users');

const Ulasan = db.define('ulasan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_produk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produk,
            key: 'id'
        }
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    komentar: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true
});

// Definisi relasi antara Ulasan, Produk, dan User
Produk.hasMany(Ulasan, { foreignKey: 'id_produk' }); // Satu produk bisa memiliki banyak ulasan
Ulasan.belongsTo(Produk, { foreignKey: 'id_produk' }); // Satu ulasan terkait dengan satu produk

User.hasMany(Ulasan, { foreignKey: 'id_user' }); // Satu user bisa memberikan banyak ulasan
Ulasan.belongsTo(User, { foreignKey: 'id_user' }); // Satu ulasan terkait dengan satu user

module.exports = Ulasan;
