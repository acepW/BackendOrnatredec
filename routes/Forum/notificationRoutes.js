const express = require('express');
const { createNotification, getNotifications } = require('../../controllers/notificationController');

const router = express.Router();

module.exports = (io) => {
    // Route untuk membuat notifikasi
    router.post('/notification', (req, res) => createNotification(req, res, io));

    // Route untuk mendapatkan semua notifikasi berdasarkan userId
    router.get('notification/:userId', getNotifications);

    return router;
};
