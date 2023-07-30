const Book = require("../../models/bookModels");
const Report = require("../../models/reportModels");
const mongoose = require("mongoose");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");
const path = require("path");

/** --- FOR LIBRARIANS ONLY --- */

// Create a new book
const createBookDetail = async (req, res) => {
  try {
    const {
      title,
      bookDescription,
      authors,
      ISBN,
      publicationDate,
      edition,
      language,
      location,
      purchasePrice,
      gradeLevel,
      subjectArea,
      numberOfCopies,
      supplier,
    } = req.body;

    // Check if required field is empty
    const requiredFields = [
      "title",
      "bookDescription",
      "authors",
      "ISBN",
      "publicationDate",
      "edition",
      "language",
      "location",
      "purchasePrice",
      "gradeLevel",
      "subjectArea",
      "numberOfCopies",
      "supplier",
    ];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

    const books = await Book.findOne({ title });
    if (books) {
      throw new Error("Book already exists.");
    } else {
      // Upload the coverImage if it exists
      let result = null; // Default value for result
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }

      // Create document
      let newBook = new Book({
        title,
        bookDescription,
        authors,
        ISBN,
        publicationDate,
        edition,
        language,
        location,
        purchasePrice,
        gradeLevel,
        subjectArea,
        numberOfCopies,
        supplier,
        coverImage: result ? result.secure_url : "",
        cloudinary_id: result ? result.public_id : "",
      });

      // Upload document to database
      await newBook.save();

      // store report
      const user_id = req.userInfo.id;
      const action = "Created a book.";
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "Book created successfully",
        newBook,
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

/** --- FOR ADMINS AND LIBRARIANS ONLY --- */

// Get a single book
const getBookDetail = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate({
        path: "supplier",
      })
      .populate({
        path: "gradeLevel",
      })
      .populate({
        path: "subjectArea",
      });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed book ${req.params.id} details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(book);
    }
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

/** --- FOR ADMINS ONLY --- */

// Update a book
const updateBookDetail = async (req, res) => {
  const { id } = req.params;
  let book = await Book.findById(id);

  if (!book) {
    return res.status(404).json({ message: "No such book" });
  } else {
    let result;

    // Check if a new photo is provided
    if (req.file) {
      // Remove the previous image from cloudinary
      if (book.cloudinary_id) {
        await cloudinary.uploader.destroy(book.cloudinary_id);
      }

      // Upload the new image
      result = await cloudinary.uploader.upload(req.file.path);
    }

    const updatedBookData = {
      ...req.body,
      coverImage: req.file ? result?.secure_url : book.coverImage,
      cloudinary_id: req.file ? result?.public_id : book.cloudinary_id,
    };

    const updatedBook = await Book.findByIdAndUpdate(id, updatedBookData, {
      new: true,
    });

    // Store report
    const user_id = req.userInfo.id;
    const action = `Updated book ${id}.`;
    const newReport = new Report({
      user_id,
      action,
    });

    await newReport.save();

    res.status(201).json({
      message: "Book updated successfully",
      updatedBook,
    });
  }
};

// Delete a book
const deleteBookDetail = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      // Delete the associated image from Cloudinary if cloudinary_id exists
      if (book.cloudinary_id && book.cloudinary_id !== "") {
        await cloudinary.uploader.destroy(book.cloudinary_id);
      }

      // Store report
      const user_id = req.userInfo.id;
      const action = `Deleted book ${req.params.id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "Book deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  createBookDetail,
  getBookDetail,
  updateBookDetail,
  deleteBookDetail,
};
