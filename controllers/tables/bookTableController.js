const Book = require("../../models/bookModels");
const Report = require("../../models/reportModels");
const mongoose = require("mongoose");

/** --- FOR ADMINS, LIBRARIANS, AND ACCOUNTANTS ONLY --- */

// Get all BookTable
const getBookTable = async (req, res) => {
  try {
    const bookTable = await Book.find()
      .select(
        "_id gradeLevel subjectArea coverImage title numberOfCopies numberOfLoanedOutCopies createdAt"
      )
      .populate({
        path: "gradeLevel",
      })
      .populate({
        path: "subjectArea",
      })
      .sort({ createdAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed book table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(bookTable);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  getBookTable,
};
