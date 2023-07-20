const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    numberOfUsers: {
      type: String,
    },
    numberOfBooks: {
      type: String,
    },
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
    numberOfReleased: {
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

module.exports = mongoose.model("Inventory", inventorySchema);
