const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Pot = db.define("pot", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    warna_pot: {
        type: DataTypes.STRING,
    },
    stok: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true
});

module.exports = Pot;
