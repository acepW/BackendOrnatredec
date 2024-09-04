const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Usia = require("./usia");
const Pot = require("./pot");

const Produk = db.define("produk", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    judul_produk: {
        type: DataTypes.STRING,
    },
    deskripsi_produk: {
        type: DataTypes.STRING
    },
    foto_produk: {
        type: DataTypes.STRING
    },
    harga: {
        type: DataTypes.INTEGER
    },
    id_usia: {
        type: DataTypes.INTEGER,
        references: {
            model: Usia,
            key: "id"
        }
    },
    id_pot: {
        type: DataTypes.INTEGER,
        references: {
            model: Pot,
            key: "id"
        }
    },
    jumlah: {
        type: DataTypes.INTEGER
    },
}, {
    freezeTableName: true
});

Usia.hasMany(Produk, { foreignKey: "id_usia", as: "usia" });
Pot.hasMany(Produk, { foreignKey: "id_pot" });
Produk.belongsTo(Usia, { foreignKey: "id_usia", as: "usia" });
Produk.belongsTo(Pot, { foreignKey: "id_pot" });

module.exports = Produk
