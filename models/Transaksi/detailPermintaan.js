const { DataTypes } = require("sequelize")
const sequelize = require("../../config/database");

const detailPermintaan = sequelize.define('detail_permintaan', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type : DataTypes.INTEGER
    },
    nama_produk: {
        type: DataTypes.STRING,
        allowNull : false
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    hargaSatuan: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull : false
    },
    total: {
        type : DataTypes.STRING,
        allowNull : false
    },
    status: {
        type: DataTypes.ENUM('ya', 'tidak', 'belumDirespon'),
        defaultValue: 'belumDirespon',
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps : true
})

module.exports = detailPermintaan;