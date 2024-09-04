<<<<<<< HEAD
const {Sequelize} = require('sequelize');
const dotenv = require('dotenv')
dotenv.config();

const sequelize = new Sequelize (process.env.DB_NAME, process.env.nama,  process.env.PASSWORD,{ 
    host : process.env.HOST,
    dialect : 'mysql'
})

module.exports = sequelize;
=======
const { Sequelize } = require("sequelize");

const db = new Sequelize("new_produk","root","", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = db;
>>>>>>> 5a3f5b356f9fd3a030aeb3c4382ad68e7756fd97
