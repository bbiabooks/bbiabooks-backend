const mongoose = require("mongoose");

const paymentStatusEnum = ["paid", "pending"];
const paymentMethodEnum = ["online", "cash"];
const orderStatusEnum = [
  "pending",
  "rejected",
  "placed",
  "available",
  "released",
];

const orderSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId, // ObjectId means we must enter the id of ref book in postman json
      ref: "Book",
    },
    orderStatus: {
      type: String,
      enum: orderStatusEnum,
      default: "pending",
    },
    reservedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    arrivalDate: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // this is equal to 7th day from date.now, just replace number "7" if you need different data
    },
    paymentStatus: {
      type: String,
      enum: paymentStatusEnum,
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: paymentMethodEnum,
    },
    cloudinary_id: {
      type: String,
    },
    proofOfPayment: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Date,
      default: () => Date.now(),
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { updatedAt: true } } // this will update the default updatedAt from createdAt, changes when something is updated
);

module.exports = mongoose.model("Order", orderSchema);
