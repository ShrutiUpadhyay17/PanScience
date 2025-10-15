import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/tasks');
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleTaskSaved = () => {
        fetchTasks();
    };

    const handleAddNewTask = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchTasks();
            } catch (error) {
                console.error('Failed to delete task', error);
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container dashboard-container">
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <TaskForm
                        taskToEdit={taskToEdit}
                        onTaskSaved={handleTaskSaved}
                        onClose={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                {user && user.role === 'admin' && (
                    <Link to="/admin/users" style={{ margin: '0 20px' }}>
                        Manage Users
                    </Link>
                )}
                <button onClick={handleLogout}>Logout</button>
            </div>
            <button onClick={handleAddNewTask}>+ Add New Task</button>
            <hr />
            <div className="task-list">
                <h2>Your Tasks</h2>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                        />
                    ))
                ) : (
                    <p>No tasks found. Click "+ Add New Task" to get started.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;