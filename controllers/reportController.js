const Report = require("../models/reportModels");
const Inventory = require("../models/inventoryModels");
const Transaction = require("../models/transactionModels");
const { User } = require("../models/userModels");
const Book = require("../models/bookModels");
const Order = require("../models/orderModels");
const Loan = require("../models/loanModels");
const mongoose = require("mongoose");

/** --- FOR ADMIN ONLY --- */

// Get all ReportTable
const getReportTable = async (req, res) => {
  try {
    const reportTable = await Report.find()
      .select("_id user_id action createdAt")
      .populate({
        path: "user_id",
        select: "_id userType",
        populate: {
          path: "userType",
          select: "userType",
        },
      })
      .sort({ createdAt: -1 });
    res.json(reportTable);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

/** --- FOR ALL --- */

// Get all OWN Reports
const getOwnReports = async (req, res) => {
  try {
    const user_id = req.userInfo.id;
    const reports = await Report.find({ user_id })
      .select("_id action createdAt")
      .populate({
        path: "user_id",
        select: "_id firstName lastName username",
      })
      .sort({ createdAt: -1 });

    // store report
    const action = `Accessed dashboard.`;
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get a single report
const getReportDetail = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate({
      path: "user_id",
      select:
        "_id username firstName middleName lastName userType subjectArea gradeLevel branch",
      populate: [
        { path: "userType", select: "userType" },
        { path: "subjectArea", select: "subjectArea" },
        { path: "gradeLevel", select: "gradeLevel" },
        { path: "branch", select: "branch" },
      ],
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed report ${req.params.id} details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(report);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all ReportInventory
const getReportInventory = async (req, res) => {
  try {
    const numberOfUsers = await User.countDocuments();
    const numberOfBooks = await Book.countDocuments();
    const numberOfPendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });
    const numberOfPlacedOrders = await Order.countDocuments({
      orderStatus: "placed",
    });
    const numberOfAvailable = await Order.countDocuments({
      orderStatus: "available",
    });
    const numberOfPendingPayments = await Order.countDocuments({
      paymentStatus: "pending",
    });
    const numberOfReleased = await Order.countDocuments({
      orderStatus: "released",
    });
    const numberOfPendingLoans = await Loan.countDocuments({
      loanStatus: "requested",
    });
    const numberOfApprovedLoans = await Loan.countDocuments({
      loanStatus: "approved",
    });

    const newInventory = new Inventory({
      numberOfUsers,
      numberOfBooks,
      numberOfPendingOrders,
      numberOfPlacedOrders,
      numberOfAvailable,
      numberOfPendingPayments,
      numberOfReleased,
      numberOfPendingLoans,
      numberOfApprovedLoans,
    });

    await newInventory.save();

    res.json(newInventory);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all Transaction
const getTransaction = async (req, res) => {
  try {
    const user_id = req.userInfo.id;
    const numberOfPendingOrders = await Order.countDocuments({
      reservedFor: user_id,
      orderStatus: "pending",
    });
    const numberOfPlacedOrders = await Order.countDocuments({
      reservedFor: user_id,
      orderStatus: "placed",
    });
    const numberOfAvailable = await Order.countDocuments({
      reservedFor: user_id,
      orderStatus: "available",
    });
    const numberOfPendingPayments = await Order.countDocuments({
      reservedFor: user_id,
      paymentStatus: "pending",
    });
    const numberOfPendingLoans = await Loan.countDocuments({
      borrower: user_id,
      loanStatus: "requested",
    });
    const numberOfApprovedLoans = await Loan.countDocuments({
      borrower: user_id,
      loanStatus: "approved",
    });

    const newTransaction = new Transaction({
      numberOfPendingOrders,
      numberOfPlacedOrders,
      numberOfAvailable,
      numberOfPendingPayments,
      numberOfPendingLoans,
      numberOfApprovedLoans,
    });

    await newTransaction.save();

    res.json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  getReportTable,
  getOwnReports,
  getReportDetail,
  getReportInventory,
  getTransaction,
};
