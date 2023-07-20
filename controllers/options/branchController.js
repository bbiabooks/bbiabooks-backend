const { Branch } = require("../../models/optionModels");
const Report = require("../../models/reportModels");
const mongoose = require("mongoose");

// Create a new branch
const createBranch = async (req, res) => {
  try {
    const { branch, address, email, phoneNumber } = req.body;

    // Check if required field is empty
    const requiredFields = ["branch", "address", "email", "phoneNumber"];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

    const branches = await Branch.findOne({ branch });
    if (branches) {
      throw new Error("Branch name already exists.");
    }

    // Create document
    const newBranch = new Branch({
      branch,
      address,
      email,
      phoneNumber,
    });

    // Upload document to database
    await newBranch.save();

    // store report
    const user_id = req.userInfo.id;
    const action = "Created a branch.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Branch created successfully",
      newBranch,
    });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all branch
const getAllBranches = async (req, res) => {
  try {
    const branch = await Branch.find()
      .select("_id branch address")
      .sort({ createdAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed branch table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

// Get a single branch
const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // store report
    const user_id = req.userInfo.id;
    const action = `Accessed branch ${req.params.id} details.`;
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

// Update a branch
const updateBranch = async (req, res) => {
  const { id } = req.params;

  const updatedBranch = await Branch.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedBranch) {
    return res.status(404).json({ message: "No such Branch" });
  } else {
    // store report
    const user_id = req.userInfo.id;
    const action = `Updated branch ${id}.`;
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Branch updated successfully",
      updatedBranch,
    });
  }
};

// Delete a branch
const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Deleted branch ${req.params.id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "Branch deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all branch
const getOptBranches = async (req, res) => {
  try {
    const branch = await Branch.find().select("_id branch address");

    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  getOptBranches,
};
