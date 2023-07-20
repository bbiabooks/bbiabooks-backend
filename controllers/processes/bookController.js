const Book = require("../../models/bookModels");
const Report = require("../../models/reportModels");
const mongoose = require("mongoose");

/** --- FOR ALL --- */

// Get all Books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .select(
        "title purchasePrice coverImage numberOfCopies numberOfLoanedOutCopies"
      )
      .populate({
        path: "gradeLevel",
        select: "-_id",
      })
      .populate({
        path: "subjectArea",
        select: "-_id",
      })
      .sort({ createdAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed book catalogue.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

/** --- ALL --- */
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .select(
        "-supplier -numberOfCopies -numberOfSoldCopies -numberOfLostCopies -numberOfDamagedCopies -dateCreated"
      )
      .populate({
        path: "gradeLevel",
        select: "-dateCreated",
      })
      .populate({
        path: "subjectArea",
        select: "-dateCreated",
      });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = "Accessed one book.";
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(book);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  getAllBooks,
  getBook,
};
