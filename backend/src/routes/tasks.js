const express = require('express');
const { validateTask } = require('../middlewares/validate');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getMyTasks,
  assignTask
} = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');

// Routes CRUD
router.get('/projects/:id/tasks', auth, getTasks);
router.post('/tasks', auth, validateTask, createTask);
router.put('/tasks/:id', auth, validateTask, updateTask);
router.delete('/tasks/:id', auth, deleteTask);

// PATCH - update status only
router.patch('/tasks/:id/status', auth, updateTaskStatus);

// F4 - Assignation
router.get('/tasks/my-tasks', auth, getMyTasks);
router.put('/tasks/:id/assign', auth, assignTask);

module.exports = router;