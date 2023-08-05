const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const primaryConAuth = require("../middlewares/primaryConAuth");
const adminAuth = require("../middlewares/adminAuth");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// Controller Functions
const {
  userSignup,
  userLogin,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { getUserTable } = require("../controllers/tables/userTableController");

/** --- ADMINS . LIBRARIANS . ACCOUNTANTS --- */
router.get("/table", userAuth, primaryConAuth, getUserTable); // Get all UserTable

/** --- ADMINS --- */
router.post(
  "/admin",
  upload.single("idPhoto"),
  userAuth,
  adminAuth,
  userSignup
); // Create a new User + Signup
router.patch("/admin/:id", upload.single("idPhoto"), userAuth, updateUser); // Update a User by ID
router.delete("/admin/:id", userAuth, adminAuth, deleteUser); // Delete a User by ID

/** --- ALL --- */
router.post("/login", userLogin); // Authenticate User
router.get("/:id", userAuth, getUser); // Get a single User by ID

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
