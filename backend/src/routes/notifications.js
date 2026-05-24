// routes/notifications.js
const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

// GET /api/notifications
router.get('/', auth, getNotifications);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', auth, markAsRead);

module.exports = router;