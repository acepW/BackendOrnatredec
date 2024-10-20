const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Produk = require("../Produk/produk");
const User = require("../User/users");
const Alamat = require("./alamat");
const TransaksiProduk = require("./transaksiproduk");

const Transaksi = sequelize.define("transaksi", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "id"
        }
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

Alamat.belongsTo(Transaksi, { foreignKey: "id_alamat" });
Transaksi.belongsTo(Alamat, { foreignKey: "id_alamat" });

User.hasMany(Transaksi, { foreignKey: "user_id" });
Transaksi.belongsTo(User, { foreignKey: "user_id" });

Transaksi.belongsToMany(Produk, { through: TransaksiProduk, foreignKey: 'id_transaksi' });
Produk.belongsToMany(Transaksi, { through: TransaksiProduk, foreignKey: 'id_produk' });

Transaksi.belongsToMany(Produk, { through: TransaksiProduk, foreignKey: 'id_transaksi' });
Produk.belongsToMany(Transaksi, { through: TransaksiProduk, foreignKey: 'id_produk' });

module.exports = Transaksi;