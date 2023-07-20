const mongoose = require("mongoose");

const genderEnum = ["Male", "Female"];
const registrationEnum = ["approved", "pending"];

const signupSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  userType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserType",
  },
  subjectArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubjectArea",
  },
  gradeLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GradeLevel",
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: genderEnum,
    default: "",
  },
  street: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  stateProvince: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  idPhoto: {
    type: String,
    default: "",
  },
  registration: {
    type: String,
    enum: registrationEnum,
    default: "pending",
  },
  dateRegistered: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("Signup", signupSchema);
