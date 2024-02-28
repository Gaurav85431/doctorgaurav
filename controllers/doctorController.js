const appointmentModel = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModels');


// Get Dr. Info.
const getDoctorInfo = async (req, res) => {
  try {

    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    console.log("sccess");
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor
    })

  } catch (error) {
    console.log(error);
    console.log("error in get");
    res.status(500).send({
      success: false,
      error,
      message: 'Error in fetching Doctor Details'
    })
  }
}


// Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
  try {
    // userId se doctor ko find krke jo v naya data aa hai i.e. req.body se usko update kar do.
    const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body)



    res.status(201).send({
      success: true,
      message: 'Doctor Profile Updated',
      data: doctor,
    });

  } catch (error) {
    console.log("error is ", error);
    console.log(error);
  }
}

// Get doctor by Id

const getDoctorById = async (req, res) => {

  try {

    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single doctor information fetched",
      data: doctor
    })





  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Single Doctor info."
    })
  }

}



const doctorAppointment = async (req, res) => {

  try {

    console.log("Hello Gr dr. controller");

    const doctor = await doctorModel.findOne({ userId: req.body.userId });


    console.log('doctor is ', doctor);

    const appointment = await appointmentModel.find({
      // doctorId: doctor._id,

      userId: req.body.userId

    })

    console.log("APpointment", appointment);

    res.status(200).send({
      success: true,
      message: "Doctor appointments fetch successfully",
      data: appointment
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doctor Appointments"
    })
  }

}






// update status

const updateStatus = async (req, res) => {
  try {

    // 
    const { appointmentId, status } = req.body; //we are taking appointmentID, status from client.

    const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, { status });



    const user = await userModel.findOne({ _id: appointment.userId });

    const notifcation = user.notifcation;

    notifcation.push({
      type: 'Status-Updated',
      message: `Your appointment has been updated ${status}`,
      onClickPath: '/doctor-appointments'
    })
    await user.save();
    res.status(200).send({
      success: true,
      message: 'Appointment Status Updated'
    })





  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update Status"
    })
  }
}





module.exports = {
  getDoctorInfo,
  updateDoctorProfile,
  getDoctorById,
  doctorAppointment,
  updateStatus
}