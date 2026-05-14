const Task = require('../models/Task');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // tasks assignées l user connecté
    const tasksAssignees = await Task.countDocuments({ 
      assignedTo: userId 
    });

    // tasks terminées
    const tasksTerminees = await Task.countDocuments({ 
      assignedTo: userId, 
      statut: 'terminé' 
    });

    // tasks en retard
    const tasksEnRetard = await Task.countDocuments({
      assignedTo: userId,
      statut: { $ne: 'terminé' },
      dateLimite: { $lt: now }
    });

    // tasks en cours triées par priorité et date
    const tasksEnCours = await Task.find({
      assignedTo: userId,
      statut: 'en cours'
    })
    .sort({ priorite: -1, dateLimite: 1 })
    .populate('assignedTo', 'nom email');

    res.json({
      tasksAssignees,
      tasksTerminees,
      tasksEnRetard,
      tasksEnCours
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard };