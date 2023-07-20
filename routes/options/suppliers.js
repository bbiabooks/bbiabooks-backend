const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/userAuth");
const adminAuth = require("../../middlewares/adminAuth");
const secondaryConAuth = require("../../middlewares/secondaryConAuth");

// Controller Functions
const {
  createSupplier,
  getAllSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../../controllers/options/supplierController");

/** --- ADMINS --- */

// Create a new supplier
router.post("/admin", userAuth, adminAuth, createSupplier);

// Update a supplier by ID
router.patch("/admin/:id", userAuth, adminAuth, updateSupplier);

// Delete a supplier by ID
router.delete("/admin/:id", userAuth, adminAuth, deleteSupplier);

/** --- ADMINS . LIBRARIANS */
// Get all suppliers
router.get("/admin", userAuth, secondaryConAuth, getAllSuppliers);

// Get a single supplier by ID
router.get("/admin/:id", userAuth, secondaryConAuth, getSupplier);

module.exports = router;
