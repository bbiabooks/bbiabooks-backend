const mongoose = require("mongoose");

const changeStatsEnum = ["approved", "pending"];

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  changeStatus: {
    type: String,
    enum: changeStatsEnum,
    default: "pending",
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("Password", passwordSchema);
