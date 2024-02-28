const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const doctorController = require('../controllers/doctorController')

const doctorRouter = express.Router();


//  Single Doctor Info.
doctorRouter.post('/getDoctorInfo', authMiddleware, doctorController.getDoctorInfo);


// Update Doctor Profile Info:
doctorRouter.post('/updateProfile', authMiddleware, doctorController.updateDoctorProfile);


// Get single doctor information

doctorRouter.post('/getDoctorById', authMiddleware, doctorController.getDoctorById)


// get doctor appointment

doctorRouter.get('/doctor-appointments', authMiddleware, doctorController.doctorAppointment)



// Update status

doctorRouter.post('/update-status', authMiddleware, doctorController.updateStatus)



module.exports = doctorRouter;