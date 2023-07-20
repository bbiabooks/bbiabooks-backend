const jwt = require("jsonwebtoken");
const { User } = require("../models/userModels");

const userAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;

  // Check if authorization exists
  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  // Split JSON Web Token
  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    // Retrieve user information from the database based on the _id
    req.userInfo = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    res.status(401).json({ message: `${error}` });
  }
};

module.exports = userAuth;
