const doctorModel = require('../models/doctorModel')
const userModel = require('../models/userModels');


// get all users
const getAllUsers = async (req, res) => {

  try {
    const users = await userModel.find({}); //find all users
    res.status(200).send({
      success: true,
      message: 'Users data list',
      data: users
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching users",
      error
    })
  }

}



//  Get all doctors
const getAllDoctors = async (req, res) => {

  try {

    const doctors = await doctorModel.find({}); //find all doctors
    res.status(200).send({
      success: true,
      message: 'Doctors data list',
      data: doctors
    })


  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while fetching doctors", error })

  }


}





// change doctor Account Status

const changeAccountStatus = async (req, res) => {
  try {

    // direct desctructure kar lenge req.body se hm doctorId, status ko .
    const { doctorId, status } = req.body;
    // const doctorId= req.body.doctorId;

    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });

    const user = await userModel.findOne({ _id: doctor.userId });
    const notifcation = user.notifcation;
    notifcation.push({
      type: 'doctor-account-request-updated',
      message: `Your Doctor Account Request has ${status}`,
      onClickPath: '/notifcation'
    })

    // user ke isDoctor ko update kar denge agar approved ho gya.
    user.isDoctor = status === 'approved' ? true : false

    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor
    })




  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in account status",
      error
    })
  }
}


module.exports = {
  getAllUsers,
  getAllDoctors,
  changeAccountStatus

}