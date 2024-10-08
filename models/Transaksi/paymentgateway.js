const {DataTypes} = require("sequelize");
const sequelize = require("../../config/database");
const Transaksi = require("./transaksi");

const PaymentGateway = sequelize.define("payment_gateway", {
    id_transaksi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Transaksi,
            key: "id"
        }
    },
    status: {
        type: DataTypes.STRING,
        // allowNull: false
    },
    payment_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.STRING
    },
    order_id : {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

Transaksi.hasMany(PaymentGateway, { foreignKey: "id_transaksi" });
PaymentGateway.belongsTo(Transaksi, { foreignKey: "id_transaksi" });

module.exports = PaymentGateway
