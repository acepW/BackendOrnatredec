const db = require("../../config/database"); // Instance database
const Post = require("../../models/Forum/posts");
const { Op } = require("sequelize");

// Statistik per tahun (semua bulan)
const getForumPostStatisticsForYear = async (req, res) => {
    try {
        const { year } = req.params;

        if (!year || isNaN(year)) {
            return res.status(400).json({ message: 'Tahun harus valid.' });
        }

        const posts = await Post.findAll({
            attributes: [
                [db.fn('MONTH', db.col('createdAt')), 'month'],
                [db.fn('YEAR', db.col('createdAt')), 'year'],
                [db.fn('COUNT', db.col('id')), 'totalPosts']
            ],
            where: {
                [Op.and]: [
                    db.where(db.fn('YEAR', db.col('createdAt')), year)
                ]
            },
            group: ['year', 'month'],
            order: [[db.fn('YEAR', db.col('createdAt')), 'ASC'], [db.fn('MONTH', db.col('createdAt')), 'ASC']]
        });
        const kategoriTanaman = "tanaman";
        const postsTanaman = await Post.findAll({
            attributes: [
                [db.fn('MONTH', db.col('createdAt')), 'month'],
                [db.fn('YEAR', db.col('createdAt')), 'year'],
                [db.fn('COUNT', db.col('id')), 'totalPostsTanaman']
            ],
            where: {
                [Op.and]: [
                    db.where(db.fn('YEAR', db.col('createdAt')), year)
                ], kategori_forum : kategoriTanaman
            },
            group: ['year', 'month'],
            order: [[db.fn('YEAR', db.col('createdAt')), 'ASC'], [db.fn('MONTH', db.col('createdAt')), 'ASC']]
        });

         const kategoriIkan = "ikan";
        const postsIkan = await Post.findAll({
            attributes: [
                [db.fn('MONTH', db.col('createdAt')), 'month'],
                [db.fn('YEAR', db.col('createdAt')), 'year'],
                [db.fn('COUNT', db.col('id')), 'totalPostsIkan']
            ],
            where: {
                [Op.and]: [
                    db.where(db.fn('YEAR', db.col('createdAt')), year)
                ], kategori_forum : kategoriIkan
            },
            group: ['year', 'month'],
            order: [[db.fn('YEAR', db.col('createdAt')), 'ASC'], [db.fn('MONTH', db.col('createdAt')), 'ASC']]
        });

        const kategoriBurung = "burung";
        const postsBurung = await Post.findAll({
            attributes: [
                [db.fn('MONTH', db.col('createdAt')), 'month'],
                [db.fn('YEAR', db.col('createdAt')), 'year'],
                [db.fn('COUNT', db.col('id')), 'totalPostsBurung']
            ],
            where: {
                [Op.and]: [
                    db.where(db.fn('YEAR', db.col('createdAt')), year)
                ], kategori_forum : kategoriBurung
            },
            group: ['year', 'month'],
            order: [[db.fn('YEAR', db.col('createdAt')), 'ASC'], [db.fn('MONTH', db.col('createdAt')), 'ASC']]
        });
        const dataPerBulan = [];

    for (let month = 1; month <= 12; month++) {
        const postForMonth = posts.find(post => post.get('month') === month);
        const postTanamanPerbulan = postsTanaman.find(post => post.get('month') === month);
        const postIkanPerbulan = postsIkan.find(post => post.get('month') === month);
        const postBurungPerbulan = postsBurung.find(post => post.get('month') === month);

        dataPerBulan.push({
            month,
            totalPosts: postForMonth ? parseInt(postForMonth.get('totalPosts'), 10) : null,
            totalTanaman: postTanamanPerbulan ? parseInt(postTanamanPerbulan.get('totalPostsTanaman'), 10) : null,
            totalIkan: postIkanPerbulan ? parseInt(postIkanPerbulan.get('totalPostsIkan'), 10) : null,
            totalBurung: postBurungPerbulan ? parseInt(postBurungPerbulan.get('totalPostsBurung'), 10) : null,
            perbandingan: null
        });
    }

        for (let i = 1; i < dataPerBulan.length; i++) {
            if (
                dataPerBulan[i].totalPosts !== null &&
                dataPerBulan[i - 1].totalPosts !== null
            ) {
                dataPerBulan[i].perbandingan =
                    dataPerBulan[i].totalPosts - dataPerBulan[i - 1].totalPosts;
            }
        }

        const totalPostsForYear = dataPerBulan.reduce((acc, curr) => acc + curr.totalPosts, 0);

        res.status(200).json({
            year: parseInt(year),
            totalPosts: totalPostsForYear,
            data: dataPerBulan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getForumPostStatisticsForYear,
};
