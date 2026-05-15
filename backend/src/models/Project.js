const mongoose = require('mongoose');
const Task = require('./Task');

const ProjectSchema = new mongoose.Schema({
  titre:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  datelimite:  { type: Date },
  createur:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:      { type: String, enum: ['active', 'paused', 'archived'], default: 'active' },
}, { timestamps: true });

//Cascade delete des tâches liées au projet
  ProjectSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Task = require('./Task');
  await Task.deleteMany({ project: this._id });
});

module.exports = mongoose.model('Project', ProjectSchema);