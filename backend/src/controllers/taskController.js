const Task = require('../models/Task');
const Project = require('../models/Project'); // ✅ AJOUT
const { logActivity } = require('./activityController');
const { createNotification } = require('./notificationController');

// ✅ AJOUT - vérifier accès projet
const getProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);

  if (!project) return null;

  const isCreator = project.createur.toString() === userId;
  const isMember = project.members.some(
    memberId => memberId.toString() === userId
  );

  return { project, isCreator, isMember };
};

const getTasks = async (req, res) => {
  try {
    const access = await getProjectAccess(req.params.id, req.user.id);

    if (!access || (!access.isCreator && !access.isMember)) {
      return res.status(403).json({ message: "Accès interdit au projet" });
    }

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
    const projectId = req.body.projet || req.body.projetId;

    const access = await getProjectAccess(projectId, req.user.id);

    if (!access || !access.isCreator) {
      return res.status(403).json({
        message: "Seul le créateur du projet peut créer une tâche"
      });
    }

    const task = new Task({
      ...req.body,
      projet: projectId
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
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    const access = await getProjectAccess(existingTask.projet, req.user.id);

    if (!access || !access.isCreator) {
      return res.status(403).json({
        message: "Seul le créateur du projet peut modifier une tâche"
      });
    }

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

    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    const access = await getProjectAccess(task.projet, req.user.id);

    if (!access || !access.isCreator) {
      return res.status(403).json({
        message: "Seul le créateur du projet peut supprimer une tâche"
      });
    }

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

    if (!oldTask) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    const access = await getProjectAccess(oldTask.projet, req.user.id);

    if (!access || (!access.isCreator && !access.isMember)) {
      return res.status(403).json({ message: "Accès interdit au projet" });
    }

    const isAssignedMember =
      oldTask.assignedTo &&
      oldTask.assignedTo.toString() === req.user.id;

    if (!access.isCreator && !isAssignedMember) {
      return res.status(403).json({
        message: "Un membre peut seulement modifier le statut des tâches qui lui sont assignées"
      });
    }

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
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    const access = await getProjectAccess(existingTask.projet, req.user.id);

    if (!access || !access.isCreator) {
      return res.status(403).json({
        message: "Seul le créateur du projet peut assigner une tâche"
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true }
    ).populate('assignedTo', 'fullName email');

    await logActivity('task_assigned', task.projet, req.user.id, { taskTitle: task.titre });

    if (req.body.userId) {
      await createNotification(
        'task_assigned',
        req.body.userId,
        task.projet,
        `Vous avez été assigné à la tâche "${task.titre}"`
      );
    }
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