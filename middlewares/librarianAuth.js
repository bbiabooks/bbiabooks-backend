const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { User } = require("../models/userModels");

const librarianAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;

  // Check if authorization exists
  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.userInfo = await User.findOne({ _id }).select("_id userType").populate({
      path: "userType",
      select: "userType",
    });

    if (req.userInfo.userType.userType !== "Librarian") {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: `${error}` });
  }
};

module.exports = librarianAuth;
