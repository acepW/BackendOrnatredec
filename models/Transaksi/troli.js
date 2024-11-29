const { DataTypes } = require("sequelize");
const db = require("../../config/database");
const Produk = require("../Produk/produk");
const Variasi = require("../Produk/variasi");
const subVariasi = require("../Produk/subVariasi");
const User = require("../User/users");
const Alamat = require("../Transaksi/alamat");

const Troli = db.define('troli', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    id_User: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    id_alamat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Alamat,
            key: 'id'
        }
    },
    id_produk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produk,
            key: 'id'
        }
    },
    id_variasi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Variasi,
            key: 'id'
        }
    },
    id_subVariasi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: subVariasi,
            key: 'id'
        }
    },
    jumlahStok: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps : true,
});

User.hasMany(Troli, { foreignKey: 'id_User' });
Troli.belongsTo(User, { foreignKey: 'id_User' });

Produk.hasMany(Troli, { foreignKey: 'id_produk' });
Troli.belongsTo(Produk, { foreignKey: 'id_produk' });

Variasi.hasMany(Troli, { foreignKey: 'id_variasi' });
Troli.belongsTo(Variasi, { foreignKey: 'id_variasi' });

subVariasi.hasMany(Troli, { foreignKey: 'id_subVariasi' });
Troli.belongsTo(subVariasi, { foreignKey: 'id_subVariasi' });

Alamat.hasMany(Troli, { foreignKey: 'id_alamat' });
Troli.belongsTo(Alamat, { foreignKey: 'id_alamat' });

module.exports = Troli;