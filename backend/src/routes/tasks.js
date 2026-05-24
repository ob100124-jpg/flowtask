const express = require('express');
const { validateTask } = require('../middlewares/Validate');
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
const auth = require('../middlewares/auth');

router.get('/:id/tasks', auth, getTasks);
router.post('/', auth, validateTask, createTask);
router.put('/:id', auth, validateTask, updateTask);
router.delete('/:id', auth, deleteTask);
router.patch('/:id/status', auth, updateTaskStatus);
router.get('/my-tasks', auth, getMyTasks);
router.put('/:id/assign',   auth, assignTask);
router.patch('/:id/assign', auth, assignTask);

module.exports = router;