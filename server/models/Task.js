const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    filename: String,
    path: String,
    originalname: String
});

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['To-Do', 'In Progress', 'Done'],
        default: 'To-Do'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    dueDate: {
        type: Date
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    attachedDocuments: [documentSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);