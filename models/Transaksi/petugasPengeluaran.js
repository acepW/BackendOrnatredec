const { DataTypes } = require("sequelize")
const sequelize = require("../../config/database")

const pPengeluaran = sequelize.define('pPengeluaran', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type : DataTypes.INTEGER
    },
    nama_petugas: {
        type: DataTypes.STRING,
        allowNull : false
    },
    subTotal: {
        type: DataTypes.STRING,
        allowNull : false
    }
}, {
    freezeTableName: true,
    timestamps : true
})

module.exports = pPengeluaran;