const {DataTypes} = require("sequelize");
const sequelize = require("../../config/database");
// const Produk = require("./produk");
const Alamat = require("./alamat");

const Transaksi = sequelize.define("transaksi", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_alamat: {
        type: DataTypes.INTEGER,
        references: {
            model: Alamat,
            key: "id"
        }
    },
    sub_total: {
        type: DataTypes.INTEGER
    },
    biaya_layanan: {
        type: DataTypes.INTEGER
    },
    total_pembayaran: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true
});

Alamat.belongsTo(Transaksi, {foreignKey: "id_alamat"});
Transaksi.belongsTo(Alamat, {foreignKey: "id_alamat"});

module.exports = Transaksi;

