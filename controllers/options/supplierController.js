const { Supplier } = require("../../models/optionModels");
const Report = require("../../models/reportModels");
const mongoose = require("mongoose");

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const { supplier, address, email, phoneNumber } = req.body;

    // Check if required field is empty.
    const requiredFields = ["supplier", "address", "email", "phoneNumber"];

    // If there's empty
    const emptyFields = requiredFields.filter((field) => !req.body[field]);
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        emptyFields,
      });
    }

    const suppliers = await Supplier.findOne({ supplier });
    if (suppliers) {
      throw new Error("Supplier name already exists.");
    }

    // Create document
    const newSupplier = new Supplier({
      supplier,
      address,
      email,
      phoneNumber,
    });

    // Upload document to database
    await newSupplier.save();

    // store report
    const user_id = req.userInfo.id;
    const action = "Created a supplier.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Supplier created successfully",
      newSupplier,
    });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .select("_id supplier address")
      .sort({ createdAt: -1 });

    // store report
    const user_id = req.userInfo.id;
    const action = "Accessed supplier table.";
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get a single supplier
const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Accessed supplier ${req.params.id} details.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.json(supplier);
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Update a supplier
const updateSupplier = async (req, res) => {
  const { id } = req.params;

  const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedSupplier) {
    return res.status(404).json({ message: "No such supplier" });
  } else {
    // store report
    const user_id = req.userInfo.id;
    const action = `Updated supplier ${id}.`;
    const newReport = new Report({
      user_id,
      action,
    });
    await newReport.save();

    res.status(201).json({
      message: "Supplier updated successfully",
      updatedSupplier,
    });
  }
};

// Delete a supplier
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    } else {
      // store report
      const user_id = req.userInfo.id;
      const action = `Deleted supplier ${req.params.id}.`;
      const newReport = new Report({
        user_id,
        action,
      });
      await newReport.save();

      res.status(201).json({
        message: "Supplier deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};
