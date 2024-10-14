const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Produk = require("../Produk/produk");
const Variasi = require("../Produk/variasi");
const Subvariasi = require("../Produk/subVariasi");

const TransaksiProduk = sequelize.define("transaksi_produk", {
  id_transaksi: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_produk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Produk,
      key: "id"
    }
  },
  id_variasi: {
    type: DataTypes.INTEGER,
    allowNull: true, // Tidak semua produk punya variasi
    references: {
      model: Variasi,
      key: "id"
    }
  },
  id_subvariasi: {
    type: DataTypes.INTEGER,
    allowNull: true, // Tidak semua produk punya subvariasi
    references: {
      model: Subvariasi,
      key: "id"
    }
  },
  status: {
    type: DataTypes.ENUM("dipesan", "dikemas", "sedang diantar", "selesai"),
    defaultValue: "dipesan"
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalHarga: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true
});

// Relasi dengan Produk, Variasi, dan Subvariasi
Produk.hasMany(TransaksiProduk, { foreignKey: "id_produk" });
Variasi.hasMany(TransaksiProduk, { foreignKey: "id_variasi" });
Subvariasi.hasMany(TransaksiProduk, { foreignKey: "id_subvariasi" });

TransaksiProduk.belongsTo(Produk, { foreignKey: "id_produk" });
TransaksiProduk.belongsTo(Variasi, { foreignKey: "id_variasi" });
TransaksiProduk.belongsTo(Subvariasi, { foreignKey: "id_subvariasi" });

module.exports = TransaksiProduk;
