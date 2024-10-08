const { Sequelize, DataTypes, INTEGER } = require('sequelize');
const db = require('../../config/database');
const User = require('../User/users');
const Post = require('./posts');

const Comments = db.define('comments',{
    id : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true
    },
    desc : {
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
    postId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Post,
            key : 'id'
        }
    },
    balasan : {
        type : DataTypes.INTEGER,
        allowNull : false,
    }
},{
    freezeTableName : true,
    timestamps : true
})

User.hasMany(Comments, {foreignKey: 'userId'});
Comments.belongsTo(User, {foreignKey : 'userId'});

Post.hasMany(Comments, {foreignKey: 'postId'});
Comments.belongsTo(Post, {foreignKey : 'postId'});

module.exports = Comments;