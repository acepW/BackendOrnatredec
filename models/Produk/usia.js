const { DataTypes } = require("sequelize");
const db = require("../../config/database");
const Produk = require('./produk')

const Usia = db.define("usia", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_produk : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Produk,
            key : 'id'
        }
    },
    usia_produk: {
        type: DataTypes.STRING,
        allowNull : false
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    harga : {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    hargaSetelah : {
        type: DataTypes.INTEGER,
        allowNull : false
    }
},{ 
    freezeTableName: true,
    timestamps : true
});

Produk.hasMany(Usia, { foreignKey: 'id_produk' });
Usia.belongsTo(Produk, { foreignKey: 'id_produk' });

module.exports = Usia;
