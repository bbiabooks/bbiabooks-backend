const { User } = require("../../models/userModels");
const Report = require("../../models/reportModels");
const Password = require("../../models/passwordModels");
const mongoose = require("mongoose");

/** --- FOR ADMINS, LIBRARIANS, AND ACCOUNTINGS ONLY --- */

// Get all UserTable
const getUserTable = async (req, res) => {
  try {
    const userTable = await User.find()
      .select(
        "username firstName middleName lastName dateRegistered userStatus"
      )
      .populate({
        path: "userType",
        select: "userType",
      })
      .populate({
        path: "branch",
        select: "branch",
      })
      .sort({ dateRegistered: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed user table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(userTable);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all Change Passwords
const getChangePassTable = async (req, res) => {
  try {
    const passwordTable = await Password.find()
      .populate({
        path: "userId",
        select: "firstName lastName userType",
        populate: [{ path: "userType", select: "userType" }],
      })
      .sort({ createdAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed user change passwords table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(passwordTable);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  getUserTable,
  getChangePassTable,
};
