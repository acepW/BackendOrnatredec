const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Usia = db.define("usia", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usia_produk: {
        type: DataTypes.STRING
    },
    stok: {
        type: DataTypes.INTEGER
    }
},{ freezeTableName: true
});

module.exports = Usia;
