const { User } = require("../models/userModels");
const Report = require("../models/reportModels");
const Signup = require("../models/signupModels");
const Password = require("../models/passwordModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const path = require("path");

// Generate json webtoken
const userCreateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Create User
const userSignup = async (req, res) => {
  try {
    let {
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
      cloudinary_id,
    } = req.body;

    if (!idPhoto && !cloudinary_id) {
      idPhoto = "";
      cloudinary_id = "";
      // Upload the id photo if it exists
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
        idPhoto = result.secure_url;
        cloudinary_id = result.public_id;
      }
    }

    // call function from the model
    const userInfo = await User.signup(
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
    );

    const users = await Signup.findOne({ username }).select("_id registration");

    if (users) {
      const _id = users._id;
      const registration = "approved";

      const updatedSignup = await Signup.findByIdAndUpdate(
        _id,
        { registration },
        {
          new: true,
        }
      );
    }

    // create token
    const token = userCreateToken(userInfo._id);

    res.status(201).json({
      message: "User signed up successfully",
      userInfo,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

const userLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    //just call the function from the model
    const userInfo = await User.login(username, password);

    //create token
    const token = userCreateToken(userInfo._id);

    // Get the userType of the logged-in user
    const user = await User.findOne({ username }).populate({
      path: "userType",
      select: "userType",
    });

    const userKey = user.userType.userType;
    const userObj = user._id;
    const userId = userObj.toString();
    console.log(userId);
    console.log(userKey);

    res.status(201).json({
      message: "User logged up successfully",
      username,
      userId,
      token,
      userKey,
    });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("_id username firstName lastName dateRegistered")
      .populate({
        path: "userType",
        select: "userType",
      })
      .populate({
        path: "branch",
        select: "branch",
      })
      .sort({ dateRegistered: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed user table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get a single User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "userType",
      })
      .populate({
        path: "branch",
      })
      .populate({
        path: "subjectArea",
      })
      .populate({
        path: "gradeLevel",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed user ${req.params.id} details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Update a User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  let user = await User.findById(id);
  let changePass = await Password.findOne({ userId: id });

  try {
    if (!user) {
      return res.status(404).json({ message: "No such User" });
    } else {
      let result;

      // Check if a new photo is provided
      if (req.file) {
        // Remove the previous image from cloudinary
        if (user.cloudinary_id) {
          await cloudinary.uploader.destroy(user.cloudinary_id);
        }

        // Upload the new image
        result = await cloudinary.uploader.upload(req.file.path);
      }

      const updatedUserData = {
        ...req.body,
        idPhoto: req.file ? result?.secure_url : user.idPhoto,
        cloudinary_id: req.file ? result?.public_id : user.cloudinary_id,
      };

      const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {
        new: true,
      }).populate({ path: "userInfo", strictPopulate: false });

      if (password) {
        const _id = changePass._id;
        const changeStatus = "approved";

        const updatedPassword = await Password.findByIdAndUpdate(
          _id,
          { changeStatus },
          {
            new: true,
          }
        );

        // store report
        const user_id = req.userInfo.id;
        const action = `Approved change password for ${id}.`;
        const newReport = new Report({
          user_id,
          action,
        });
        await newReport.save();
      }

      // store report
      const user_id = req.userInfo.id;
      const action = `Updated user ${id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "User updated successfully",
        updatedUser,
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Delete a User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      // Delete the associated image from Cloudinary if cloudinary_id exists
      if (user.cloudinary_id && user.cloudinary_id !== "") {
        await cloudinary.uploader.destroy(user.cloudinary_id);
      }

      // store report
      const user_id = req.userInfo.id;
      const action = `Deleted user ${req.params.id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Update a User Password
const updatePassword = async (req, res) => {
  try {
    let { username, password } = req.body;

    // Check if required field is empty
    const requiredFields = ["username", "password"];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("Username does not exists.");
    } else {
      const userId = user._id;

      // create token
      const token = userCreateToken(user._id);

      // Salt for additional security
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Create document
      const newPassword = new Password({
        userId,
        username,
        password: hash,
      });

      // Upload document to database
      await newPassword.save();

      res.status(201).json({
        message: "New password created successfully",
        newPassword,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get a single Password
const getPassword = async (req, res) => {
  try {
    const user = await Password.findById(req.params.id).populate({
      path: "userId",
      select:
        "firstName lastName branch userType subjectArea gradeLevel email phoneNumber",
      populate: [
        { path: "userType", select: "userType" },
        { path: "branch", select: "branch" },
        { path: "subjectArea", select: "subjectArea" },
        { path: "gradeLevel", select: "gradeLevel" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed user ${user.userId._id} change password details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  userSignup,
  userLogin,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  getPassword,
};
