const Task = require('../models/Task');

// GET - jib tasks dyal projet
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projet: req.params.id })
      .populate('assignedTo', 'nom email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST - khla9 task jdida
const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      projet: req.body.projetId
    });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT - 3del task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE - 7ed task
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH - 3del statut fqt
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET - jib tasks dyal user connecté filtré b projet w membre
const getMyTasks = async (req, res) => {
  try {
    const filter = { assignedTo: req.user.id };
    
    if (req.query.projetId) {
      filter.projet = req.query.projetId;
    }
    
    if (req.query.statut) {
      filter.statut = req.query.statut;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'nom email')
      .sort({ priorite: -1, dateLimite: 1 });
      
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT - assign task l membre
const assignTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true }
    ).populate('assignedTo', 'nom email');
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getMyTasks,
  assignTask
};