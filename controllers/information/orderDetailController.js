const Order = require("../../models/orderModels");
const Report = require("../../models/reportModels");
const Book = require("../../models/bookModels");
const mongoose = require("mongoose");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");
const path = require("path");

/** --- FOR ALL --- */

// Get a single Order
const getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "book",
        select: "coverImage title purchasePrice supplier",
        populate: {
          path: "supplier",
          select: "supplier",
        },
      })
      .populate({
        path: "reservedFor",
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
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed order ${req.params.id} details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();
      res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

/** --- FOR ADMINS (ALL), LIBRARIANS (ORDER STATUS), AND ACCOUNTINGS (PAYMENT STATUS) ONLY --- */

// Update a single Order
const updateOrderDetail = async (req, res) => {
  const { id } = req.params;
  let order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "No such Order" });
  } else {
    let orderStatus = order.orderStatus;

    if (orderStatus === "released") {
      const book = order.book;

      const books = await Book.findById(book).select("_id numberOfSoldCopies");
      const numberOfSoldCopies = books.numberOfSoldCopies + 1;

      const updatedBook = await Book.findByIdAndUpdate(
        book,
        { numberOfSoldCopies },
        {
          new: true,
        }
      );
    } else if (orderStatus === "rejected") {
      const book = order.book;

      const books = await Book.findById(book).select("_id numberOfCopies");
      const numberOfCopies = books.numberOfCopies + 1;

      const updatedBook = await Book.findByIdAndUpdate(
        book,
        { numberOfCopies },
        {
          new: true,
        }
      );
    }

    let result;

    // Check if a new photo is provided
    if (req.file) {
      // Remove the previous image from cloudinary
      if (order.cloudinary_id) {
        await cloudinary.uploader.destroy(order.cloudinary_id);
      }

      // Upload the new image
      result = await cloudinary.uploader.upload(req.file.path);
    }

    const updatedOrderData = {
      ...req.body,
      proofOfPayment: req.file ? result?.secure_url : order.proofOfPayment,
      cloudinary_id: req.file ? result?.public_id : order.cloudinary_id,
    };

    const updatedOrder = await Order.findByIdAndUpdate(id, updatedOrderData, {
      new: true,
    });

    // store report
    const user_id = req.userInfo.id;
    const action = `Updated order ${id}.`;
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Order updated successfully",
      updatedOrder,
    });
  }
};

/** --- FOR ADMINS ONLY --- */

// Delete an Order
const deleteOrderDetail = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id).select("_id book");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    } else {
      // Delete the associated image from Cloudinary if cloudinary_id exists
      if (order.cloudinary_id && order.cloudinary_id !== "") {
        await cloudinary.uploader.destroy(order.cloudinary_id);
      }

      const book = order.book;

      const books = await Book.findById(book).select("_id numberOfCopies");
      const numberOfCopies = books.numberOfCopies + 1;

      const updatedBook = await Book.findByIdAndUpdate(
        book,
        { numberOfCopies },
        {
          new: true,
        }
      );

      order = await Order.findByIdAndDelete(req.params.id);

      // Store report
      const user_id = req.userInfo.id;
      const action = `Deleted order ${req.params.id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(200).json({
        message: "Order deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  getOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};
