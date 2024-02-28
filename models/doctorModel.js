const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  firstName: {
    type: String,
    required: [true, 'First Name is required']
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  email: {
    type: String,
    required: [true, 'email is required']
  },
  website: { // doctor ka website agar available ho to 
    type: String
  },
  address: {
    type: String,
    required: [true, 'address is required']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  feesPerConsultantation: {
    type: Number,
    required: [true, 'Fee is required']
  },
  status: { //  status accept hua hai ya ni.
    type: String,
    default: "pending"
  },
  timings: {
    type: Object,
    required: [true, 'work timing is required']
  }

},
  { timestamps: true }  // ye timestamp ko capture karega
);

module.exports = mongoose.model('Doctor', doctorSchema)