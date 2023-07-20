const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/userAuth");
const primaryConAuth = require("../../middlewares/primaryConAuth");
const librarianAuth = require("../../middlewares/librarianAuth");
const clientConAuth = require("../../middlewares/clientConAuth");
const adminAuth = require("../../middlewares/adminAuth");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");

// Controller Functions
const {
  createOrder,
  getOwnOrders,
} = require("../../controllers/processes/orderController");
const {
  getOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
} = require("../../controllers/information/orderDetailController");
const {
  getOrderTable,
  getPaymentTable,
} = require("../../controllers/tables/orderTableController");

/** --- ADMINS . LIBRARIANS . ACCOUNTANTS --- */
router.get("/table", userAuth, primaryConAuth, getOrderTable); // Get all OrderTable
router.get("/payment", userAuth, primaryConAuth, getPaymentTable); // Get all PaymentTable
router.patch(
  "/detail/:id",
  upload.single("proofOfPayment"),
  userAuth,
  primaryConAuth,
  updateOrderDetail
); // Update an OrderDetail by ID

/** --- ADMINS --- */
router.delete("/detail/:id", userAuth, adminAuth, deleteOrderDetail); // Delete an OrderDetail by ID

/** --- LIBRARIANS --- */
router.post(
  "/librarian",
  upload.single("proofOfPayment"),
  userAuth,
  librarianAuth,
  createOrder
); // Create a new Order

/** --- TEACHERS . STUDENTS --- */
router.post(
  "/",
  upload.single("proofOfPayment"),
  userAuth,
  clientConAuth,
  createOrder
); // Create a new Order
router.get("/", userAuth, clientConAuth, getOwnOrders); // Get all Own Orders

/** --- ALL --- */
router.get("/detail/:id", userAuth, getOrderDetail); // Get single OrderDetail

module.exports = router;
