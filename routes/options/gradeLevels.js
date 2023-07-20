const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/userAuth");
const adminAuth = require("../../middlewares/adminAuth");
const secondaryConAuth = require("../../middlewares/secondaryConAuth");

// Controller Functions
const {
  createGradeLevel,
  getAllGradeLevels,
  getGradeLevel,
  updateGradeLevel,
  deleteGradeLevel,
  getOptGradeLevels,
} = require("../../controllers/options/gradeLevelController");

/** --- ADMINS --- */

// Create a new GradeLevel
router.post("/admin", userAuth, adminAuth, createGradeLevel);

// Get all Categories
router.get("/admin", userAuth, secondaryConAuth, getAllGradeLevels);

// Get a single GradeLevel by ID
router.get("/admin/:id", userAuth, adminAuth, getGradeLevel);

// Update a GradeLevel by ID
router.patch("/admin/:id", userAuth, adminAuth, updateGradeLevel);

// Delete a GradeLevel by ID
router.delete("/admin/:id", userAuth, adminAuth, deleteGradeLevel);

/** --- ANONYMOUS --- */

// Get all Categories
router.get("/", getOptGradeLevels);

module.exports = router;
