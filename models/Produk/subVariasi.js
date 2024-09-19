const { DataTypes } = require("sequelize");
const db = require("../../config/database");
const Produk = require("./produk");
const Variasi = require("./variasi");

const subVariasi = db.define("subvariasi", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_produk : {
        type: DataTypes.INTEGER,
        allowNull :false,
           references: {
           model: Produk,
           key: "id"
                }
     },
     id_variasi : {
        type: DataTypes.INTEGER,
        allowNull :false,
           references: {
           model: Variasi,
           key: "id"
                }
     },
    foto_variasi : {
        type: DataTypes.STRING,
        allowNull :false
    },
    nama_variasi: {
        type: DataTypes.STRING,
        allowNull :false
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull :false
    }
}, {
    freezeTableName: true,
    timestamps : true
});

Produk.hasMany(subVariasi, { foreignKey: 'id_produk' });
subVariasi.belongsTo(Produk, { foreignKey: 'id_produk' });

Variasi.hasMany(subVariasi, { foreignKey: 'id_variasi' });
subVariasi.belongsTo(Variasi, { foreignKey: 'id_variasi' });

module.exports = subVariasi;
