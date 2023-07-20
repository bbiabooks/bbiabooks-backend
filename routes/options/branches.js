const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/userAuth");
const adminAuth = require("../../middlewares/adminAuth");
const secondaryConAuth = require("../../middlewares/secondaryConAuth");

// Controller Functions
const {
  createBranch,
  getAllBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  getOptBranches,
} = require("../../controllers/options/branchController");

/** --- ADMINS --- */

// Create a new branch
router.post("/admin", userAuth, adminAuth, createBranch);

// Update a branch by ID
router.patch("/admin/:id", userAuth, adminAuth, updateBranch);

// Delete a branch by ID
router.delete("/admin/:id", userAuth, adminAuth, deleteBranch);

/** --- ADMINS . LIBRARIANS --- */

// Get all branches
router.get("/admin", userAuth, secondaryConAuth, getAllBranches);

// Get a single branch by ID
router.get("/admin/:id", userAuth, secondaryConAuth, getBranch);

/** --- ANONYMOUS --- */

// Get all branches
router.get("/", getOptBranches);

module.exports = router;
