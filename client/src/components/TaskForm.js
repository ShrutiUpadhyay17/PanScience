import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const TaskForm = ({ taskToEdit, onTaskSaved, onClose }) => {
    // State for all form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('To-Do');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    // This hook runs when the component loads or when taskToEdit changes.
    // It pre-fills the form if we are editing a task.
    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || '');
            setStatus(taskToEdit.status);
            setPriority(taskToEdit.priority);
            // Format date for the date input field (YYYY-MM-DD)
            setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.split('T')[0] : '');
        }
    }, [taskToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('priority', priority);
        if (dueDate) {
            formData.append('dueDate', dueDate);
        }

        // Append up to 3 files
        for (let i = 0; i < files.length; i++) {
            formData.append('documents', files[i]);
        }

        try {
            if (taskToEdit) {
                // Update logic
                await api.put(`/tasks/${taskToEdit._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Create logic
                await api.post('/tasks', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onTaskSaved(); 
            onClose();     
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save the task. Please try again.';
            setError(errorMessage);
            console.error('Failed to save task:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h3>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
                required
            />

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>

            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <label>Due Date</label>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />

            <label>Attach Documents (up to 3 PDFs)</label>
            <input
                type="file"
                multiple
                accept=".pdf" 
                onChange={(e) => setFiles(e.target.files)}
            />

            <button type="submit">Save Task</button>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export default TaskForm;