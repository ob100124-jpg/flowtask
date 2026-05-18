const Project = require('../models/Project');

// GET /api/projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createur: req.user.id });
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