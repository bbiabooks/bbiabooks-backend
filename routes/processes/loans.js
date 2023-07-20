const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/userAuth");
const secondaryConAuth = require("../../middlewares/secondaryConAuth");
const clientConAuth = require("../../middlewares/clientConAuth");
const adminAuth = require("../../middlewares/adminAuth");
const librarianAuth = require("../../middlewares/librarianAuth");

// Controller Functions
const {
  createLoan,
  getOwnLoans,
} = require("../../controllers/processes/loanController");
const {
  getLoanDetail,
  updateLoanDetail,
  deleteLoanDetail,
} = require("../../controllers/information/loanDetailController");
const {
  getLoanTable,
} = require("../../controllers/tables/loanTableController");

/** --- ADMINS . LIBRARIANS --- */
router.get("/table", userAuth, secondaryConAuth, getLoanTable); // Get all LoanTable
router.patch("/detail/:id", userAuth, secondaryConAuth, updateLoanDetail); // Update a LoanDetail by ID

/** --- ADMINS --- */
router.delete("/detail/:id", userAuth, adminAuth, deleteLoanDetail); // Delete a LoanDetail by ID

/** --- LIBRARIANS --- */
router.post("/librarian", userAuth, librarianAuth, createLoan); // Create a new Loan

/** --- TEACHERS . STUDENTS --- */
router.post("/", userAuth, clientConAuth, createLoan); // Create a new Loan
router.get("/", userAuth, clientConAuth, getOwnLoans); // Get all Own Loans

/** --- ALL --- */
router.get("/detail/:id", userAuth, getLoanDetail); // Get single LoanDetail

module.exports = router;
