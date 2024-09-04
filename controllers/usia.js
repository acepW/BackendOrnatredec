const Usia = require("../models/usia");

const createUsia = async(req, res) => {
    const {usia_produk, stok} = req.body;

    try {
        const usia = await Usia.create({
            usia_produk,
            stok
        });
        res.status(200).json(usia);
    } catch (error) {
        console.log(error);
    }
};

const getAllUsia = async(req, res) => {
    try {
        const usia = await Usia.findAll();
        res.status(200).json(usia);
    } catch (error) {
        console.log(error);
    }
};

const getUsiaById = async(req, res) => {
    try {
        const usia = await Usia.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(usia);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createUsia,
    getAllUsia,
    getUsiaById
}
