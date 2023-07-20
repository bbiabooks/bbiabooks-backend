const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/userAuth");
const adminAuth = require("../../middlewares/adminAuth");
const secondaryConAuth = require("../../middlewares/secondaryConAuth");

// Controller Functions
const {
  createSubjectArea,
  getAllSubjectAreas,
  getSubjectArea,
  updateSubjectArea,
  deleteSubjectArea,
  getOptSubjectAreas,
} = require("../../controllers/options/subjectAreaController");

/** --- ADMINS --- */

// Create a new SubjectArea
router.post("/admin", userAuth, adminAuth, createSubjectArea);

// Get all SubjectAreas
router.get("/admin", userAuth, secondaryConAuth, getAllSubjectAreas);

// Get a single SubjectArea by ID
router.get("/admin/:id", userAuth, adminAuth, getSubjectArea);

// Update a SubjectArea by ID
router.patch("/admin/:id", userAuth, adminAuth, updateSubjectArea);

// Delete a SubjectArea by ID
router.delete("/admin/:id", userAuth, adminAuth, deleteSubjectArea);

/** --- ANONYMOUS --- */

// Get all SubjectAreas
router.get("/", getOptSubjectAreas);

module.exports = router;
