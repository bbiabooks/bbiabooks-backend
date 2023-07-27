const Signup = require("../models/signupModels");
const Report = require("../models/reportModels");
const { User } = require("../models/userModels");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const path = require("path");

/** --- ANONYMOUS --- */

// Create a new signup
const createSignupDetail = async (req, res) => {
  try {
    const {
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
    } = req.body;

    // Check if required field is empty
    const requiredFields = [
      "userType",
      "username",
      "password",
      "branch",
      "firstName",
      "lastName",
      "date_of_birth",
      "gender",
      "city",
      "stateProvince",
      "zipCode",
      "country",
      "email",
      "phoneNumber",
    ];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

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

    const user = await User.findOne({ username });
    const fullname = await User.findOne({ firstName, middleName, lastName });
    if (fullname) {
      throw new Error("User already exists.");
    }

    if (user) {
      throw new Error("Username already exists.");
    } else {
      // Upload the coverImage if it exists
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }

      // Create document
      const newSignup = new Signup({
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
        idPhoto: result ? result.secure_url : "",
        cloudinary_id: result ? result.public_id : "",
      });

      // Upload document to database
      await newSignup.save();

      res.status(201).json({
        message: "Signup created successfully",
        newSignup,
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

/** --- FOR ADMINS ONLY --- */

// Get a single signup
const getSignupDetail = async (req, res) => {
  try {
    const signup = await Signup.findById(req.params.id)
      .populate({
        path: "userType",
        select: "userType",
      })
      .populate({
        path: "branch",
        select: "branch",
      })
      .populate({
        path: "gradeLevel",
        select: "gradeLevel",
      })
      .populate({
        path: "subjectArea",
        select: "subjectArea",
      });

    if (!signup) {
      return res.status(404).json({ message: "Signup not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed signup ${req.params.id} details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(signup);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Delete a signup
const deleteSignupDetail = async (req, res) => {
  try {
    const signup = await Signup.findByIdAndDelete(req.params.id);

    if (!signup) {
      return res.status(404).json({ message: "Signup not found" });
    } else {
      // Delete the associated image from Cloudinary if cloudinary_id exists
      if (user.cloudinary_id && user.cloudinary_id !== "") {
        await cloudinary.uploader.destroy(user.cloudinary_id);
      }

      // store report
      const user_id = req.userInfo.id;
      const action = `Deleted Signup ${req.params.id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "Signup deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all signups
const getSignupTable = async (req, res) => {
  try {
    const signupTable = await Signup.find()
      .select(
        "userType username firstName lastName registration dateRegistered"
      )
      .populate({
        path: "userType",
        select: "userType",
      })
      .populate({
        path: "branch",
        select: "branch",
      })
      .populate({
        path: "gradeLevel",
        select: "gradeLevel",
      })
      .populate({
        path: "subjectArea",
        select: "subjectArea",
      })
      .sort({ dateRegistered: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed signup table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(signupTable);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  createSignupDetail,
  getSignupDetail,
  deleteSignupDetail,
  getSignupTable,
};
