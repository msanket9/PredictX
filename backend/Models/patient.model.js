const mongoose = require("mongoose");
const validator = require("mongoose-validator");

var PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [
      validator({
        validator: "isEmail",
        message: "please enter valid email",
      }),
    ],
  },
  password: {
    type: String,
    required: true,
  },
  userType: { type: String, required: true },
  medrecord_id: String,
  dosagebox_id:String,
  doctorAddNotifi: [String],
  doctors:[String]
});

module.exports = mongoose.model("Patient", PatientSchema);
