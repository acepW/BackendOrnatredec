const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Transaksi = require("./transaksi");
const Produk = require("../Produk/produk");

const TransaksiProduk = sequelize.define("transaksi_produk", {
    id_transaksi: {
        type: DataTypes.INTEGER,
        references: {
            model: Transaksi,
            key: "id"
        }
    },
    id_produk: {
        type: DataTypes.INTEGER,
        references: {
            model: Produk,
            key: "id"
        }
    },
    jumlah: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true
});

Transaksi.belongsToMany(Produk, { through: TransaksiProduk, foreignKey: "id_transaksi" });
Produk.belongsToMany(Transaksi, { through: TransaksiProduk, foreignKey: "id_produk" });

module.exports = TransaksiProduk;
