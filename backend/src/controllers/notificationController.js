// controllers/notificationController.js
const Notification = require('../models/Notification');

// Helper used by other controllers (like activityController's logActivity)
async function createNotification(type, userId, projectId, message) {
  try {
    await Notification.create({ type, user: userId, project: projectId, message });
  } catch (err) {
    console.error('createNotification error:', err.message);
  }
}

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {// controllers/notificationController.js
const Notification = require('../models/Notification');

// Helper used by other controllers (like activityController's logActivity)
async function createNotification(type, userId, projectId, message) {
  try {
    await Notification.create({ type, user: userId, project: projectId, message });
  } catch (err) {
    console.error('createNotification error:', err.message);
  }
}

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification)
      return res.status(404).json({ message: 'Notification introuvable' });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNotification, getNotifications, markAsRead };
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification)
      return res.status(404).json({ message: 'Notification introuvable' });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNotification, getNotifications, markAsRead };