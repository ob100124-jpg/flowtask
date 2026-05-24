const Activity = require('../models/Activity');

// Helper used by other controllers
async function logActivity(type, projectId, userId, meta = {}) {
  try {
    await Activity.create({ type, project: projectId, user: userId, meta });
  } catch (err) {
    console.error('logActivity error:', err.message);
  }
}

// Route handler for GET /api/projects/:id/activities
async function getActivities(req, res) { try {
    const activities = await Activity.find({ project: req.params.id })
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  } }

module.exports = { logActivity, getActivities };