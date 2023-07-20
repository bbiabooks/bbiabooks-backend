const mongoose = require("mongoose");

const loanStatusEnum = ["requested", "rejected", "approved", "returned"];
const bookStatusEnum = ["okay", "lost", "damaged"];

const loanSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
      default: () => Date.now() + 3 * 24 * 60 * 60 * 1000,
    },
    loanStatus: {
      type: String,
      enum: loanStatusEnum,
      default: "requested",
    },
    bookStatus: {
      type: String,
      enum: bookStatusEnum,
      default: "okay",
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { updatedAt: true } }
);

module.exports = mongoose.model("Loan", loanSchema);
