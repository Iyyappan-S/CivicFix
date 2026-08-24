const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extname) return cb(null, true);
        cb(new Error('Only images are allowed'));
    }
});


router.post('/', authMiddleware, roleMiddleware('CITIZEN', 'ADMIN'), complaintController.createComplaint);
router.get('/', authMiddleware, complaintController.getComplaints);
router.get('/:id', authMiddleware, complaintController.getComplaintById);

// Admin / Officer status update
router.put('/:id/status', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), complaintController.updateStatus);
router.put('/:id/assign', authMiddleware, roleMiddleware('ADMIN'), complaintController.assignComplaint);

// Images
router.post('/:id/images', authMiddleware, upload.array('images', 5), complaintController.uploadImages);

// Feedback
router.post('/:id/feedback', authMiddleware, roleMiddleware('CITIZEN'), complaintController.addFeedback);
router.get('/:id/feedback', authMiddleware, complaintController.getFeedback);

module.exports = router;
