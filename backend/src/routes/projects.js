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

  // ✅ AJOUT FONCTIONNALITÉ 8
  inviteMemberByEmail,
  removeProjectMember,
} = require('../controllers/projectController');

router.use(auth); // toutes les routes projets sont protégées

router.get('/',      getAllProjects);
router.get('/:id',   getProjectById);
router.post('/',     createProject);
router.put('/:id',   updateProject);
router.delete('/:id', deleteProject);
router.get('/:id/members', auth, getProjectMembers);

// ✅ AJOUT FONCTIONNALITÉ 8
router.post('/:id/members', inviteMemberByEmail);
router.delete('/:id/members/:memberId', removeProjectMember);

module.exports = router;