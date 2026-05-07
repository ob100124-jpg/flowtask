const mongoose = require('mongoose');
const Task = require('./Task');

const projectsSchema = new mongoose.Schema({
    titre : { type: String, required: true,  trim: true },
    description : { type: String, required: true},
    datelimite : { type: Date},
    creatuer : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status : { type: String, enum: [ 'active', 'poused', 'archived' ], default: 'active' }},
     { timestamps: true });

     //cascade delete tasks when a project is deleted
projectsSchema.pre('deleteOne' , { document: true, query: false }, async function(next) {
    try {
        await Task.deleteMany({ project: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Project', projectsSchema);