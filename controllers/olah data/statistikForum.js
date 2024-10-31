const db = require("../../config/database"); // Instance database
const Post = require("../../models/Forum/posts");
const { Op } = require("sequelize");

// Statistik per tahun (semua bulan)
const getForumPostStatisticsForYearAll = async (req, res) => {
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

        const dataPerBulan = posts.map(post => ({
            month: post.get('month'),
            totalPosts: post.get('totalPosts')
        }));

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

// Statistik per tahun dengan perbandingan tahun sebelumnya
const getForumPostStatisticsForYear = async (req, res) => {
    try {
        const { year } = req.params;

        if (!year || isNaN(year)) {
            return res.status(400).json({ message: 'Tahun harus valid.' });
        }

        const currentYearPosts = await Post.findAll({
            attributes: [
                [db.fn('YEAR', db.col('createdAt')), 'year'],
                [db.fn('COUNT', db.col('id')), 'totalPosts']
            ],
            where: {
                [Op.and]: [
                    db.where(db.fn('YEAR', db.col('createdAt')), year)
                ]
            },
            group: ['year'],
        });

        const totalPostsForCurrentYear = currentYearPosts.length > 0 ? currentYearPosts[0].get('totalPosts') : 0;

        const previousYearPosts = await Post.findAll({
            attributes: [
                [db.fn('YEAR', db.col('createdAt')), 'year'],
                [db.fn('COUNT', db.col('id')), 'totalPosts']
            ],
            where: {
                [Op.and]: [
                    db.where(db.fn('YEAR', db.col('createdAt')), year - 1)
                ]
            },
            group: ['year'],
        });

        const totalPostsForPreviousYear = previousYearPosts.length > 0 ? previousYearPosts[0].get('totalPosts') : 0;

        const totalPostDifference = totalPostsForCurrentYear - totalPostsForPreviousYear;

        res.status(200).json({
            currentYear: {
                year: parseInt(year),
                totalPosts: totalPostsForCurrentYear
            },
            previousYear: {
                year: parseInt(year) - 1,
                totalPosts: totalPostsForPreviousYear
            },
            comparison: {
                totalPostDifference: totalPostDifference
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Statistik per bulan dengan perbandingan bulan sebelumnya
const getForumPostStatisticsForMonth = async (req, res) => {
    try {
        const { month, year } = req.params;

        if (!month || !year || isNaN(month) || isNaN(year) || month < 1 || month > 12) {
            return res.status(400).json({ message: 'Bulan dan tahun harus valid.' });
        }

        const posts = await Post.findAll({
            attributes: [
                [db.fn('MONTH', db.col('createdAt')), 'month'],
                [db.fn('YEAR', db.col('createdAt')), 'year'],
                [db.fn('COUNT', db.col('id')), 'totalPosts']
            ],
            where: {
                [Op.and]: [
                    db.where(db.fn('YEAR', db.col('createdAt')), year),
                    db.where(db.fn('MONTH', db.col('createdAt')), month)
                ]
            },
            group: ['year', 'month'],
        });

        const totalPostsForCurrentMonth = posts.reduce((acc, curr) => acc + curr.get('totalPosts'), 0);

        const previousMonthData = await Post.findAll({
            attributes: [
                [db.fn('MONTH', db.col('createdAt')), 'month'],
                [db.fn('YEAR', db.col('createdAt')), 'year'],
                [db.fn('COUNT', db.col('id')), 'totalPosts']
            ],
            where: {
                [Op.and]: [
                    db.where(db.fn('YEAR', db.col('createdAt')), year),
                    db.where(db.fn('MONTH', db.col('createdAt')), month - 1)
                ]
            },
            group: ['year', 'month'],
        });

        const totalPostsForPreviousMonth = previousMonthData.reduce((acc, curr) => acc + curr.get('totalPosts'), 0);

        const totalPostDifference = totalPostsForCurrentMonth - totalPostsForPreviousMonth;

        res.status(200).json({
            currentMonth: {
                year: parseInt(year),
                month: parseInt(month),
                totalPosts: totalPostsForCurrentMonth
            },
            previousMonth: {
                year: parseInt(year),
                month: month - 1,
                totalPosts: totalPostsForPreviousMonth
            },
            comparison: {
                totalPostDifference: totalPostDifference
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getForumPostStatisticsForYearAll,
    getForumPostStatisticsForYear,
    getForumPostStatisticsForMonth
};
