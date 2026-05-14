const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projet: req.params.id })
      .populate('assignedTo', 'fullName email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
      .populate('assignedTo', 'fullName email')
      .sort({ priorite: -1, dateLimite: 1 });
      
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const assignTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true }
    ).populate('assignedTo', 'fullName email');
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