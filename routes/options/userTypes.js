const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/userAuth");
const adminAuth = require("../../middlewares/adminAuth");

// Controller Functions
const {
  createUserType,
  getAllUserTypes,
  getUserType,
  updateUserType,
  deleteUserType,
  getOptUserTypes,
} = require("../../controllers/options/userTypeController");

/** --- ADMINS --- */

// Create a new UserType
router.post("/admin", userAuth, adminAuth, createUserType);

// Get all UserTypes
router.get("/admin", userAuth, adminAuth, getAllUserTypes);

// Get a single UserType by ID
router.get("/admin/:id", userAuth, adminAuth, getUserType);

// Update a UserType by ID
router.patch("/admin/:id", userAuth, adminAuth, updateUserType);

// Delete a UserType by ID
router.delete("/admin/:id", userAuth, adminAuth, deleteUserType);

/** --- ANONYMOUS --- */

// Get all UserTypes
router.get("/", getOptUserTypes);

module.exports = router;
