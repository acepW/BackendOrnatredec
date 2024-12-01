const { DataTypes } = require("sequelize")
const sequelize = require("../../config/config");
const User = require("../User/users");

const pPengeluaran = sequelize.define('pPengeluaran', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    nama_petugas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subTotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nama_penjual: {
        type: DataTypes.STRING,
        allowNull: false
    },
    no_penjual: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kategori_produk: {
        type: DataTypes.ENUM('tanaman', 'ikan', 'burung'),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
})

User.hasMany(pPengeluaran, { foreignKey: 'userId' });
pPengeluaran.belongsTo(User, { foreignKey: 'userId' });

module.exports = pPengeluaran;