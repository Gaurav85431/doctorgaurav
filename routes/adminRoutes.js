const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// Get all users
router.get('/getAllUsers', authMiddleware, AdminController.getAllUsers);

// Get All Doctors
router.get('/getAllDoctors', authMiddleware, AdminController.getAllDoctors);


// POST Account status:
router.post('/changeAccountStatus', authMiddleware, AdminController.changeAccountStatus)

module.exports = router;