const {DataTypes} = require('sequelize');
const db = require('../../config/database');
const Post = require('./posts');
const User = require('../User/users');

const Report = db.define('report',{
    id : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement : true,
    },
    user_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : User,
            key : 'id'
        }
    },
    id_post : {
        type : DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key : 'id'
        }
    },
    desc_report : {
        type : DataTypes.STRING,
        allowNull : false
    }
},{
    freezeTableName : true,
    timestamps: true,
})

Post.hasMany(Report, {foreignKey: 'id_post'});
Report.belongsTo(Post, {foreignKey : 'id_post'});

module.exports = Report;