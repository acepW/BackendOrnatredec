const { DataTypes } = require("sequelize")
const sequelize = require("../../config/database");
const pPengeluaran = require("./petugasPengeluaran");

const Pengeluaran = sequelize.define('pengeluaran', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type : DataTypes.INTEGER
    },
    id_pengeluaran: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: pPengeluaran,
            key : 'id'
        }
    },
    nama_produk: {
        type: DataTypes.STRING,
        allowNull : false
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    harga_satuan: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull : false
    }
}, {
    freezeTableName: true,
    timestamps : true
})

pPengeluaran.hasMany(Pengeluaran, { foreignKey: "id_pengeluaran" })
Pengeluaran.hasMany(pPengeluaran, { foreignKey: "id_pengeluaran" })

module.exports = Pengeluaran;