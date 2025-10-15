// /controllers/taskController.js
const Task = require('../models/Task');
const path = require('path');
const fs = require('fs');

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    try {
        const attachedDocuments = req.files ? req.files.map(file => ({
            filename: file.filename,
            path: file.path,
            originalname: file.originalname,
        })) : [];

        const task = new Task({
            title, description, status, priority, dueDate, assignedTo, attachedDocuments,
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get all tasks with filtering, sorting, and pagination
exports.getTasks = async (req, res) => {
    const { status, priority, dueDate, sortBy, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) }; // Due on or before the date

    const sortOptions = {};
    if (sortBy) {
        const parts = sortBy.split(':');
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sortOptions.createdAt = -1; // Default sort
    }

    try {
        const tasks = await Task.find(query)
            .populate('assignedTo', 'email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        
        const count = await Task.countDocuments(query);

        res.json({
            tasks,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'email');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Delete associated files
        task.attachedDocuments.forEach(doc => {
            fs.unlink(path.join(__dirname, '..', doc.path), err => {
                if (err) console.error("Failed to delete file:", err);
            });
        });

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



exports.downloadDocument = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    res.download(filePath, (err) => {
        if (err) {
            res.status(404).send({ message: "File not found." });
        }
    });
};