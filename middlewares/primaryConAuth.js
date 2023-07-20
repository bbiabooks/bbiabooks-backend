const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { User } = require("../models/userModels");

const conditionalAuth = (req, res, next) => {
  const { userType } = req.userInfo;

  // Check if user has admin, librarian, or accountant userType
  const hasAdminAccess = userType.userType === "Admin";
  const hasLibrarianAccess = userType.userType === "Librarian";
  const hasAccountantAccess = userType.userType === "Accountant";

  // Check if any of the required roles are present
  if (hasAdminAccess || hasLibrarianAccess || hasAccountantAccess) {
    next(); // User has access, proceed to the next middleware or route handler
  } else {
    res.status(403).json({ message: "Access denied" }); // User doesn't have the required roles
  }
};

const primaryConAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;

  // Check if authorization exists
  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.userInfo = await User.findOne({ _id })
      .select("_id userType")
      .populate("userType", "userType");
    conditionalAuth(req, res, next); // Call the conditionalAuth middleware
  } catch (error) {
    return res.status(500).json({ message: `${error}` });
  }
};

module.exports = primaryConAuth;
