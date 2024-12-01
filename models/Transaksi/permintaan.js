const { DataTypes } = require("sequelize")
const sequelize = require("../../config/config");
const User = require("../User/users");

const Permintaan = sequelize.define('permintaan', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    nama_petugas: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: true
})

User.hasMany(Permintaan, { foreignKey: 'userId' });
Permintaan.belongsTo(User, { foreignKey: 'userId' });

module.exports = Permintaan;