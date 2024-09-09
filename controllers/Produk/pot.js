const Pot = require("../../models/Produk/variasi");

const createPot = async(req, res) => {
    const {warna_pot, stok} = req.body;

    try {
        const pot = await Pot.create({
            warna_pot,
            stok
        });
        res.status(200).json(pot);
    } catch (error) {
        console.log(error);
    }
};

const getAllPot = async(req, res) => {
    try {
        const pot = await Pot.findAll();
        res.status(200).json(pot);
    } catch (error) {
        console.log(error);
    }
};

const getPotById = async(req, res) => {
    try {
        const pot = await Pot.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(pot);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createPot,
    getAllPot,
    getPotById
}
