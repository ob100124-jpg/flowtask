const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Create a new project

router.post('/projects', auth, async (req, res) => {
    try {
        const project = new Project({
            ...req.body,
            creatuer: req.user._id
        });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all projects for the authenticated user
router.get('/projects', auth, async (req, res) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const projects = await Project.find({ creatuer: req.user._id });
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
          res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific project by ID
router.get('/projects/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, creatuer: req.user._id });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a project
router.put('/projects/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, creatuer: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
            res.json(project);
        } catch (err) { res.status(400).json({ message: err.message });
    }
});

// Delete a project
router.delete('/projects/:id', auth, async (req, res) => {