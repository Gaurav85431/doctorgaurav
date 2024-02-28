const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.post('/getUserData', authMiddleware, userController.authController);



// Apply Doctor | 
router.post('/apply-doctor', authMiddleware, userController.applyDoctorController)

// Get all notification 
router.post('/get-all-notification', authMiddleware, userController.getAllNotification)


// Delete all notification 
router.post('/delete-all-notification', authMiddleware, userController.deleteAllNotification)



// Get all doctor
router.get('/getAllDoctors', authMiddleware, userController.getAllDoctors)

// Book Appointment:

router.post('/book-appointment', authMiddleware, userController.BookAppointment)


// Book Availabiltiy check
router.post('/booking-availability', authMiddleware, userController.bookingAvailability);


// User appointment:

router.get('/user-appointments', authMiddleware, userController.userAppointment);



module.exports = router;