const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const VerifyToken = require("./Middleware/Middleware");

const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin:"*",
    credentials: true, //for cookies to work
  })
);
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("MongoDB database connection established successfully.");
  })
  .catch((err) => console.log(err));

// Routes
const signupRoute = require("./Routes/auth");
const doctorRoute = require("./Routes/doctor");
const patientRoute = require("./Routes/patient");

app.use("/auth", signupRoute);
app.use("/doctor", doctorRoute);
app.use("/patient", patientRoute);
//we pass token stored in cookies to this get request using authentication headers in request
//token now goes to middleware check middleware for next process
app.get("/users", VerifyToken, (req, res) => {
  res.json({ status: "authencated", data: req.userData }); //if middleware returns true it returns this reponse
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
