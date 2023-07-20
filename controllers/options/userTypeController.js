const { UserType } = require("../../models/optionModels");
const mongoose = require("mongoose");

// Create a new UserType
const createUserType = async (req, res) => {
  try {
    const { ...userTypeData } = req.body;

    // Check if required field is empty
    const requiredFields = ["userType"];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

    // Create document
    const newUserType = new UserType({
      ...userTypeData,
    });

    // Upload document to database
    await newUserType.save();
    res
      .status(201)
      .json({ message: "User Type created successfully", newUserType });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all UserType
const getAllUserTypes = async (req, res) => {
  try {
    const userTypes = await UserType.find();
    res.json(userTypes);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get a single UserType
const getUserType = async (req, res) => {
  try {
    const userType = await UserType.findById(req.params.id);
    if (!userType) {
      return res.status(404).json({ message: "User Type not found" });
    }
    res.json(userType);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Update a UserType
const updateUserType = async (req, res) => {
  const { id } = req.params;

  const updatedUserType = await UserType.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedUserType) {
    return res.status(404).json({ message: "No such User Type" });
  }

  res.status(200).json(updatedUserType);
};

// Delete a UserType
const deleteUserType = async (req, res) => {
  try {
    const userType = await UserType.findByIdAndDelete(req.params.id);
    if (!userType) {
      return res.status(404).json({ message: "User Type not found" });
    }
    res.json({ message: "UserType deleted" });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all UserType
const getOptUserTypes = async (req, res) => {
  try {
    const userTypes = await UserType.find();
    res.json(userTypes);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  createUserType,
  getAllUserTypes,
  getUserType,
  updateUserType,
  deleteUserType,
  getOptUserTypes,
};
