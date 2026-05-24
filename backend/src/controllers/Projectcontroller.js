const Project = require('../models/Project');
const User = require('../models/User'); // ✅ AJOUT

// GET /api/projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createur: req.user.id },
        { members: req.user.id }
      ]
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createur: req.user.id });
    if (!project)
      return res.status(404).json({ message: 'Projet introuvable' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { titre, description, datelimite, status } = req.body;
    const project = new Project({
      titre, description, datelimite, status,
      createur: req.user.id,
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createur: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project)
      return res.status(404).json({ message: 'Projet introuvable' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createur: req.user.id });
    if (!project)
      return res.status(404).json({ message: 'Projet introuvable' });
    await project.deleteOne();
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MEMBERS
const getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'fullName email');
    res.json(project.members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getProjectMembers = getProjectMembers;

//
// ==================== 🔥 AJOUT FONCTIONNALITÉ 8 ====================
//

// INVITER MEMBRE PAR EMAIL
exports.inviteMemberByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      createur: req.user.id
    });

    if (!project) {
      return res.status(403).json({
        message: "Seul le créateur peut inviter"
      });
    }

    const userToInvite = await User.findOne({ email });

    if (!userToInvite) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    const alreadyMember = project.members.some(
      id => id.toString() === userToInvite._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "Déjà membre"
      });
    }

    project.members.push(userToInvite._id);
    await project.save();

    res.json({ message: "Membre ajouté avec succès" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SUPPRIMER MEMBRE
exports.removeProjectMember = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createur: req.user.id
    });

    if (!project) {
      return res.status(403).json({
        message: "Seul le créateur peut supprimer"
      });
    }

    project.members = project.members.filter(
      id => id.toString() !== req.params.memberId
    );

    await project.save();

    res.json({ message: "Membre supprimé" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};