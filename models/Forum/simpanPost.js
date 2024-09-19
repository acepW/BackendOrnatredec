const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const Post = require('./posts');
const User = require('../User/users');

const simpanPost = db.define('simpanPost',{
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
    postId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Post,
            key : 'id'
        }
    },
},{
    freezeTableName : true,
    timestamps : true,
})

User.hasMany(simpanPost, {foreignKey: 'userId'});
simpanPost.belongsTo(User, {foreignKey : 'userId'});

Post.hasMany(simpanPost, {foreignKey: 'postId'});
simpanPost.belongsTo(Post, {foreignKey : 'postId'});

module.exports = simpanPost;