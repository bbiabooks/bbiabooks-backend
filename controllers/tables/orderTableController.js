const Order = require("../../models/orderModels");
const Report = require("../../models/reportModels");
const mongoose = require("mongoose");

/** --- FOR ADMINS, LIBRARIANS, AND ACCOUNTANTS ONLY --- */

// Get all OrderTable
const getOrderTable = async (req, res) => {
  try {
    const orderTable = await Order.find()
      .select("_id book reservedFor arrivalDate updatedAt orderStatus")
      .populate({
        path: "book",
        select: "_id title coverImage",
      })
      .populate({
        path: "reservedFor",
        select: "_id userType firstName lastName",
        populate: {
          path: "userType",
          select: "_id userType",
        },
      })
      .sort({ updatedAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed order table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(orderTable);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all PaymentTable
const getPaymentTable = async (req, res) => {
  try {
    const paymentTable = await Order.find()
      .select("_id book reservedFor updatedAt orderStatus paymentStatus")
      .populate({
        path: "book",
        select: "_id title purchasePrice coverImage",
      })
      .populate({
        path: "reservedFor",
        select: "_id firstName lastName",
      })
      .sort({ updatedAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed payment table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(paymentTable);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  getOrderTable,
  getPaymentTable,
};
