const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activityController');
const auth = require('../middlewares/auth');

// GET /api/projects/:id/activities
router.get('/projects/:id/activities', auth, getActivities);
module.exports = router;