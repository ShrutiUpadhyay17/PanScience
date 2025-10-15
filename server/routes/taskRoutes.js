// /routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    downloadDocument
} = require('../controllers/taskController');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { files: 3, fileSize: 1024 * 1024 * 5 } }); 

router.route('/')
    .post(protect, upload.array('documents', 3), createTask)
    .get(protect, getTasks);

router.route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

router.get('/:id/documents/:filename', protect, downloadDocument);

module.exports = router;