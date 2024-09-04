const { Sequelize } = require("sequelize");

const db = new Sequelize("new_produk","root","", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = db;
