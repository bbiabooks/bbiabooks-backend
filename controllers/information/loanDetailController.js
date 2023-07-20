const Loan = require("../../models/loanModels");
const Report = require("../../models/reportModels");
const Book = require("../../models/bookModels");
const mongoose = require("mongoose");

/** --- FOR ALL --- */

// Get a single Loan
const getLoanDetail = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate({
        path: "book",
        select: "title subjectArea gradeLevel",
        populate: [
          { path: "subjectArea", select: "subjectArea" },
          { path: "gradeLevel", select: "gradeLevel" },
        ],
      })
      .populate({
        path: "borrower",
        select: "firstName lastName userType subjectArea gradeLevel",
        populate: [
          { path: "userType", select: "userType" },
          { path: "subjectArea", select: "subjectArea" },
          { path: "gradeLevel", select: "gradeLevel" },
        ],
      })
      .populate({
        path: "user_id",
        select: "userType firstName lastName",
        populate: {
          path: "userType",
        },
      });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed loan ${req.params.id} details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(loan);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

/** --- FOR ADMINS (ALL) AND LIBRARIANS (LOAN STATUS) ONLY --- */

// Update a single Loan
const updateLoanDetail = async (req, res) => {
  const { id } = req.params;

  const updatedLoan = await Loan.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedLoan) {
    return res.status(404).json({ message: "No such Loan" });
  } else {
    let loanStatus = updatedLoan.loanStatus;
    let bookStatus = updatedLoan.bookStatus;

    if (loanStatus === "returned" && bookStatus === "okay") {
      const book = updatedLoan.book;

      const books = await Book.findById(book).select(
        "_id numberOfCopies numberOfLoanedOutCopies"
      );
      const numberOfCopies = books.numberOfCopies + 1;
      const numberOfLoanedOutCopies = books.numberOfLoanedOutCopies - 1;

      const updatedBook = await Book.findByIdAndUpdate(
        book,
        { numberOfCopies, numberOfLoanedOutCopies },
        {
          new: true,
        }
      );
    } else if (
      loanStatus === "returned" &&
      (bookStatus === "damaged" || "lost")
    ) {
      const book = updatedLoan.book;

      const books = await Book.findById(book).select(
        "_id numberOfDamagedCopies numberOfLostCopies"
      );
      let numberOfDamagedCopies = books.numberOfDamagedCopies;
      let numberOfLostCopies = books.numberOfLostCopies;

      if (bookStatus === "damaged") {
        numberOfDamagedCopies = books.numberOfDamagedCopies + 1;
      } else {
        numberOfLostCopies = books.numberOfLostCopies + 1;
      }

      const updatedBook = await Book.findByIdAndUpdate(
        book,
        { numberOfDamagedCopies, numberOfLostCopies },
        {
          new: true,
        }
      );
    }

    // store report
    const user_id = req.userInfo.id;
    const action = `Updated loan ${id}.`;
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Loan updated successfully",
      updatedLoan,
    });
  }
};

/** --- FOR ADMINS ONLY --- */

// Delete a Loan
const deleteLoanDetail = async (req, res) => {
  try {
    let loan = await Loan.findById(req.params.id).select("_id book");

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    } else {
      const book = loan.book;

      const books = await Book.findById(book).select("_id numberOfCopies");
      const numberOfCopies = books.numberOfCopies + 1;

      const updatedBook = await Book.findByIdAndUpdate(
        book,
        { numberOfCopies },
        {
          new: true,
        }
      );

      loan = await Loan.findByIdAndDelete(req.params.id);

      // store report
      const user_id = req.userInfo.id;
      const action = `Deleted loan ${req.params.id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "Loan deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  getLoanDetail,
  updateLoanDetail,
  deleteLoanDetail,
};
