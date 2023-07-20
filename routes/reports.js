const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");
const primaryConAuth = require("../middlewares/primaryConAuth");

// Controller Functions
const {
  getReportTable,
  getOwnReports,
  getReportDetail,
  getReportInventory,
  getTransaction,
} = require("../controllers/reportController");

/** --- ADMINS --- */
router.get("/table", adminAuth, getReportTable); // Get all ReportTable
router.get("/inventory", primaryConAuth, getReportInventory); // Get all ReportInventory

/** --- ALL --- */
router.get("/transaction", userAuth, getTransaction); // Get all Transaction
router.get("/", userAuth, getOwnReports); // Get a single Report by ID
router.get("/:id", userAuth, getReportDetail); // Get a single Report by ID

module.exports = router;
