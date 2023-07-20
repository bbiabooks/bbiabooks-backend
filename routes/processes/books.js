const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/userAuth");
const primaryConAuth = require("../../middlewares/primaryConAuth");
const secondaryConAuth = require("../../middlewares/secondaryConAuth");
const adminAuth = require("../../middlewares/adminAuth");
const librarianAuth = require("../../middlewares/librarianAuth");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");

// Controller Functions
const {
  getAllBooks,
  getBook,
} = require("../../controllers/processes/bookController");
const {
  createBookDetail,
  getBookDetail,
  updateBookDetail,
  deleteBookDetail,
} = require("../../controllers/information/bookDetailController");
const {
  getBookTable,
} = require("../../controllers/tables/bookTableController");

/** --- ADMINS . LIBRARIANS . ACCOUNTANTS --- */
router.get("/table", userAuth, primaryConAuth, getBookTable); // Get all BookTable

/** --- ADMINS . LIBRARIANS --- */
router.get("/detail/:id", userAuth, secondaryConAuth, getBookDetail); // Get a single BookDetail by ID
router.patch(
  "/detail/:id",
  upload.single("coverImage"),
  userAuth,
  secondaryConAuth,
  updateBookDetail
); // Update a BookDetail by ID

/** --- ADMINS --- */
router.delete("/detail/:id", userAuth, adminAuth, deleteBookDetail); // Delete a BookDetail by ID

/** --- LIBRARIANS --- */
router.post(
  "/detail",
  upload.single("coverImage"),
  userAuth,
  librarianAuth,
  createBookDetail
); // Create a new BookDetail

/** --- ALL --- */
router.get("/", userAuth, getAllBooks); // Get all Book
router.get("/:id", userAuth, getBook); // Get a single Book by ID

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
