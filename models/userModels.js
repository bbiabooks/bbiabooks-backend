const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const genderEnum = ["Male", "Female"];
const statusEnum = ["Active", "Suspended"];

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserType",
    },
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
      default: Date.now,
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
      required: true,
    },
    cloudinary_id: {
      type: String,
    },
    userStatus: {
      type: String,
      enum: statusEnum,
      default: "Active",
    },
    dateRegistered: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    timestamps: { updatedAt: true }, // this will update the default updatedAt from createdAt, changes when something is updated
  }
);

/** ---ENCRYPTION--- */
// When using this, suggest using a regular function
userSchema.statics.signup = async function (
  userType,
  username,
  password,
  branch,
  subjectArea,
  gradeLevel,
  firstName,
  middleName,
  lastName,
  date_of_birth,
  gender,
  street,
  city,
  stateProvince,
  zipCode,
  country,
  email,
  phoneNumber,
  idPhoto,
  cloudinary_id
) {
  // Check length
  if (username.length < 8) {
    throw Error("Please enter at least 8 characters in the username.");
  }
  // Check if strong password
  if (password.length < 8) {
    throw Error("Please enter at least 8 characters in the password.");
  }

  const mobileNumberRegex = /^09\d{9}$|^639\d{9}$/;
  if (!mobileNumberRegex.test(phoneNumber)) {
    throw new Error("Please check your contact number.");
  }

  // Check if username already exists
  const exists = await this.findOne({ username });
  if (exists) {
    throw Error("Username already in use. Please enter a new unique username.");
  }

  const userInfoWithSameDetails = await this.findOne({
    firstName,
    middleName,
    lastName,
    phoneNumber,
  });

  if (userInfoWithSameDetails) {
    throw Error("User already exists.");
  }

  // Salt for additional security
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const userInfo = await this.create({
    userType,
    username,
    password: hash,
    branch,
    subjectArea,
    gradeLevel,
    firstName,
    middleName,
    lastName,
    date_of_birth,
    gender,
    street,
    city,
    stateProvince,
    zipCode,
    country,
    email,
    phoneNumber,
    idPhoto,
    cloudinary_id,
  });

  return userInfo;
};

userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("Please fill in all the blank fields.");
  }

  // Check if user exists
  const userInfo = await this.findOne({ username });
  if (!userInfo) {
    throw Error("Incorrect username.");
  }

  // Check if the user is suspended/deleted
  if (userInfo.userStatus === "Suspended") {
    throw Error("Your account is currently Suspended.");
  }

  // Check if the password and password hash match
  const match = await bcrypt.compare(password, userInfo.password);

  if (!match) {
    throw Error("Incorrect password.");
  }

  return userInfo;
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
