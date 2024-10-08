const { DataTypes } = require("sequelize");
const db = require("../../config/database");
const Transaksi = require("./transaksi");

const PaymentGateway = db.define("payment_gateway", {
    id_transaksi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Transaksi,
            key: "id"
        }
    },
    order_id: {
        type: DataTypes.STRING, // Pastikan tipe datanya string
        allowNull: false,
    },
    payment_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING
    },
    order_id : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING, // Atur sesuai status yang dikembalikan Midtrans
        defaultValue: 'pending', // Set default ke 'pending'
    }
}, {
    freezeTableName: true
});

// Definisikan relasi
Transaksi.hasMany(PaymentGateway, { foreignKey: "id_transaksi" });
PaymentGateway.belongsTo(Transaksi, { foreignKey: "id_transaksi" });

module.exports = PaymentGateway;
