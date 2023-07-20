const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    numberOfPendingOrders: {
      type: String,
    },
    numberOfPlacedOrders: {
      type: String,
    },
    numberOfAvailable: {
      type: String,
    },
    numberOfPendingPayments: {
      type: String,
    },
    numberOfPendingLoans: {
      type: String,
    },
    numberOfApprovedLoans: {
      type: String,
    },
    updatedAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  { timestamps: { updatedAt: true } }
);

module.exports = mongoose.model("Transaction", transactionSchema);
