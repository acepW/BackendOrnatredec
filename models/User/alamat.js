const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./users');

const Alamat = sequelize.define('alamatt',{
    id : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : User,
            key : 'id'
        }
    },
    provinsi : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    jalan : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    rtrw : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    patokan : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    nama : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    nohp : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    kategori_alamat : {
        type : DataTypes.ENUM('rumah', 'kantor'),
        allowNull : false
    },
    alamatUtama : {
        type : DataTypes.ENUM('aktif', 'mati'),
        allowNull : false
    },
},{ 
    freezeTableName: true,
    timestamps : true
})

User.hasMany(Alamat, { foreignKey: 'userId' });
Alamat.belongsTo(User, { foreignKey: 'userId' });

module.exports = Alamat;