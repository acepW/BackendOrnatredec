// models/Transaksi/transaksi_produk.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Transaksi = require("./transaksi");
const Produk = require("../Produk/produk");
const Variasi = require("../Produk/variasi");
const Subvariansi = require("../Produk/subVariasi");
const User = require("../User/users");
const Alamat = require("./alamat");

const TransaksiProduk = sequelize.define("transaksi_produk", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_transaksi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Transaksi,
            key: "id",
        },
    },
    id_produk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produk,
            key: "id",
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "id",
        },
    },
    id_alamat: {
        type: DataTypes.INTEGER,
        references: {
            model: Alamat,
            key: "id",
        },
    },
    id_variasi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Variasi,
            key: "id",
        },
    },
    id_subvariasi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Subvariansi,
            key: "id",
        },
    },
    status: {
        type: DataTypes.ENUM("dipesan", "dikemas", "dikirim", "selesai"),
        defaultValue: "dipesan",
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalHarga: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: true,
});

// Relasi dengan model lainnya
Produk.hasMany(TransaksiProduk, { foreignKey: "id_produk" });
Transaksi.hasMany(TransaksiProduk, { foreignKey: "id_transaksi" });
Variasi.hasMany(TransaksiProduk, { foreignKey: "id_variasi" });
Subvariansi.hasMany(TransaksiProduk, { foreignKey: "id_subvariasi" });
User.hasMany(TransaksiProduk, { foreignKey: "user_id" });
Alamat.hasMany(TransaksiProduk, { foreignKey: "id_alamat" });

TransaksiProduk.belongsTo(Produk, { foreignKey: "id_produk" });
TransaksiProduk.belongsTo(Transaksi, { foreignKey: "id_transaksi" });
TransaksiProduk.belongsTo(Variasi, { foreignKey: "id_variasi" });
TransaksiProduk.belongsTo(Subvariansi, { foreignKey: "id_subvariasi" });
TransaksiProduk.belongsTo(User, { foreignKey: "user_id" });
TransaksiProduk.belongsTo(Alamat, { foreignKey: "id_alamat" });

module.exports = TransaksiProduk;
