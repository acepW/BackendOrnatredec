const Notification = require('./../models/notif')

/**
 * Membuat notifikasi baru
 */
const createNotification = async (req, res, io) => {
    const { userId, type, message } = req.body;

    try {
        const notification = await Notification.create({
            userId,
            type,
            message,
            isRead: false,
        });

        // Emit notifikasi ke pengguna tertentu
        io.to(`user_${userId}`).emit('notification', notification);

        res.status(201).json({
            message: "Notification created successfully",
            notification,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Mendapatkan semua notifikasi untuk pengguna tertentu
 */
const getNotifications = async (req, res) => {
    const userId = req.params.userId;

    try {
        const notifications = await Notification.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
};
