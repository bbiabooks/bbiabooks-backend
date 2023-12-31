const Loan = require("../../models/loanModels");
const Report = require("../../models/reportModels");
const Book = require("../../models/bookModels");
const mongoose = require("mongoose");

/** --- FOR LIBRARIANS, TEACHERS, AND STUDENTS ONLY --- */

// Create a new Loan
const createLoan = async (req, res) => {
  try {
    let { book, borrower, loanStatus } = req.body;
    const user_id = req.userInfo.id;
    let dueDate;
    const createdAt = Date.now();

    // Check if required field is empty
    const requiredFields = ["book", "borrower"];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

    const currentDate = new Date();

    const validation = await Loan.findOne({
      book,
      borrower,
      createdAt: {
        $gte: new Date(currentDate.setHours(0, 0, 0, 0)), // Start of the current day
        $lt: new Date(currentDate.setHours(24, 0, 0, 0)), // End of the current day
      },
    });

    if (validation) {
      throw new Error(
        "Borrowed Book already exists. You cannot borrow the same book."
      );
    } else {
      const books = await Book.findById(book).select(
        "_id numberOfCopies numberOfLoanedOutCopies"
      );
      let numberOfCopies = books.numberOfCopies;
      let numberOfLoanedOutCopies = books.numberOfLoanedOutCopies;

      if (numberOfCopies > 3) {
        numberOfCopies = numberOfCopies - 1;
        numberOfLoanedOutCopies = numberOfLoanedOutCopies + 1;

        const updatedBook = await Book.findByIdAndUpdate(
          book,
          { numberOfCopies, numberOfLoanedOutCopies },
          {
            new: true,
          }
        );
      } else {
        loanStatus = "rejected";
        dueDate = Date.now();
      }

      // Create document
      const newLoan = new Loan({
        book,
        borrower,
        user_id,
        dueDate,
        loanStatus,
      });

      // Upload document to database
      await newLoan.save();

      // store report
      const action = `Created a borrow for ${borrower}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "Borrow created successfully",
        newLoan,
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

/** --- FOR TEACHERS AND STUDENTS ONLY --- */

// Get all OWN Loans
const getOwnLoans = async (req, res) => {
  try {
    const user_id = req.userInfo.id;
    const loans = await Loan.find({ borrower: user_id })
      .select("_id book loanStatus bookStatus dueDate updatedAt")
      .populate({
        path: "book",
        select: "_id title subjectArea gradeLevel coverImage",
      })
      .sort({ createdAt: -1 });

    // store report
    const action = "Accessed own borrows.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  createLoan,
  getOwnLoans,
};
