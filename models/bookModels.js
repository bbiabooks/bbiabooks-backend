const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bookDescription: {
      type: String,
      trim: true,
    },
    authors: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    ISBN: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    edition: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    gradeLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GradeLevel",
    },
    subjectArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectArea",
    },
    coverImage: {
      type: String,
      trim: true,
    },
    cloudinary_id: {
      type: String,
    },
    numberOfCopies: {
      type: Number,
      required: true,
    },
    numberOfLoanedOutCopies: {
      type: Number,
      default: 0,
    },
    numberOfSoldCopies: {
      type: Number,
      default: 0,
    },
    numberOfLostCopies: {
      type: Number,
      default: 0,
    },
    numberOfDamagedCopies: {
      type: Number,
      default: 0,
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
  },
  { timestamps: { updatedAt: true } } // this will update the default updatedAt from createdAt, changes when something is updated
);

module.exports = mongoose.model("Book", bookSchema);
