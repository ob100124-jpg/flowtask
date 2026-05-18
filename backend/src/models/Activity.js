// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'task_created',
        'task_deleted',
        'task_status_changed',
        'task_assigned',
        'project_updated',
        'member_added',
        'member_removed',
      ],
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Activity', activitySchema);