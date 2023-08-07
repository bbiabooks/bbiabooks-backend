const Order = require("../../models/orderModels");
const Report = require("../../models/reportModels");
const Book = require("../../models/bookModels");
const mongoose = require("mongoose");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");
const path = require("path");

/** --- FOR LIBRARIANS, TEACHERS, AND STUDENTS ONLY --- */

// Create a new Order
const createOrder = async (req, res) => {
  try {
    const { book, paymentMethod, reservedFor, orderStatus, quantity } =
      req.body;
    const user_id = req.userInfo.id;
    let arrivalDate;

    // Check if required field is empty
    const requiredFields = ["book", "reservedFor", "quantity"];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

    const books = await Book.findById(book).select("_id numberOfCopies");
    let numberOfCopies = books.numberOfCopies;

    if (numberOfCopies > 3) {
      arrivalDate = Date.now();
      numberOfCopies = numberOfCopies - quantity;

      const updatedBook = await Book.findByIdAndUpdate(
        book,
        { numberOfCopies },
        {
          new: true,
        }
      );
    }

    // Upload the proofOfPayment if it exists
    let result = null; // Default value for result
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    // Create document
    const newOrder = new Order({
      book,
      paymentMethod,
      reservedFor,
      user_id,
      arrivalDate,
      orderStatus,
      quantity,
      proofOfPayment: result ? result.secure_url : "",
      cloudinary_id: result ? result.public_id : "",
    });

    // Upload document to database
    await newOrder.save();

    // store report
    const action = `Created order for ${reservedFor}.`;
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Order created successfully",
      newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

/** --- FOR TEACHERS AND STUDENTS ONLY --- */

// Get all OWN Orders
const getOwnOrders = async (req, res) => {
  try {
    const user_id = req.userInfo.id;
    const orders = await Order.find({ reservedFor: user_id })
      .select(
        "_id book orderStatus paymentStatus arrivalDate createdAt updatedAt reservedFor"
      )
      .populate({
        path: "book",
        select: "_id title purchasePrice coverImage",
      })
      .sort({ createdAt: -1 });

    // store report
    const action = "Accessed own orders.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  createOrder,
  getOwnOrders,
};
