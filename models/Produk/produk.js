const { DataTypes } = require("sequelize");
const db = require("../../config/database");

const Produk = db.define("produk", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    judul_produk: {
        type: DataTypes.STRING,
        allowNull : false
    },
    deskripsi_produk: {
        type: DataTypes.STRING,
        allowNull : false
    },
    foto_produk: {
        type: DataTypes.STRING,
        allowNull : true
    },
    harga: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    kategori_produk : {
        type : DataTypes.ENUM('tanaman', 'ikan', 'burung'),
        allowNull : false
    }
}, {
    freezeTableName: true
});


module.exports = Produk;
