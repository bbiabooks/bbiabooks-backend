require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  cors({
    origin: "*",
  }),
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "Content-Type",
      "Authorization"
    );
    next();
  }
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// MIDDLEWARES
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// ROUTES IMPORT
//options
const userTypesRoutes = require("./routes/options/userTypes");
const suppliersRoutes = require("./routes/options/suppliers");
const subjectAreasRoutes = require("./routes/options/subjectAreas");
const branchesRoutes = require("./routes/options/branches");
const gradeLevelsRoutes = require("./routes/options/gradeLevels");
//processes
const booksRoutes = require("./routes/processes/books");
const ordersRoutes = require("./routes/processes/orders");
const loansRoutes = require("./routes/processes/loans");
//users
const usersRoutes = require("./routes/users");
const reportsRoutes = require("./routes/reports");
const signupsRoutes = require("./routes/signups");

// ROUTES
//options
app.use("/api/userTypes", userTypesRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/gradeLevels", gradeLevelsRoutes);
app.use("/api/subjectAreas", subjectAreasRoutes);
//processes
app.use("/api/books", booksRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/loans", loansRoutes);
//users
app.use("/api/users", usersRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/signups", signupsRoutes);

// CONNECT TO DB AND START LOCAL SERVER
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
