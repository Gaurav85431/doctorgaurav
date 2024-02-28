const user = require('../models/userModels');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const SecretKey = require('../config/configuragtion');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const userModel = require('../models/userModels');
const moment = require('moment')


// Register
const Register = async (req, res) => {
    try {

        const existingUser = await user.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send({ success: false, message: `User already Exist` })
        }
        else {
            const password = req.body.password;
            // const sPassword = await bcrypt.hash(password, 10);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // req.body.password= hashedPassword;

            const newUser = new user({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            const saveUser = await newUser.save();
            res.status(200).send({ success: true, message: "Register Successfully ", data: { saveUser } });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: `Register Controller ${error.message}` })
    }
}

// Login
const Login = async (req, res) => {
    try {
        const userEmail = await user.findOne({ email: req.body.email });
        if (!userEmail) {
            return res.status(200).send({ message: 'User Not Exist', success: false })
        }
        else {
            const isMatchPW = await bcrypt.compare(req.body.password, userEmail.password);
            if (!isMatchPW) {
                return res.status(200).send({ message: "Invalid Email or Password", success: false });
            }
            // const token = jwt.sign({ id: userEmail._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

            const token = jwt.sign({ id: userEmail._id }, SecretKey.JWT_SECRET, { expiresIn: '1d' })//we want ki 1 day me token expire ho jaye
            console.log('token is', token);
            res.status(200).send({ message: 'Login Success', success: true, token: token })

        }
    } catch (error) {
        res.send(error)
    }
}

// AuthController

const authController = async (req, res) => {
    try {

        const myUser = await user.findById({ _id: req.body.userId });

        myUser.password = undefined;

        if (!myUser) {
            return res.status(200).send({
                message: "user not found",
                success: false
            })

        }
        else {
            res.status(200).send({
                success: true,
                data: myUser,
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Auth Error',
            success: false,
            error
        })
    }
}


// Apply doctor controller 
const applyDoctorController = async (req, res) => {

    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' })
        await newDoctor.save(); //doctor ka detail save hua.

        // ab admin ko notification jayega ki doctor add hua hia to ..
        const adminUser = await user.findOne({ isAdmin: true }); // find the admin kon sb hai db me


        // notifcation hai model me to wahi naam likhenge
        // admin ko find kr liye adminUser me ab hm iska notification me wo data ko store karenge jb doctor register karega.

        const notifcation = adminUser.notifcation;
        //ab notifcation ke array me value ko push kar denge. i.e. notification.push() se


        notifcation.push({

            type: 'apply-doctor-request',
            // jo doctor avi register hua hia so newDoctor.firstName;
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + ' ' + newDoctor.lastName,
                onClickPath: '/admin/doctor'//redirect hoga
            }
        })
        await user.findByIdAndUpdate(adminUser._id, { notifcation });
        res.status(201).send({
            success: true,
            message: 'Doctor Account Applied Successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while applying for Doctor"
        })
    }

}



// Get all notification

const getAllNotification = async (req, res) => {

    try {

        // To find user by taking id 
        const myUser = await user.findOne({ _id: req.body.userId });


        // to get seennotification
        const seennotification = myUser.seennotification;

        // to get normal notification
        const notification = myUser.notifcation;

        // seenotifiaction me hm notification ko push kar denge spread lagakar. i.e. jo notification ko see kar liye wo notification seennotification me chala jayega. OTherwise wo notifcation me rhega.
        seennotification.push(...notification)

        // ab normal notification ko empty kar denge bcz jb seen ho gaya to wo seennotification me jayega.
        myUser.notifcation = [];

        // ab hm seennotification me normal notification ko add kr denge.
        myUser.seennotification = notification;

        // ab isko update kar denge i.e. save kar dnege ki seennotification sb.
        const updatedUser = await myUser.save();
        res.status(200).send({
            success: true,
            message: "All notification marked as read",
            data: updatedUser
        })



    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Notification",
            success: false,
            error
        })
    }

}




// delete All Notification
const deleteAllNotification = async (req, res) => {
    try {

        // User ko get karenge
        const myUser = await user.findOne({ _id: req.body.userId });

        // ab user ko rkh diye myUser me, to ab hm myUser se notification ko target karenge. aur isko [] empty array kar dnege.
        myUser.notifcation = [];

        // seennotification ko v hm [] i.e. empty array kar denge.
        myUser.seennotification = [];

        // ab user ko update kar denge.
        const updateUser = await myUser.save()

        // ayaa user ka password v rahega (i.e. Doctor jo register kiya. ) to usko undefined kar denge taki show na ho.
        updateUser.password = undefined


        res.status(200).send({
            success: true,
            message: "Notification Deleted Successfully",
            data: updateUser
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "unable to delete all notifications",
            error
        })
    }
}


// Get all Doctor::-
const getAllDoctors = async (req, res) => {
    try {

        const doctor = await doctorModel.find({ status: 'approved' });
        res.status(200).send({
            success: true,
            message: "Doctors list fetched successfully",
            data: doctor
        })




    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            error,
            message: "error while fetching doctor"

        })
    }
}





// Book Appointment::-

const BookAppointment = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        req.body.time = moment(req.body.time, 'HH:mm').toISOString();
        // ab ye jo date time aaya hai usko hm rkhenge comparision karne ke liye availability ka.


        req.body.status = 'pending';

        const newAppointment = new appointmentModel(req.body);

        await newAppointment.save();

        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });

        user.notifcation.push({
            type: 'New-appointment-request',
            message: `A new Appointment Request from ${req.body.userInfo.name}`,
            onClickPath: '/user/appointments'
        })

        // Jb notification chala jayega to save karenge user ko. i.e. userModel update.

        await user.save();


        res.status(200).send({
            success: true,
            message: 'Appointment Booked successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while booking appointment"
        })
    }
}





// Booking Availability Check

const bookingAvailability = async (req, res) => {
    try {
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();
        const doctorId = req.body.doctorId;
        const appointment = await appointmentModel.find({
            doctorId: doctorId,
            date,
            time: {
                $gte: fromTime, $lte: toTime,
                // $gte = greather than
                // $lte = less than
            },
        })


        if (appointment.length > 0) //apne paas already appointment hai
        {
            return res.status(200).send({
                message: 'Appointment is not available at this time',
                success: true  //bcz ye proper chl rhi  hai
            });
        }
        else {
            return res.status(200).send({
                success: true,
                message: "Appointment is available"
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Booking'
        })

    }
}


// User Appointment controller

const userAppointment = async (req, res) => {
    try {
        const appointment = await appointmentModel.find({
            userId: req.body.userId,
        });

        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch Successfully",
            data: appointment,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in User Appointments'
        })
    }
}



module.exports = {
    Register,
    Login,
    authController,
    applyDoctorController,
    getAllNotification,
    deleteAllNotification,
    getAllDoctors,
    BookAppointment,
    bookingAvailability,
    userAppointment
}