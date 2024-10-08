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
        allowNull : true
    },
    deskripsi_produk: {
        type: DataTypes.STRING,
        allowNull : true  
    },
    foto_produk: {
        type: DataTypes.STRING,
        allowNull : true
    },
    harga: {
        type: DataTypes.INTEGER,
        allowNull : true
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull : true
    },
    kategori_produk : {
        type : DataTypes.ENUM('tanaman', 'ikan', 'burung'),
        allowNull : true
    }
}, {
    freezeTableName: true,
    timestamps : true
});


module.exports = Produk;
