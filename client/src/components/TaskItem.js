import React from 'react';

const TaskItem = ({ task, onEdit, onDelete }) => {
    return (
        <div className="task-card">
            <div className="task-card-header">
                <h3>{task.title}</h3>
                <div className="task-actions">
                    <button className="edit-btn" onClick={() => onEdit(task)}>Edit</button>
                    <button className="delete-btn" onClick={() => onDelete(task._id)}>Delete</button>
                </div>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-details">
                <span><strong>Status:</strong> {task.status}</span>
                <span><strong>Priority:</strong> {task.priority}</span>
                <span><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            {task.attachedDocuments && task.attachedDocuments.length > 0 && (
                <div className="task-attachments">
                    <h4>Attachments:</h4>
                    <ul>
                        {task.attachedDocuments.map(doc => (
                            <li key={doc._id}>
                                <a
                                    href={`http://localhost:5000/uploads/${doc.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {doc.originalname}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TaskItem;