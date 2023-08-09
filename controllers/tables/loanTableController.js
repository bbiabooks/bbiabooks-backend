const Loan = require("../../models/loanModels");
const Report = require("../../models/reportModels");
const mongoose = require("mongoose");

/** --- FOR ADMINS AND LIBRARIANS ONLY --- */

// Get all LoanTable
const getLoanTable = async (req, res) => {
  try {
    const loanTable = await Loan.find()
      .select(
        "_id book borrower dueDate updatedAt loanStatus bookStatus updatedAt"
      )
      .populate({
        path: "book",
        select: "_id title coverImage",
      })
      .populate({
        path: "borrower",
        select: "_id branch userType firstName lastName",
        populate: [
          { path: "branch", select: "_id branch" },
          { path: "userType", select: "_id userType" },
        ],
      })
      .sort({ updatedAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed loan table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(loanTable);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  getLoanTable,
};
