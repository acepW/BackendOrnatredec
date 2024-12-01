const {DataTypes} = require('sequelize');
const db = require('../../config/database');
const User = require('../User/users');
const Comments = require('./comments');
const Post = require('./posts');

const Reply = db.define('reply',{
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
    commentId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : Comments,
            key : 'id'
        }
    },
},{
    freezeTableName : true,
    timestamps : true
})

User.hasMany(Reply, {foreignKey: 'userId'});
Reply.belongsTo(User, {foreignKey : 'userId'});

Comments.hasMany(Reply, {foreignKey: 'commentId'});
Reply.belongsTo(Comments, {foreignKey : 'commentId'});

Post.hasMany(Reply, {foreignKey: 'postId'});
Reply.belongsTo(Post, {foreignKey : 'postId'});


module.exports = Reply;