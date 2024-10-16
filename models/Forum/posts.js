const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const User = require('../User/users');

const Post = db.define('post',{
    id : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    judul : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    desc : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    fotoKonten : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : User,
            key : 'id'
        }
    },
    kategori_forum : {
        type : DataTypes.ENUM('tanaman', 'ikan', 'burung'),
        allowNull : false
    },
    jumlahTanggapan : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    jumlahView : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    jumlahReport : {
        type : DataTypes.STRING,
        allowNull : false,
    }
},{
    freezeTableName : true,
    timestamps : true
})

User.hasMany(Post, {foreignKey: 'userId'});
Post.belongsTo(User, {foreignKey : 'userId'});

module.exports = Post;