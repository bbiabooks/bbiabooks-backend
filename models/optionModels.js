const mongoose = require("mongoose");

// FOR USER INFORMATION
const userTypeSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
      unique: true,
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

const branchSchema = new mongoose.Schema(
  {
    branch: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
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

const gradeLevelSchema = new mongoose.Schema(
  {
    gradeLevel: {
      type: String,
      required: true,
      unique: true,
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

const subjectAreaSchema = new mongoose.Schema(
  {
    subjectArea: {
      type: String,
      required: true,
      unique: true,
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

// FOR BOOKS INFORMATION
const supplierSchema = new mongoose.Schema(
  {
    supplier: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
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

const UserType = mongoose.model("UserType", userTypeSchema);
const Branch = mongoose.model("Branch", branchSchema);
const GradeLevel = mongoose.model("GradeLevel", gradeLevelSchema);
const SubjectArea = mongoose.model("SubjectArea", subjectAreaSchema);
const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = {
  UserType,
  Branch,
  GradeLevel,
  SubjectArea,
  Supplier,
};
