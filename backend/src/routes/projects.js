const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

router.use(auth); // toutes les routes projets sont protégées

router.get('/',      getAllProjects);
router.get('/:id',   getProjectById);
router.post('/',     createProject);
router.put('/:id',   updateProject);
router.delete('/:id', deleteProject);

module.exports = router;