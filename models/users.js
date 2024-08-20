const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/koneksi');

const Users = db.define('user',{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    username : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    no_telp : {
        type : DataTypes.STRING,
        allowNull : false
    },
    alamat : {
        type : DataTypes.STRING,
        allowNull : true
    },
},{
    freezeTableName : true,
    timestamps : true
})

module.exports = Users;