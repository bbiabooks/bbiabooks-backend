const { SubjectArea } = require("../../models/optionModels");
const Report = require("../../models/reportModels");
const mongoose = require("mongoose");

// Create a new SubjectArea
const createSubjectArea = async (req, res) => {
  try {
    const { subjectArea } = req.body;

    // Check if required field is empty
    const requiredFields = ["subjectArea"];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

    const subjectAreas = await SubjectArea.findOne({ subjectArea });
    if (subjectAreas) {
      throw new Error("Subject Area name already exists.");
    }

    // Create document
    const newSubjectArea = new SubjectArea({
      subjectArea,
    });

    // Upload document to database
    await newSubjectArea.save();

    // store report
    const user_id = req.userInfo.id;
    const action = "Created a subject area.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Subject Area created successfully",
      newSubjectArea,
    });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all SubjectArea
const getAllSubjectAreas = async (req, res) => {
  try {
    const subjectAreas = await SubjectArea.find().sort({ createdAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed subject area table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(subjectAreas);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get a single SubjectArea
const getSubjectArea = async (req, res) => {
  try {
    const subjectArea = await SubjectArea.findById(req.params.id);
    if (!subjectArea) {
      return res.status(404).json({ message: "Subject Area not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed subject area ${req.params.id} details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(subjectArea);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Update a SubjectArea
const updateSubjectArea = async (req, res) => {
  const { id } = req.params;

  const updatedSubjectArea = await SubjectArea.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedSubjectArea) {
    return res.status(404).json({ message: "No such Subject Area" });
  } else {
    // store report
    const user_id = req.userInfo.id;
    const action = `Updated subject area ${id}.`;
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Subject Area updated successfully",
      updatedSubjectArea,
    });
  }
};

// Delete a SubjectArea
const deleteSubjectArea = async (req, res) => {
  try {
    const subjectArea = await SubjectArea.findByIdAndDelete(req.params.id);
    if (!subjectArea) {
      return res.status(404).json({ message: "Subject Area not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Deleted subject area ${req.params.id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "Subject Area deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all SubjectArea
const getOptSubjectAreas = async (req, res) => {
  try {
    const subjectAreas = await SubjectArea.find();

    res.json(subjectAreas);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  createSubjectArea,
  getAllSubjectAreas,
  getSubjectArea,
  updateSubjectArea,
  deleteSubjectArea,
  getOptSubjectAreas,
};
