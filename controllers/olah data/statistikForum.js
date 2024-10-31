const db = require("../../config/database"); // Instance database
const Post = require("../../models/Forum/posts");

const getForumPostStatisticsPerYear = async (req, res) => {
    try {
        // Ambil parameter tahun dari request
        const year = req.params.year;

        // Ambil data per bulan untuk tahun yang diminta
        const posts = await Post.findAll({
            attributes: [
                [db.fn('MONTH', db.col('createdAt')), 'month'], // Grup berdasarkan bulan
                [db.fn('COUNT', db.col('id')), 'totalPosts']
            ],
            where: db.where(db.fn('YEAR', db.col('createdAt')), year), // Filter berdasarkan tahun
            group: ['month'],
            order: [[db.fn('MONTH', db.col('createdAt')), 'ASC']]
        });

        // Struktur data dalam bentuk { bulan: jumlahPostingan }
        const dataPerBulan = posts.map(post => ({
            bulan: post.get('month'),
            jumlahPostingan: post.get('totalPosts')
        }));

        res.status(200).json(dataPerBulan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getForumPostStatisticsPerYear
};
