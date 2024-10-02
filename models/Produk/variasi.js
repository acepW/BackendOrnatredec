const { DataTypes } = require("sequelize");
const db = require("../../config/database");
const Produk = require("./produk")

const Variasi = db.define("variasi", {
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
    nama_variasi: {
        type: DataTypes.STRING,
        allowNull :true
    },
}, {
    freezeTableName: true,
    timestamps : true
});

Produk.hasMany(Variasi, { foreignKey: 'id_produk' });
Variasi.belongsTo(Produk, { foreignKey: 'id_produk' });

module.exports = Variasi;
