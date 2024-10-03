const {DataTypes} = require("sequelize");
const sequelize = require("../../config/database");
const User = require("../User/users");

const Alamat = sequelize.define("alamat", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : User,
            key : 'id'
        }
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    kota_kabupaten: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    kecamatan: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    kelurahan_desa: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    jalan_namagedung: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    rtrw: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    patokan: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    nama_penerima: {
        type: DataTypes.STRING,
        allowNull : false,
    },
    no_hp: {
        type: DataTypes.INTEGER,
        allowNull : false,
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

User.hasMany(Alamat, { foreignKey: 'userId' });
Alamat.belongsTo(User, { foreignKey: 'userId' });

module.exports = Alamat; 
