const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
} = require('../controllers/projectController');

router.use(auth); // toutes les routes projets sont protégées

router.get('/',      getAllProjects);
router.get('/:id',   getProjectById);
router.post('/',     createProject);
router.put('/:id',   updateProject);
router.delete('/:id', deleteProject);
router.get('/:id/members', auth, getProjectMembers);

module.exports = router;