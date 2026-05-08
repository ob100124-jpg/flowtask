const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const auth = require('../middlewares/auth');

// GET /api/dashboard
router.get('/', auth, getDashboard);

module.exports = router;