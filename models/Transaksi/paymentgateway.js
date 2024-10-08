// models/paymentGateway.js
const { DataTypes } = require("sequelize");
const db = require("../config/database");
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
<<<<<<< HEAD
        type: DataTypes.STRING
    },
    order_id : {
        type: DataTypes.STRING
=======
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING, // Atur sesuai status yang dikembalikan Midtrans
        defaultValue: 'pending', // Set default ke 'pending'
>>>>>>> 43f1071696821ce1623125516a4bf9846078e911
    }
}, {
    freezeTableName: true
});

// Definisikan relasi
Transaksi.hasMany(PaymentGateway, { foreignKey: "id_transaksi" });
PaymentGateway.belongsTo(Transaksi, { foreignKey: "id_transaksi" });

module.exports = PaymentGateway;
