const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// Controller Functions
const {
  createSignupDetail,
  getSignupDetail,
  deleteSignupDetail,
  getSignupTable,
} = require("../controllers/signupController");

/** --- ADMINS --- */
router.get("/table", userAuth, adminAuth, getSignupTable); // Get all SignupTable

/** --- ADMINS --- */
router.delete("/admin/:id", userAuth, adminAuth, deleteSignupDetail); // Delete a Signup by ID
router.get("/:id", userAuth, getSignupDetail); // Get a single User by ID

/** ANONYMOUS */
router.post("/", upload.single("idPhoto"), createSignupDetail); // Create a new Signup

// Error handling middleware
router.use((err, req, res, next) => {
  if (err.statusCode && err.statusCode === 400) {
    return res.status(400).json({ message: err.message });
  }
  // Handle other errors
  return res.status(500).json({
    message:
      "File is not supported. Please upload a photo with JPEG, JPG, PNG format only.",
  });
});

module.exports = router;
