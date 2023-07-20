const { GradeLevel } = require("../../models/optionModels");
const Report = require("../../models/reportModels");
const mongoose = require("mongoose");

// Create a new GradeLevel
const createGradeLevel = async (req, res) => {
  try {
    const { gradeLevel } = req.body;

    // Check if required field is empty
    const requiredFields = ["gradeLevel"];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

    const gradeLevels = await GradeLevel.findOne({ gradeLevel });
    if (gradeLevels) {
      throw new Error("Grade Level name already exists.");
    }

    // Create document
    const newGradeLevel = new GradeLevel({
      gradeLevel,
    });

    // Upload document to database
    await newGradeLevel.save();

    // store report
    const user_id = req.userInfo.id;
    const action = "Created a grade level.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Grade Level created successfully",
      newGradeLevel,
    });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all GradeLevel
const getAllGradeLevels = async (req, res) => {
  try {
    const gradeLevels = await GradeLevel.find().sort({ createdAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed grade level table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(gradeLevels);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get a single GradeLevel
const getGradeLevel = async (req, res) => {
  try {
    const gradeLevel = await GradeLevel.findById(req.params.id);
    if (!gradeLevel) {
      return res.status(404).json({ message: "Grade Level not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed grade level ${req.params.id} details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(gradeLevel);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Update a GradeLevel
const updateGradeLevel = async (req, res) => {
  const { id } = req.params;

  const updatedGradeLevel = await GradeLevel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedGradeLevel) {
    return res.status(404).json({ message: "No such Grade Level" });
  } else {
    // store report
    const user_id = req.userInfo.id;
    const action = `Updated grade level ${id}.`;
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Grade Level updated successfully",
      updatedGradeLevel,
    });
  }
};

// Delete a GradeLevel
const deleteGradeLevel = async (req, res) => {
  try {
    const gradeLevel = await GradeLevel.findByIdAndDelete(req.params.id);

    if (!gradeLevel) {
      return res.status(404).json({ message: "Grade Level not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Deleted grade level ${req.params.id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "Grade Level deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all GradeLevel
const getOptGradeLevels = async (req, res) => {
  try {
    const gradeLevels = await GradeLevel.find();

    res.json(gradeLevels);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  createGradeLevel,
  getAllGradeLevels,
  getGradeLevel,
  updateGradeLevel,
  deleteGradeLevel,
  getOptGradeLevels,
};
