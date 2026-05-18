const Task = require('../models/Task');
const { logActivity } = require('./activityController');

const getTasks = async (req, res) => {
  try {
    const {
      status,
      priorite,
      assignedTo,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const filter = { projet: req.params.id };

    if (status)     filter.statut     = status;
    if (priorite)   filter.priorite   = priorite;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.$or = [
        { titre:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum  = parseInt(page);
    const limitNum = parseInt(limit);
    const skip     = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignedTo', 'fullName email')
        .sort({ priorite: -1, dateLimite: 1 })
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(filter)
    ]);

    res.json({
      data:       tasks,
      total,
      page:       pageNum,
      totalPages: Math.ceil(total / limitNum)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      projet: req.body.projet || req.body.projetId 
    });
    const newTask = await task.save();
     await logActivity('task_created', newTask.projet, req.user.id, { taskTitle: newTask.titre });
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
    const task = await Task.findById(req.params.id);
    await Task.findByIdAndDelete(req.params.id);
    await logActivity('task_deleted', task.projet, req.user.id, { taskTitle: task.titre }); 
    res.json({ message: 'Task supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id); 
    const ancienStatut = oldTask.statut;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut },
      { new: true }
    );
    await logActivity('task_status_changed', task.projet, req.user.id, { 
      taskTitle: task.titre,
      from: ancienStatut,
      to: task.statut
    });
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
    await logActivity('task_assigned', task.projet, req.user.id, { taskTitle: task.titre });
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