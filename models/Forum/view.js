const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
const User = require('../User/users.js');
const Posts = require('./posts.js');

const View = db.define('view', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    jumlahView : {
        type: DataTypes.STRING,
        allowNull : true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'id'
        }
    },
    postId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Posts, 
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    timestamps: true
});


User.hasMany(View, { foreignKey: 'userId' });
View.belongsTo(User, { foreignKey: 'userId' });

Posts.hasMany(View, { foreignKey: 'postId' });
View.belongsTo(Posts, { foreignKey: 'postId' });

module.exports = View;

