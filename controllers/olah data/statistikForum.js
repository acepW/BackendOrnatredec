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

        const dataPerBulan = posts.map((post, index) => {
            const month = post.get('month');
            const totalPosts = parseInt(post.get('totalPosts'));

            // Hitung perbedaan dengan bulan sebelumnya jika ada
            let differenceWithPreviousMonth = null;
            if (index > 0) {
                differenceWithPreviousMonth = totalPosts - dataPerBulan[index - 1].totalPosts;
            }

            return {
                month,
                totalPosts,
                differenceWithPreviousMonth
            };
        });

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
