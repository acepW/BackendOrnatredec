const {DataTypes} = require("sequelize");
const sequelize = require("../../config/database");

const Alamat = sequelize.define("alamat", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    provinsi: {
        type: DataTypes.STRING,
    },
    kota_kabupaten: {
        type: DataTypes.STRING
    },
    kecamatan: {
        type: DataTypes.STRING
    },
    kelurahan_desa: {
        type: DataTypes.STRING
    },
    jalan_namagedung: {
        type: DataTypes.STRING
    },
    unit_lantai: {
        type: DataTypes.STRING
    },
    patokan: {
        type: DataTypes.STRING
    },
    nama_penerima: {
        type: DataTypes.STRING
    },
    no_hp: {
        type: DataTypes.INTEGER
    },
    kategori_alamat: {
        type: DataTypes.ENUM,
        values: ["Rumah", "Kantor"]
    },
    alamat_pengiriman_utama: {
        type: DataTypes.ENUM,
        values: ["Aktif", "Non-Aktif"]
    }
}, {
    freezeTableName: true
});

module.exports = Alamat; 
